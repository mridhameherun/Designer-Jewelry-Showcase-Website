import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BespokeConfig,
  BespokeBookingInput,
  calculateBespokeQuote,
  validateBespokeRequest,
} from '../utils/jewelryLogic';

gsap.registerPlugin(ScrollTrigger);
import {
  RotateCw,
  CheckCircle2,
  ArrowRight,
  Eye,
  ShieldCheck,
  Compass,
  Move3d,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface BespokeCadStudioProps {
  onCustomConceptSubmitted: (summary: {
    dossierId: string;
    config: BespokeConfig;
    atelierPrice: number;
    booking: BespokeBookingInput;
  }) => void;
}

type StudioViewMode = 'gold-studio' | 'cad-wireframe' | 'wax-replica';

/**
 * Builds a custom 3D faceted diamond/gemstone BufferGeometry with crown table,
 * star/bezel facets, girdle, and pavilion facets ending at a sharp culet.
 */
function createFacetedDiamondGeometry(cut: BespokeConfig['cut']): THREE.BufferGeometry {
  const segments = cut === 'emerald' ? 8 : cut === 'cushion' ? 12 : 16;
  const positions: number[] = [];

  const tableRadius = cut === 'emerald' ? 0.62 : 0.56;
  const girdleRadius = 1.0;
  const crownHeight = 0.28;
  const girdleTop = 0.04;
  const girdleBottom = -0.04;
  const culetY = -0.78;

  const getXY = (idx: number, radius: number, angleOffset = 0): [number, number] => {
    const theta = ((idx % segments) / segments) * Math.PI * 2 + angleOffset;
    let x = Math.cos(theta) * radius;
    let z = Math.sin(theta) * radius;

    if (cut === 'oval') {
      x *= 1.32;
      z *= 0.92;
    } else if (cut === 'emerald') {
      x *= 1.28;
      z *= 0.94;
    } else if (cut === 'cushion') {
      const sq = 0.12;
      x += Math.sign(x) * sq * radius;
      z += Math.sign(z) * sq * radius;
    } else if (cut === 'pear') {
      x *= 1.28;
      // Taper one end into a teardrop point
      const taper = x > 0 ? 1 - 0.38 * (x / (radius * 1.28)) : 1.05;
      z *= 0.9 * taper;
    }
    return [x, z];
  };

  const pushTri = (
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number]
  ) => {
    positions.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2], p3[0], p3[1], p3[2]);
  };

  const halfStep = Math.PI / segments;

  for (let i = 0; i < segments; i++) {
    const [tx1, tz1] = getXY(i, tableRadius);
    const [tx2, tz2] = getXY(i + 1, tableRadius);

    const [gx1, gz1] = getXY(i, girdleRadius);
    const [gxMid, gzMid] = getXY(i, girdleRadius * 1.02, halfStep);
    const [gx2, gz2] = getXY(i + 1, girdleRadius);

    // 1. Flat Crown Table
    pushTri([0, crownHeight, 0], [tx2, crownHeight, tz2], [tx1, crownHeight, tz1]);

    // 2. Crown Star & Bezel Facets
    pushTri([tx1, crownHeight, tz1], [tx2, crownHeight, tz2], [gxMid, girdleTop, gzMid]);
    pushTri([tx1, crownHeight, tz1], [gxMid, girdleTop, gzMid], [gx1, girdleTop, gz1]);
    pushTri([tx2, crownHeight, tz2], [gx2, girdleTop, gz2], [gxMid, girdleTop, gzMid]);

    // 3. Girdle Band
    pushTri([gx1, girdleTop, gz1], [gxMid, girdleTop, gzMid], [gx1, girdleBottom, gz1]);
    pushTri([gxMid, girdleTop, gzMid], [gxMid, girdleBottom, gzMid], [gx1, girdleBottom, gz1]);
    pushTri([gxMid, girdleTop, gzMid], [gx2, girdleTop, gz2], [gxMid, girdleBottom, gzMid]);
    pushTri([gx2, girdleTop, gz2], [gx2, girdleBottom, gz2], [gxMid, girdleBottom, gzMid]);

    // 4. Pavilion Facets down to Culet
    pushTri([gx1, girdleBottom, gz1], [gxMid, girdleBottom, gzMid], [0, culetY, 0]);
    pushTri([gxMid, girdleBottom, gzMid], [gx2, girdleBottom, gz2], [0, culetY, 0]);
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.computeVertexNormals();
  return geom;
}

