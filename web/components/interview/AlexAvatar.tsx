"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type AvatarState = "speaking" | "listening" | "transitioning";

const MODEL_URL = "/AIFarmer.glb";

export function AlexAvatar({ state }: { state: AvatarState }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<AvatarState>(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId = -1;
    let alive  = true;

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas, alpha: true, antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(260, 310);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    // ── Scene + lights ────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    scene.add(new THREE.AmbientLight(0xffffff, 1.10));

    const key = new THREE.DirectionalLight(0xfff8f0, 1.80);
    key.position.set(0.5, 2.0, 3.5);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xb8d0f8, 0.40);
    fill.position.set(-2.5, 0.5, 1.5);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0x7c3aed, 0.50);
    rim.position.set(0.3, -1.0, -3.0);
    scene.add(rim);

    const cyanRim = new THREE.DirectionalLight(0x06b6d4, 0.30);
    cyanRim.position.set(-1.5, 0.5, -2.0);
    scene.add(cyanRim);

    // ── Camera ────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(28, 260 / 310, 0.001, 100);

    // ── Model ref (set after load) ────────────────────────────────────────
    let model: THREE.Group | null = null;
    let modelBaseY = 0; // resting Y position after centering

    // ── Render loop ───────────────────────────────────────────────────────
    let lastT = performance.now();

    function tick() {
      if (!alive) return;
      animId = requestAnimationFrame(tick);

      const now = performance.now();
      const dt  = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      const t        = now * 0.001;
      const speaking = stateRef.current === "speaking";

      if (model) {
        // ── Idle breathing — always on ────────────────────────────────────
        // Very gentle sine-wave Y lift (chest rising)
        const breathSpeed = speaking ? 1.8 : 1.0;
        const breathAmp   = speaking ? 0.006 : 0.003;
        model.position.y  = modelBaseY + Math.sin(t * breathSpeed) * breathAmp;

        // ── Subtle sway — listening side-to-side ─────────────────────────
        const swayAmp = speaking ? 0.006 : 0.003;
        model.rotation.z  = Math.sin(t * 0.55) * swayAmp;

        // ── Speaking micro-nod ────────────────────────────────────────────
        if (speaking) {
          // Fast irregular nodding while mouth would be open
          model.rotation.x =
            Math.sin(t * 6.5) * 0.009 +
            Math.sin(t * 9.0) * 0.004;
        } else {
          // Decay back to neutral
          model.rotation.x *= 0.85;
        }
      }

      renderer.render(scene, camera);
    }

    // ── Load model ────────────────────────────────────────────────────────
    const loader = new GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (!alive) return;

        model = gltf.scene;
        scene.add(model);

        // ── Full scene inventory ──────────────────────────────────────────
        console.group("[alex] Full model inventory");
        console.log("Animations:", gltf.animations.map(a => a.name));
        model.traverse((node) => {
          const tag =
            node instanceof THREE.SkinnedMesh ? "SkinnedMesh" :
            node instanceof THREE.Mesh        ? "Mesh"        :
            node instanceof THREE.Bone        ? "Bone"        :
            node instanceof THREE.Group       ? "Group"       : node.type;
          const morphInfo = (node instanceof THREE.Mesh && node.morphTargetDictionary)
            ? ` morphs=[${Object.keys(node.morphTargetDictionary).join(", ")}]`
            : "";
          console.log(`  [${tag}] "${node.name}"${morphInfo}`);
        });
        console.groupEnd();

        // ── Auto-scale: normalize to 2-unit height ────────────────────────
        const box    = new THREE.Box3().setFromObject(model);
        const size   = box.getSize(new THREE.Vector3());
        const scale  = 2.0 / Math.max(size.y, 0.001);
        model.scale.setScalar(scale);

        // Center X/Z, stand on Y=0
        box.setFromObject(model);
        const c = box.getCenter(new THREE.Vector3());
        model.position.set(-c.x, -box.min.y, -c.z);
        modelBaseY = model.position.y;

        // ── Re-measure and position camera for chest-up bust shot ───────────
        box.setFromObject(model);
        const totalH = box.max.y - box.min.y; // ~2.0

        // Tight portrait: only show the top ~25% of the model (face + neck + top of shoulders).
        // This crops out T-pose arms which sit at ~50–70% of model height.
        // FOV=12 + camera at face level + Z=1.5× height achieves this.
        const faceY = totalH * 0.93;  // camera Y — at upper face/forehead level
        const lookY = totalH * 0.88;  // lookAt — face/chin center
        const camZ  = totalH * 1.50;  // distance back (3.0 for 2-unit model)

        camera.fov = 12; // narrow crop — only the top ~25% of body is visible
        camera.updateProjectionMatrix();
        camera.position.set(0, faceY, camZ);
        camera.lookAt(0, lookY, 0);

        console.log(`[alex] camera: Y=${faceY.toFixed(2)} Z=${camZ.toFixed(2)} lookAt Y=${lookY.toFixed(2)} fov=12`);

        tick();
      },
      (p) => {
        if (p.total) console.log(`[alex] loading ${Math.round(p.loaded / p.total * 100)}%`);
      },
      (err) => {
        console.error("[alex] load error:", err);
        tick();
      },
    );

    return () => {
      alive = false;
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  const speaking = state === "speaking";

  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div
        animate={speaking
          ? { scale: [1, 1.08, 1], opacity: [0.55, 0.90, 0.55] }
          : { scale: 1,            opacity: 0.40 }}
        transition={{ duration: 2.4, repeat: speaking ? Infinity : 0, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: -28,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.22) 0%, rgba(6,182,212,0.07) 55%, transparent 78%)",
          filter: "blur(18px)",
          pointerEvents: "none",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: 260, height: 310, background: "transparent" }}
      />
    </div>
  );
}
