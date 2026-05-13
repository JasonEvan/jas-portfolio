import * as THREE from "three";
import type { LanyardConfig, LanyardState } from "~/types/lanyard";

export function createLanyardScene(
  canvas: HTMLCanvasElement,
  config: LanyardConfig,
) {
  const scene = new THREE.Scene();
  const getRect = () => canvas.getBoundingClientRect();
  const initialRect = getRect();
  const width = initialRect.width || 300;
  const height = initialRect.height || 500;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 5);
  camera.lookAt(0, -1, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Pencahayaan dramatis cocok dark theme
  scene.add(new THREE.AmbientLight(0xffffff, 0.8)); // Brighter ambient

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
  keyLight.position.set(5, 5, 5);
  keyLight.castShadow = true;
  scene.add(keyLight);

  // Rim light biru electric
  const rimLight = new THREE.DirectionalLight(0x4488ff, 1.5);
  rimLight.position.set(-5, 0, 5);
  scene.add(rimLight);

  // Tali
  const ropeMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0f,
    roughness: 0.7,
    metalness: 0.15,
  });
  // Initialize with a dummy geometry, will be updated in updateFromState
  const ropeMesh = new THREE.Mesh(new THREE.BufferGeometry(), ropeMat);
  ropeMesh.castShadow = true;
  scene.add(ropeMesh);

  // Klip logam silver
  const clipGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.18, 12);
  const clipMat = new THREE.MeshStandardMaterial({
    color: 0xbbbbbb,
    metalness: 0.95,
    roughness: 0.05,
  });
  const clipMesh = new THREE.Mesh(clipGeom, clipMat);
  clipMesh.position.set(0, 0.09, 0);
  scene.add(clipMesh);

  // ID Card
  const loader = new THREE.TextureLoader();
  const cardTexture = loader.load(config.cardTexturePath);
  const cardGeom = new THREE.BoxGeometry(
    config.cardWidth,
    config.cardHeight,
    0.022,
  );
  const cardMat = [
    new THREE.MeshStandardMaterial({ color: 0x111122 }),
    new THREE.MeshStandardMaterial({ color: 0x111122 }),
    new THREE.MeshStandardMaterial({ color: 0x111122 }),
    new THREE.MeshStandardMaterial({ color: 0x111122 }),
    new THREE.MeshStandardMaterial({ map: cardTexture }), // muka depan
    new THREE.MeshStandardMaterial({ color: 0x0a0a18 }), // belakang
  ];
  const cardMesh = new THREE.Mesh(cardGeom, cardMat);
  cardMesh.castShadow = true;
  cardMesh.scale.set(1.5, 1.5, 1.5); // Scale up the card
  scene.add(cardMesh);

  // Foto di atas muka kartu
  const photoMat = new THREE.MeshBasicMaterial({ transparent: true });
  const photoPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(0.55, 0.55),
    photoMat,
  );
  photoPlane.scale.set(1.5, 1.5, 1.5); // Match card scale
  scene.add(photoPlane);

  /** Load foto dari base64 Firestore */
  const setPhotoBase64 = (base64: string) => {
    const img = new Image();
    img.onload = () => {
      photoMat.map = new THREE.CanvasTexture(img as any);
      photoMat.needsUpdate = true;
    };
    img.src = base64;
  };

  const updateFromState = (state: LanyardState) => {
    const pts = state.points;
    if (pts.length < 2) return;

    const curve = new THREE.CatmullRomCurve3(
      pts.map((p) => new THREE.Vector3(p.pos.x, p.pos.y, p.pos.z)),
    );
    ropeMesh.geometry.dispose();
    ropeMesh.geometry = new THREE.TubeGeometry(curve, 48, 0.028, 8, false);

    const last = pts[pts.length - 1];
    const prev = pts[pts.length - 2];

    if (!last || !prev) return;

    cardMesh.position.set(
      last.pos.x,
      last.pos.y - config.cardHeight / 2,
      last.pos.z,
    );
    cardMesh.quaternion.slerp(
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(
          last.pos.x - prev.pos.x,
          last.pos.y - prev.pos.y,
          last.pos.z - prev.pos.z,
        ).normalize(),
      ),
      0.25,
    );

    clipMesh.position.set(last.pos.x, last.pos.y, last.pos.z);
    clipMesh.quaternion.copy(cardMesh.quaternion);

    photoPlane.position.copy(cardMesh.position);
    photoPlane.position.z += 0.016;
    photoPlane.position.y += 0.2;
    photoPlane.quaternion.copy(cardMesh.quaternion);
  };

  const handleResize = () => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return;
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    renderer.setSize(rect.width, rect.height);
  };
  window.addEventListener("resize", handleResize);

  const render = () => renderer.render(scene, camera);
  const dispose = () => {
    window.removeEventListener("resize", handleResize);
    renderer.dispose();
  };

  return { render, updateFromState, setPhotoBase64, camera, dispose };
}