export const BespokeCadStudio: React.FC<BespokeCadStudioProps> = ({ onCustomConceptSubmitted }) => {
  const [config, setConfig] = useState<BespokeConfig>({
    origin: 'mined',
    cut: 'oval',
    carat: 1.8,
    setting: 'whisper-pave',
    metal: '18k-champagne',
    ringSize: '6.0',
    engraving: 'Rare By Nature',
  });

  const [activeStepTab, setActiveStepTab] = useState<1 | 2 | 3>(1);
  const [rotationAngle, setRotationAngle] = useState<number>(28);
  const [pitchAngle, setPitchAngle] = useState<number>(22);
  const [cameraZoom, setCameraZoom] = useState<number>(4.3);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<StudioViewMode>('gold-studio');

  const [booking, setBooking] = useState<BespokeBookingInput>({
    fullName: '',
    email: '',
    consultationType: 'virtual',
    shippingAddress: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BespokeBookingInput, string>>>({});
  const [submittedDossier, setSubmittedDossier] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ringGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const prevPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationRef = useRef<number>(rotationAngle);
  const pitchRef = useRef<number>(pitchAngle);
  const autoRotateRef = useRef<boolean>(autoRotate);

  const quote = calculateBespokeQuote(config);

  useEffect(() => {
    rotationRef.current = rotationAngle;
  }, [rotationAngle]);

  useEffect(() => {
    pitchRef.current = pitchAngle;
  }, [pitchAngle]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0.9, cameraZoom);
      cameraRef.current.lookAt(0, 0.1, 0);
    }
  }, [cameraZoom]);

  // Initialize Three.js Scene, Renderer, Camera & Studio Environment
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(520, 360, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const camera = new THREE.PerspectiveCamera(36, 520 / 360, 0.1, 100);
    camera.position.set(0, 0.9, cameraZoom);
    camera.lookAt(0, 0.1, 0);

    // Key, Rim, and Sparkle Point Lights for Diamond Scintillation
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff6e5, 2.6);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd5c096, 1.8);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    const sparkleLight1 = new THREE.PointLight(0xffffff, 3.2, 12);
    sparkleLight1.position.set(2, 3.5, 2.5);
    scene.add(sparkleLight1);

    const sparkleLight2 = new THREE.PointLight(0xe0e8ff, 2.4, 12);
    sparkleLight2.position.set(-2.5, 2.5, 3);
    scene.add(sparkleLight2);

    // Subtle circular studio pedestal / CAD calibration ring underneath
    const gridGroup = new THREE.Group();
    gridGroup.position.y = -1.25;
    const outerCircleGeo = new THREE.RingGeometry(1.55, 1.57, 64);
    outerCircleGeo.rotateX(-Math.PI / 2);
    const outerCircleMat = new THREE.MeshBasicMaterial({
      color: 0xd5c096,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
    });
    gridGroup.add(new THREE.Mesh(outerCircleGeo, outerCircleMat));

    const innerCircleGeo = new THREE.RingGeometry(1.1, 1.11, 64);
    innerCircleGeo.rotateX(-Math.PI / 2);
    const innerCircleMat = new THREE.MeshBasicMaterial({
      color: 0xfcf9eb,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
    });
    gridGroup.add(new THREE.Mesh(innerCircleGeo, innerCircleMat));
    scene.add(gridGroup);

    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    ringGroupRef.current = ringGroup;
    cameraRef.current = camera;

    let animId = 0;
    let lastTick = performance.now();

    const animate = (now: number) => {
      const dt = now - lastTick;
      lastTick = now;

      if (autoRotateRef.current && !isDraggingRef.current) {
        const nextAngle = (rotationRef.current + dt * 0.032) % 360;
        rotationRef.current = nextAngle;
        setRotationAngle(Math.round(nextAngle));
      }

      if (ringGroupRef.current) {
        ringGroupRef.current.rotation.y = (rotationRef.current * Math.PI) / 180;
        ringGroupRef.current.rotation.x = (pitchRef.current * Math.PI) / 180;
      }

      // Subtle orbit of sparkle light to create realistic diamond facet fire
      const t = now * 0.0012;
      sparkleLight1.position.x = Math.cos(t) * 2.8;
      sparkleLight1.position.z = Math.sin(t) * 2.8;

      renderer.render(scene, camera);
      animId = window.requestAnimationFrame(animate);
    };

    animId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animId);
      pmremGenerator.dispose();
      renderer.dispose();
    };
  }, []);

  // Rebuild Parametric 3D Ring Geometry & Materials whenever config or viewMode changes
  useEffect(() => {
    const ringGroup = ringGroupRef.current;
    if (!ringGroup) return;

    // Clear previous meshes
    while (ringGroup.children.length > 0) {
      const child = ringGroup.children[0] as THREE.Mesh;
      if (child.geometry) child.geometry.dispose();
      ringGroup.remove(child);
    }

    // Determine Metal / Wax / CAD Material
    const metalColors: Record<BespokeConfig['metal'], number> = {
      '18k-champagne': 0xd8be8b,
      '18k-yellow': 0xe8c15a,
      '18k-white': 0xe8ecef,
      'platinum-950': 0xdde2e6,
    };

    const isWax = viewMode === 'wax-replica';
    const isWireframe = viewMode === 'cad-wireframe';

    const metalMaterial = isWax
      ? new THREE.MeshPhysicalMaterial({
          color: 0x5eb890,
          roughness: 0.32,
          metalness: 0.05,
          transmission: 0.25,
          thickness: 0.8,
          clearcoat: 0.6,
          wireframe: false,
        })
      : new THREE.MeshPhysicalMaterial({
          color: metalColors[config.metal],
          metalness: isWireframe ? 0.6 : 0.96,
          roughness: isWireframe ? 0.28 : 0.12,
          clearcoat: 0.4,
          reflectivity: 1.0,
        });

    const cadOverlayMaterial = new THREE.MeshBasicMaterial({
      color: 0xd5c096,
      wireframe: true,
      transparent: true,
      opacity: 0.42,
    });

    const diamondMaterial = isWax
      ? new THREE.MeshPhysicalMaterial({
          color: 0x9be2c0,
          roughness: 0.18,
          metalness: 0.05,
          transmission: 0.55,
          ior: 1.55,
          clearcoat: 0.8,
        })
      : new THREE.MeshPhysicalMaterial({
          color: config.origin === 'mined' ? 0xffffff : 0xf6f9ff,
          metalness: 0.02,
          roughness: 0.0,
          transmission: isWireframe ? 0.55 : 0.94,
          ior: 2.417, // Pure diamond refractive index
          thickness: 1.8,
          envMapIntensity: 2.8,
          clearcoat: 1.0,
          clearcoatRoughness: 0.0,
          specularIntensity: 1.0,
        });

    const diamondWireframeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: isWireframe ? 0.75 : 0.14,
    });

    const shankRadius = 0.88;
    const tubeRadius = config.setting === 'bezel-heirloom' ? 0.095 : 0.072;

    // 1. Main 18k Ring Shank (Torus)
    const shankGeo = new THREE.TorusGeometry(shankRadius, tubeRadius, 32, 96);
    const shankMesh = new THREE.Mesh(shankGeo, metalMaterial);
    shankMesh.position.y = -0.12;
    ringGroup.add(shankMesh);

    if (isWireframe) {
      const shankWire = new THREE.Mesh(
        new THREE.TorusGeometry(shankRadius, tubeRadius * 1.01, 14, 42),
        cadOverlayMaterial
      );
      shankWire.position.y = -0.12;
      ringGroup.add(shankWire);
    }

    // 2. Center Gemstone Scaling & Position
    const caratScale = 0.28 + Math.pow(config.carat, 0.38) * 0.22;
    const gemY = shankRadius - 0.12 + tubeRadius + 0.14;

    const diamondGeo = createFacetedDiamondGeometry(config.cut);
    diamondGeo.scale(caratScale, caratScale, caratScale);

    const diamondMesh = new THREE.Mesh(diamondGeo, diamondMaterial);
    diamondMesh.position.set(0, gemY, 0);
    ringGroup.add(diamondMesh);

    // Subtle facet highlight mesh (or bold CAD wireframe in CAD mode)
    const diamondWireMesh = new THREE.Mesh(diamondGeo.clone(), diamondWireframeMat);
    diamondWireMesh.position.set(0, gemY, 0);
    diamondWireMesh.scale.setScalar(1.003);
    ringGroup.add(diamondWireMesh);

    // 3. Gallery Basket / Prongs / Bezel / Halo based on `config.setting`
    if (config.setting === 'bezel-heirloom') {
      // Sculpted Mirror Bezel Rim around the stone girdle
      const bezelGeo = new THREE.TorusGeometry(caratScale * 0.98, 0.055, 24, 64);
      bezelGeo.rotateX(Math.PI / 2);
      if (config.cut === 'oval' || config.cut === 'emerald' || config.cut === 'pear') {
        bezelGeo.scale(1.28, 1, 0.92);
      }
      const bezelMesh = new THREE.Mesh(bezelGeo, metalMaterial);
      bezelMesh.position.set(0, gemY, 0);
      ringGroup.add(bezelMesh);
    } else {
      // 4 Sculpted Claw Prongs + Under-Gallery Rail
      const railGeo = new THREE.TorusGeometry(caratScale * 0.72, 0.028, 16, 48);
      railGeo.rotateX(Math.PI / 2);
      if (config.cut === 'oval' || config.cut === 'emerald' || config.cut === 'pear') {
        railGeo.scale(1.25, 1, 0.92);
      }
      const railMesh = new THREE.Mesh(railGeo, metalMaterial);
      railMesh.position.set(0, gemY - caratScale * 0.22, 0);
      ringGroup.add(railMesh);

      const prongAngles = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
      const rxFactor =
        config.cut === 'oval' || config.cut === 'emerald' || config.cut === 'pear' ? 1.24 : 0.98;
      const rzFactor =
        config.cut === 'oval' || config.cut === 'emerald' || config.cut === 'pear' ? 0.9 : 0.98;

      prongAngles.forEach((ang) => {
        const px = Math.cos(ang) * caratScale * rxFactor;
        const pz = Math.sin(ang) * caratScale * rzFactor;
        const prongGeo = new THREE.CylinderGeometry(0.024, 0.036, caratScale * 0.85, 12);
        const prongMesh = new THREE.Mesh(prongGeo, metalMaterial);
        prongMesh.position.set(px * 0.88, gemY - caratScale * 0.14, pz * 0.88);
        // Tilt prong slightly outward to hug the pavilion
        prongMesh.lookAt(px * 1.15, gemY + caratScale * 0.3, pz * 1.15);
        prongMesh.rotateX(Math.PI / 2);
        ringGroup.add(prongMesh);

        // Claw tip
        const tipGeo = new THREE.SphereGeometry(0.032, 12, 12);
        const tipMesh = new THREE.Mesh(tipGeo, metalMaterial);
        tipMesh.position.set(px * 0.95, gemY + caratScale * 0.06, pz * 0.95);
        ringGroup.add(tipMesh);
      });
    }

    // Cathedral Shoulders for `cathedral-solitaire`
    if (config.setting === 'cathedral-solitaire') {
      [-1, 1].forEach((side) => {
        const archGeo = new THREE.TorusGeometry(0.32, 0.042, 16, 32, Math.PI * 0.65);
        const archMesh = new THREE.Mesh(archGeo, metalMaterial);
        archMesh.position.set(side * 0.34, gemY - 0.32, 0);
        archMesh.rotation.z = side === 1 ? Math.PI * 0.15 : Math.PI * 0.2;
        ringGroup.add(archMesh);
      });
    }

    // Vintage Halo for `vintage-halo`
    if (config.setting === 'vintage-halo') {
      const haloCount = 18;
      const haloRx =
        caratScale * (config.cut === 'oval' || config.cut === 'emerald' ? 1.42 : 1.18);
      const haloRz = caratScale * (config.cut === 'oval' || config.cut === 'emerald' ? 1.08 : 1.18);
      const meleeGeo = new THREE.OctahedronGeometry(0.042, 1);

      for (let h = 0; h < haloCount; h++) {
        const th = (h / haloCount) * Math.PI * 2;
        const mMesh = new THREE.Mesh(meleeGeo, diamondMaterial);
        mMesh.position.set(Math.cos(th) * haloRx, gemY - 0.03, Math.sin(th) * haloRz);
        ringGroup.add(mMesh);
      }
    }

    // Micro-Pavé Shank Diamonds for `whisper-pave` and `vintage-halo`
    if (config.setting === 'whisper-pave' || config.setting === 'vintage-halo') {
      const paveCount = 16;
      const paveGeo = new THREE.OctahedronGeometry(0.038, 1);
      for (let i = -paveCount / 2; i <= paveCount / 2; i++) {
        if (Math.abs(i) <= 1) continue; // Leave space right under center collet
        const angle = Math.PI / 2 + i * 0.13;
        const px = Math.cos(angle) * (shankRadius + tubeRadius * 0.72);
        const py = -0.12 + Math.sin(angle) * (shankRadius + tubeRadius * 0.72);
        const pMesh = new THREE.Mesh(paveGeo, diamondMaterial);
        pMesh.position.set(px, py, 0);
        ringGroup.add(pMesh);
      }
    }

    // Subtle GSAP 3D scale flourish when switching stone cut, setting, alloy, or view mode
    gsap.fromTo(
      ringGroup.scale,
      { x: 0.9, y: 0.9, z: 0.9 },
      { x: 1, y: 1, z: 1, duration: 0.65, ease: 'back.out(2)' }
    );
  }, [config, viewMode]);

  // Pointer Drag Handlers for Direct 3D Orbit
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    setAutoRotate(false);
    prevPointerRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - prevPointerRef.current.x;
    const dy = e.clientY - prevPointerRef.current.y;
    prevPointerRef.current = { x: e.clientX, y: e.clientY };

    const nextRot = (rotationRef.current + dx * 0.65 + 360) % 360;
    const nextPitch = Math.max(-35, Math.min(65, pitchRef.current + dy * 0.45));

    rotationRef.current = nextRot;
    pitchRef.current = nextPitch;
    setRotationAngle(Math.round(nextRot));
    setPitchAngle(Math.round(nextPitch));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateBespokeRequest(booking);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    const dossierId = `CAD-${Math.floor(100000 + ((config.carat * 1000 + rotationAngle) % 899999))}`;
    setSubmittedDossier(dossierId);
    onCustomConceptSubmitted({
      dossierId,
      config,
      atelierPrice: quote.atelierPrice,
      booking,
    });
  };

  return (
    <section
      id="bespoke-studio"
      className="w-full bg-[#242325] text-[#FCF9EB] py-28 lg:py-36 px-6 sm:px-12 lg:px-16 border-t border-[#636364]/30"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div
          data-gsap-section-header
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end pb-16 border-b border-[#636364]/30"
        >
          <div className="lg:col-span-7">
            <p
              data-gsap-header-reveal
              className="font-tabular-mono text-xs tracking-[0.22em] uppercase text-[#D5C096] mb-4"
            >
              02 · THE BESPOKE EXPERIENCE
            </p>
            <h2
              data-gsap-header-reveal
              className="text-3xl sm:text-5xl font-light tracking-[0.04em] uppercase leading-[1.1] text-balance"
            >
              Co-Create Your Masterpiece in 3 Steps
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p
              data-gsap-header-reveal
              className="text-base sm:text-lg font-light text-[#FCF9EB]/80 leading-relaxed"
            >
              Have a vision no showroom can match? Work directly with our master bench jewellers to bring your dream
              piece to life—with zero markup over our collection prices.
            </p>
          </div>
        </div>

        {/* 3 Steps Interactive Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 my-16 lg:my-20">
          <button
            type="button"
            onClick={() => {
              setActiveStepTab(1);
              setViewMode('cad-wireframe');
            }}
            className={`text-left p-8 lg:p-10 border transition-all cursor-pointer ${
              activeStepTab === 1
                ? 'bg-[#FDFBF7] text-[#242325] border-[#FDFBF7]'
                : 'bg-[#1B1A1C] text-[#FCF9EB] border-[#636364]/35 hover:border-[#D5C096]'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-tabular-mono text-xs tracking-[0.2em] uppercase opacity-80">STEP 01</span>
              <Compass className="w-4 h-4 opacity-60" />
            </div>
            <h3 className="text-xl font-medium tracking-wide uppercase mb-3">Private Consultation</h3>
            <p className={`text-sm font-light leading-relaxed ${activeStepTab === 1 ? 'text-[#242325]/80' : 'text-[#FCF9EB]/70'}`}>
              Chat virtually or in-person to select your ethically mined or lab-grown centre stone.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveStepTab(2);
              setViewMode('wax-replica');
            }}
            className={`text-left p-8 lg:p-10 border transition-all cursor-pointer ${
              activeStepTab === 2
                ? 'bg-[#FDFBF7] text-[#242325] border-[#FDFBF7]'
                : 'bg-[#1B1A1C] text-[#FCF9EB] border-[#636364]/35 hover:border-[#D5C096]'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-tabular-mono text-xs tracking-[0.2em] uppercase opacity-80">STEP 02</span>
              <Eye className="w-4 h-4 opacity-60" />
            </div>
            <h3 className="text-xl font-medium tracking-wide uppercase mb-3">3D CAD & Wax Preview</h3>
            <p className={`text-sm font-light leading-relaxed ${activeStepTab === 2 ? 'text-[#242325]/80' : 'text-[#FCF9EB]/70'}`}>
              Inspect a 360-degree digital render and have a 3D wax replica shipped to your door to try on before we cast in gold.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveStepTab(3);
              setViewMode('gold-studio');
            }}
            className={`text-left p-8 lg:p-10 border transition-all cursor-pointer ${
              activeStepTab === 3
                ? 'bg-[#FDFBF7] text-[#242325] border-[#FDFBF7]'
                : 'bg-[#1B1A1C] text-[#FCF9EB] border-[#636364]/35 hover:border-[#D5C096]'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-tabular-mono text-xs tracking-[0.2em] uppercase opacity-80">STEP 03</span>
              <ShieldCheck className="w-4 h-4 opacity-60" />
            </div>
            <h3 className="text-xl font-medium tracking-wide uppercase mb-3">Master Hand-Forging</h3>
            <p className={`text-sm font-light leading-relaxed ${activeStepTab === 3 ? 'text-[#242325]/80' : 'text-[#FCF9EB]/70'}`}>
              Your piece is hand-set, microscopically inspected, and delivered in discreet, luxury packaging.
            </p>
          </button>
        </div>

        {/* Interactive 360° 3D WebGL Ring Studio & Bespoke Builder */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch bg-[#1B1A1C] border border-[#636364]/35 p-8 sm:p-12 lg:p-16">
          {/* Left: Real-Time 360° 3D WebGL Viewport */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-[#141315] border border-[#636364]/30 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#636364]/25">
              <div>
                <span className="font-tabular-mono text-xs tracking-[0.16em] uppercase text-[#D5C096] flex items-center gap-2">
                  <Move3d className="w-3.5 h-3.5" />
                  <span>INTERACTIVE 360° 3D RING VIEWPORT</span>
                </span>
                <p className="text-xs text-[#FCF9EB]/65 font-light mt-1">
                  Drag in any direction to orbit 3D model · Live parametric stone & setting
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('gold-studio')}
                  className={`px-3.5 py-1.5 rounded-full text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === 'gold-studio'
                      ? 'bg-[#D5C096] text-[#242325] font-medium'
                      : 'border border-[#636364] text-[#FCF9EB]/80 hover:border-[#D5C096]'
                  }`}
                >
                  18k Gold 3D
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cad-wireframe')}
                  className={`px-3.5 py-1.5 rounded-full text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === 'cad-wireframe'
                      ? 'bg-[#FCF9EB] text-[#242325] font-medium'
                      : 'border border-[#636364] text-[#FCF9EB]/80 hover:border-[#FCF9EB]'
                  }`}
                >
                  3D CAD Mesh
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('wax-replica')}
                  className={`px-3.5 py-1.5 rounded-full text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === 'wax-replica'
                      ? 'bg-[#88C9A1] text-[#141315] font-medium'
                      : 'border border-[#636364] text-[#FCF9EB]/80 hover:border-[#88C9A1]'
                  }`}
                >
                  Wax Replica
                </button>
              </div>
            </div>

            {/* 3D WebGL Canvas + Telemetry HUD */}
            <div className="relative my-6 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(213,192,150,0.12)_0%,rgba(20,19,21,0)_70%)] rounded-xs overflow-hidden">
              <canvas
                ref={canvasRef}
                width={520}
                height={360}
                data-testid="bespoke-cad-canvas"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="w-full max-w-[520px] h-[320px] sm:h-[360px] cursor-grab active:cursor-grabbing touch-none"
              />

              {/* Top-left live CAD telemetry overlay */}
              <div className="absolute top-3 left-3 pointer-events-none space-y-1 font-tabular-mono text-[11px] text-[#D5C096]/90">
                <p>
                  STONE: {config.carat.toFixed(2)}CT {config.cut.toUpperCase()} ({config.origin.toUpperCase()})
                </p>
                <p>
                  ALLOY: {config.metal.toUpperCase()} // {config.setting.toUpperCase()}
                </p>
              </div>

              {/* Top-right 3D zoom buttons */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCameraZoom((z) => Math.max(2.9, +(z - 0.4).toFixed(1)))}
                  aria-label="Zoom in 3D model"
                  title="Zoom In"
                  className="w-8 h-8 rounded-full bg-[#242325]/85 border border-[#636364]/60 text-[#FCF9EB] hover:border-[#D5C096] flex items-center justify-center cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCameraZoom((z) => Math.min(5.6, +(z + 0.4).toFixed(1)))}
                  aria-label="Zoom out 3D model"
                  title="Zoom Out"
                  className="w-8 h-8 rounded-full bg-[#242325]/85 border border-[#636364]/60 text-[#FCF9EB] hover:border-[#D5C096] flex items-center justify-center cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bottom telemetry */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none font-tabular-mono text-[10px] text-[#FCF9EB]/55 uppercase tracking-wider">
                <span>YAW: {rotationAngle}° · PITCH: {pitchAngle}°</span>
                <span>DRAG TO ORBIT 3D</span>
              </div>
            </div>

            <div className="pt-6 border-t border-[#636364]/25 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                <label htmlFor="cad-rotation-slider" className="font-tabular-mono text-xs text-[#FCF9EB]/80 whitespace-nowrap">
                  Rotate 360°
                </label>
                <input
                  id="cad-rotation-slider"
                  type="range"
                  min={0}
                  max={360}
                  value={rotationAngle}
                  onChange={(e) => {
                    setAutoRotate(false);
                    const val = Number(e.target.value);
                    rotationRef.current = val;
                    setRotationAngle(val);
                  }}
                  className="w-full accent-[#D5C096] cursor-pointer"
                />
              </div>
              <button
                type="button"
                onClick={() => setAutoRotate((r) => !r)}
                className="px-4 py-2 rounded-full border border-[#636364] text-xs text-[#FCF9EB] hover:bg-[#FCF9EB] hover:text-[#242325] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{autoRotate ? 'Pause Turntable' : 'Auto-Rotate 360°'}</span>
              </button>
            </div>
          </div>

          {/* Right: Bespoke Configuration & Free 3D Concept Request */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#636364]/30 pb-6">
                <div>
                  <span className="font-tabular-mono text-xs uppercase tracking-[0.16em] text-[#D5C096]">
                    ZERO-MARKUP BENCH QUOTE
                  </span>
                  <div className="flex items-baseline gap-3.5 mt-2">
                    <span className="text-3xl sm:text-4xl font-light font-tabular-mono text-[#FCF9EB]">
                      ${quote.atelierPrice.toLocaleString()}
                    </span>
                    <span className="text-sm font-tabular-mono text-[#FCF9EB]/50 line-through">
                      Showroom Retail: ${quote.traditionalBoutiquePrice.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="font-tabular-mono text-xs text-[#D5C096] block">
                    Save ${quote.savingsAmount.toLocaleString()} ({quote.savingsPercent}%)
                  </span>
                  <span className="text-xs text-[#FCF9EB]/65 block mt-1">
                    Wax replica ships in {quote.waxPreviewShipDays} days
                  </span>
                </div>
              </div>

              {/* Stone Origin & Cut Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div>
                  <label className="block text-xs uppercase tracking-[0.14em] text-[#FCF9EB]/80 mb-3">
                    1. Centre Stone Origin
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, origin: 'mined' })}
                      className={`py-2.5 px-3 rounded-full text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        config.origin === 'mined'
                          ? 'bg-[#FCF9EB] text-[#242325] font-medium'
                          : 'border border-[#636364] text-[#FCF9EB]/80 hover:border-[#FCF9EB]'
                      }`}
                    >
                      Ethically Mined
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, origin: 'lab' })}
                      className={`py-2.5 px-3 rounded-full text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        config.origin === 'lab'
                          ? 'bg-[#FCF9EB] text-[#242325] font-medium'
                          : 'border border-[#636364] text-[#FCF9EB]/80 hover:border-[#FCF9EB]'
                      }`}
                    >
                      Solar Lab-Grown
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="bespoke-cut-select" className="block text-xs uppercase tracking-[0.14em] text-[#FCF9EB]/80 mb-3">
                    2. Diamond / Gemstone Cut
                  </label>
                  <select
                    id="bespoke-cut-select"
                    value={config.cut}
                    onChange={(e) => setConfig({ ...config, cut: e.target.value as BespokeConfig['cut'] })}
                    className="w-full py-2.5 px-4 rounded-full bg-[#242325] border border-[#636364] text-xs text-[#FCF9EB]"
                  >
                    <option value="oval">Oval Brilliant (Elongated Fire)</option>
                    <option value="emerald">Emerald Step Cut (Hall of Mirrors)</option>
                    <option value="solitaire-round">Ideal Round Brilliant (Maximum Sparkle)</option>
                    <option value="cushion">Antique Cushion Cut (Romantic Pillow)</option>
                    <option value="pear">Tapered Pear Cut (Sculptural Drop)</option>
                  </select>
                </div>
              </div>

              {/* Carat, Setting & Precious Alloy Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div>
                  <div className="flex justify-between text-xs uppercase tracking-[0.14em] text-[#FCF9EB]/80 mb-3">
                    <label htmlFor="bespoke-carat-range">3. Carat Weight</label>
                    <span className="font-tabular-mono text-[#D5C096]">{config.carat.toFixed(2)} ct</span>
                  </div>
                  <input
                    id="bespoke-carat-range"
                    type="range"
                    min={0.8}
                    max={3.5}
                    step={0.1}
                    value={config.carat}
                    onChange={(e) => setConfig({ ...config, carat: parseFloat(e.target.value) })}
                    className="w-full accent-[#D5C096] cursor-pointer mt-1.5"
                  />
                </div>

                <div>
                  <label htmlFor="bespoke-setting-select" className="block text-xs uppercase tracking-[0.14em] text-[#FCF9EB]/80 mb-3">
                    4. Architectural Setting
                  </label>
                  <select
                    id="bespoke-setting-select"
                    value={config.setting}
                    onChange={(e) => setConfig({ ...config, setting: e.target.value as BespokeConfig['setting'] })}
                    className="w-full py-2.5 px-4 rounded-full bg-[#242325] border border-[#636364] text-xs text-[#FCF9EB]"
                  >
                    <option value="whisper-pave">Whisper Micro-Pavé + Hidden Halo</option>
                    <option value="cathedral-solitaire">Architectural Cathedral Solitaire</option>
                    <option value="bezel-heirloom">Low-Profile Mirror Bezel</option>
                    <option value="vintage-halo">Millegrain Vintage Halo</option>
                  </select>
                </div>
              </div>

              {/* 5. 18k Gold & Platinum Alloy Selector (Updates 3D Ring Material Live) */}
              <div className="mt-6">
                <label className="block text-xs uppercase tracking-[0.14em] text-[#FCF9EB]/80 mb-3">
                  5. Precious Metal Alloy
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: '18k-champagne' as const, label: '18k Champagne' },
                    { id: '18k-yellow' as const, label: '18k Yellow Gold' },
                    { id: '18k-white' as const, label: '18k White Gold' },
                    { id: 'platinum-950' as const, label: 'Platinum 950' },
                  ].map((metalOpt) => (
                    <button
                      key={metalOpt.id}
                      type="button"
                      onClick={() => setConfig({ ...config, metal: metalOpt.id })}
                      className={`py-2 px-3 rounded-full text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        config.metal === metalOpt.id
                          ? 'bg-[#D5C096] text-[#242325] font-medium'
                          : 'border border-[#636364] text-[#FCF9EB]/80 hover:border-[#D5C096]'
                      }`}
                    >
                      {metalOpt.label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-5 text-xs font-tabular-mono text-[#FCF9EB]/65">
                Spec: {quote.giaGradeSummary}
              </p>
            </div>

            {/* Free 3D Concept & Wax Replica Form */}
            {submittedDossier ? (
              <div className="p-8 bg-[#242325] border border-[#D5C096] space-y-4">
                <div className="flex items-center gap-2.5 text-[#D5C096]">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-tabular-mono text-xs uppercase tracking-[0.16em]">
                    3D CAD Concept & Wax Replica Reserved ({submittedDossier})
                  </span>
                </div>
                <p className="text-sm text-[#FCF9EB]/90 font-light leading-relaxed">
                  Thank you, <strong className="font-medium">{booking.fullName}</strong>. Master Bench Jeweller Henri V. is preparing your 360° CAD render for{' '}
                  <span className="underline">{booking.email}</span> and your complimentary 3D wax replica will ship to{' '}
                  <span className="text-[#D5C096]">{booking.shippingAddress}</span> within 3 business days.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedDossier(null)}
                  className="px-6 py-2.5 rounded-full border border-[#FCF9EB]/50 text-xs uppercase tracking-wider hover:bg-[#FCF9EB] hover:text-[#242325] transition-colors cursor-pointer"
                >
                  Configure Another Bespoke Piece
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 pt-6 border-t border-[#636364]/30" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bespoke-name" className="block text-xs text-[#FCF9EB]/80 mb-2">
                      Your Full Name
                    </label>
                    <input
                      id="bespoke-name"
                      type="text"
                      placeholder="e.g. Elena Rostova"
                      value={booking.fullName}
                      onChange={(e) => setBooking({ ...booking, fullName: e.target.value })}
                      className="w-full py-3 px-4 rounded-full bg-[#242325] border border-[#636364] text-sm text-[#FCF9EB] placeholder-[#FCF9EB]/40"
                    />
                    {errors.fullName && <p className="text-xs text-[#D5C096] mt-1.5">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label htmlFor="bespoke-email" className="block text-xs text-[#FCF9EB]/80 mb-2">
                      Email for 360° CAD Link
                    </label>
                    <input
                      id="bespoke-email"
                      type="email"
                      placeholder="elena@domain.com"
                      value={booking.email}
                      onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                      className="w-full py-3 px-4 rounded-full bg-[#242325] border border-[#636364] text-sm text-[#FCF9EB] placeholder-[#FCF9EB]/40"
                    />
                    {errors.email && <p className="text-xs text-[#D5C096] mt-1.5">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="bespoke-address" className="block text-xs text-[#FCF9EB]/80 mb-2">
                    Delivery Address for Complimentary Try-On 3D Wax Replica
                  </label>
                  <input
                    id="bespoke-address"
                    type="text"
                    placeholder="Street address, City, Postal Code"
                    value={booking.shippingAddress}
                    onChange={(e) => setBooking({ ...booking, shippingAddress: e.target.value })}
                    className="w-full py-3 px-4 rounded-full bg-[#242325] border border-[#636364] text-sm text-[#FCF9EB] placeholder-[#FCF9EB]/40"
                  />
                  {errors.shippingAddress && <p className="text-xs text-[#D5C096] mt-1.5">{errors.shippingAddress}</p>}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-full bg-[#FCF9EB] text-[#242325] font-medium text-sm tracking-wider uppercase hover:scale-[1.01] transition-transform flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Start Your Custom Design (Free 3D Concept)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
