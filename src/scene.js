import * as THREE from "three";

const INK = 0x253740;
const CREAM = 0xfff8e7;
const CORAL = 0xff705b;
const YELLOW = 0xffd15c;
const MINT = 0x7ed9c7;
const BLUE = 0x7fd4e7;

function makeToonTexture() {
  const data = new Uint8Array([72, 132, 198, 255]);
  const tex = new THREE.DataTexture(data, 4, 1, THREE.RedFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

function softCircleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 1, 32, 32, 31);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.55, "rgba(255,255,255,.9)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(32, 32, 31, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function signTexture(title, sub) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 240;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff4d2";
  ctx.fillRect(0, 0, 512, 240);
  ctx.strokeStyle = "#253740";
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, 492, 220);
  ctx.fillStyle = "#ff705b";
  ctx.beginPath();
  ctx.arc(65, 67, 27, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#253740";
  ctx.font = "900 78px Arial Black, Arial";
  ctx.textAlign = "center";
  ctx.fillText(title, 260, 112);
  ctx.font = "700 38px Arial";
  ctx.letterSpacing = "8px";
  ctx.fillText(sub, 260, 174);
  ctx.fillStyle = "#7ed9c7";
  ctx.beginPath();
  ctx.arc(430, 187, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffd15c";
  ctx.beginPath();
  ctx.arc(74, 188, 9, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function createWorld(canvas, { onPick } = {}) {
  const captureMode = new URLSearchParams(location.search).has("capture");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: captureMode,
    });
  } catch (err) {
    console.warn("WebGL unavailable", err);
    return null;
  }

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = !captureMode;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 120);
  const world = new THREE.Group();
  scene.add(world);

  const gradientMap = makeToonTexture();
  const outlineMat = new THREE.MeshBasicMaterial({
    color: INK,
    side: THREE.BackSide,
  });
  const basic = (color, extra = {}) =>
    new THREE.MeshBasicMaterial({ color, ...extra });
  const toon = (color, extra = {}) =>
    new THREE.MeshToonMaterial({ color, gradientMap, ...extra });

  const palette = {
    grass: toon(0x92d879),
    grassDark: toon(0x6fbe6d),
    soil: toon(0xc58a5e),
    sand: toon(0xf0d49b),
    rock: toon(0xbd9270),
    rockDark: toon(0x9b765e),
    cream: toon(CREAM),
    white: toon(0xfffdf6),
    coral: toon(CORAL),
    coralDark: toon(0xdf5145),
    yellow: toon(YELLOW),
    orange: toon(0xff9e5e),
    mint: toon(MINT),
    blue: toon(BLUE),
    sea: toon(0x69cfe2),
    seaDeep: toon(0x3da9ca),
    water: toon(0x5ac9de),
    ink: basic(INK),
    pink: toon(0xffa6ba),
    plum: toon(0xffb7cb),
    purple: toon(0xa88bea),
    purpleDark: toon(0x8163c9),
    wood: toon(0xa86e49),
    woodDark: toon(0x805337),
    roof: toon(0x3e8078),
    red: toon(0xe5574c),
    green: toon(0x56a975),
    greenDark: toon(0x367f5f),
    dark: toon(0x34464e),
    glass: basic(0xbff3ff),
    glow: new THREE.MeshToonMaterial({
      color: 0xffc95d,
      emissive: 0xff9c3b,
      emissiveIntensity: 0.15,
      gradientMap,
    }),
  };

  const pickRoots = [];
  const nightMaterials = [];
  const bounceTargets = new Map();
  const tmpV = new THREE.Vector3();

  function registerPick(group, id) {
    group.traverse((obj) => {
      if (obj.isMesh) {
        obj.userData.pickId = id;
        group.userData.pickId = id;
      }
    });
    pickRoots.push(group);
    bounceTargets.set(id, group);
  }

  function outline(mesh, amount = 1.055) {
    if (!mesh.geometry) return mesh;
    const o = new THREE.Mesh(mesh.geometry, outlineMat);
    o.scale.setScalar(amount);
    o.castShadow = false;
    o.receiveShadow = false;
    mesh.add(o);
    return mesh;
  }

  function add(parent, geo, material, pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1], opts = {}) {
    const m = new THREE.Mesh(geo, material);
    m.position.set(...pos);
    m.rotation.set(...rot);
    m.scale.set(...scale);
    m.castShadow = opts.cast ?? false;
    m.receiveShadow = opts.receive ?? true;
    if (opts.outline) outline(m, opts.outline === true ? 1.045 : opts.outline);
    parent.add(m);
    return m;
  }

  function cylinderBetween(parent, a, b, radius, material, segments = 8, opts = {}) {
    const start = new THREE.Vector3(...a);
    const end = new THREE.Vector3(...b);
    const dir = new THREE.Vector3().subVectors(end, start);
    const len = dir.length();
    const geo = new THREE.CylinderGeometry(radius, radius, len, segments);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    mesh.castShadow = opts.cast ?? false;
    mesh.receiveShadow = true;
    if (opts.outline) outline(mesh, opts.outline === true ? 1.06 : opts.outline);
    parent.add(mesh);
    return mesh;
  }

  function addFace(parent, x, y, z, s = 1, mood = "happy", rotY = 0) {
    const f = new THREE.Group();
    f.position.set(x, y, z);
    f.rotation.y = rotY;
    f.scale.setScalar(s);
    parent.add(f);
    const eyeMat = basic(INK);
    const whiteMat = basic(0xffffff);
    const eyeGeo = new THREE.CircleGeometry(0.057, 14);
    const left = new THREE.Mesh(eyeGeo, mood === "wink" ? whiteMat : eyeMat);
    if (mood === "wink") {
      const lid = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.018, 6, 12, Math.PI), basic(INK));
      lid.position.set(-0.14, 0.015, 0.004);
      lid.rotation.z = Math.PI;
      f.add(lid);
    } else {
      left.position.set(-0.14, 0.015, 0.012);
      left.scale.set(1, 1.18, 1);
      f.add(left);
    }
    const right = new THREE.Mesh(eyeGeo, eyeMat);
    right.position.set(0.14, 0.015, 0.012);
    right.scale.set(1, 1.18, 1);
    f.add(right);
    const shine = new THREE.Mesh(new THREE.CircleGeometry(0.016, 8), whiteMat);
    shine.position.set(0.16, 0.038, 0.017);
    f.add(shine);
    if (mood !== "wink") {
      const shine2 = new THREE.Mesh(new THREE.CircleGeometry(0.012, 8), whiteMat);
      shine2.position.set(-0.125, 0.038, 0.017);
      f.add(shine2);
    }
    const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.017, 6, 14, Math.PI), basic(INK));
    mouth.position.set(0, -0.09, 0.012);
    mouth.rotation.z = Math.PI;
    f.add(mouth);
    const blushMat = basic(0xff9aae);
    const blushGeo = new THREE.CircleGeometry(0.038, 10);
    [-1, 1].forEach((side) => {
      const b = new THREE.Mesh(blushGeo, blushMat);
      b.position.set(side * 0.225, -0.055, 0.006);
      b.scale.set(1, 0.7, 1);
      f.add(b);
    });
    return f;
  }

  function faceHalo(color) {
    const spriteMat = new THREE.SpriteMaterial({
      map: softCircleTexture(),
      color,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    return new THREE.Sprite(spriteMat);
  }

  // ---------------- island ----------------
  const island = new THREE.Group();
  island.position.y = 0.02;
  world.add(island);

  const seaRing = add(
    island,
    new THREE.RingGeometry(4.65, 6.0, 64),
    new THREE.MeshToonMaterial({
      color: 0x6fd2e4,
      gradientMap,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.98,
    }),
    [0, -0.24, 0],
    [-Math.PI / 2, 0, 0],
    [1, 1, 1],
    { receive: true }
  );
  seaRing.receiveShadow = true;

  add(island, new THREE.TorusGeometry(6.0, 0.07, 6, 64), palette.cream, [0, -0.18, 0], [-Math.PI / 2, 0, 0], [1, 1, 1]);
  const foam = add(island, new THREE.TorusGeometry(5.9, 0.035, 5, 64), basic(0xd8fbff), [0, -0.18, 0], [-Math.PI / 2, 0, 0]);
  foam.material.transparent = true;
  foam.material.opacity = 0.85;

  add(island, new THREE.CylinderGeometry(4.95, 5.25, 0.28, 40), palette.sand, [0, -0.05, 0], [0, 0, 0], [1, 1, 1], { receive: true });
  add(island, new THREE.CylinderGeometry(4.72, 4.95, 0.35, 40), palette.grassDark, [0, 0.2, 0], [0, 0, 0], [1, 1, 1], { receive: true });
  add(island, new THREE.CylinderGeometry(4.62, 4.74, 0.2, 40), palette.grass, [0, 0.44, 0], [0, 0, 0], [1, 1, 1], { receive: true });

  const rockGeo = new THREE.ConeGeometry(4.55, 3.5, 12, 2);
  const rock = add(island, rockGeo, palette.rock, [0, -2.1, 0], [Math.PI, 0, 0], [1, 1, 1], { receive: true });
  rock.castShadow = false;
  add(island, new THREE.DodecahedronGeometry(0.85, 0), palette.rockDark, [-2.8, -2.3, 0.4], [0.2, 0.3, 0.1], [1, 1.5, 0.9]);
  add(island, new THREE.DodecahedronGeometry(0.65, 0), palette.rock, [2.4, -2.9, -0.6], [0.5, 0.1, 0.3], [0.9, 1.6, 1]);
  add(island, new THREE.DodecahedronGeometry(0.45, 0), palette.rockDark, [0.4, -3.5, 0.3], [0.2, 0.6, 0.1], [1, 1.4, 1]);

  // ---------------- paths ----------------
  function groundPath(points, width = 0.14, color = 0xf6e9c4) {
    const curve = new THREE.CatmullRomCurve3(points);
    const geo = new THREE.TubeGeometry(curve, 32, width, 5, false);
    const m = add(island, geo, toon(color), [0, 0.555, 0], [0, 0, 0], [1, 1, 1]);
    m.receiveShadow = true;
    return m;
  }

  groundPath(
    [
      new THREE.Vector3(-3.9, 0, 2.6),
      new THREE.Vector3(-2.2, 0, 1.9),
      new THREE.Vector3(-0.3, 0, 2.7),
      new THREE.Vector3(1.7, 0, 2.4),
      new THREE.Vector3(3.5, 0, 1.2),
    ],
    0.15
  );
  groundPath(
    [
      new THREE.Vector3(1.7, 0, 2.4),
      new THREE.Vector3(1.1, 0, 0.7),
      new THREE.Vector3(1.9, 0, -0.7),
      new THREE.Vector3(3.1, 0, -1.4),
    ],
    0.11,
    0xf1dfb5
  );

  // ---------------- trees & flowers ----------------
  function makeTree(x, z, s = 1, color = 0x5ca96b) {
    const g = new THREE.Group();
    g.position.set(x, 0.5, z);
    g.scale.setScalar(s);
    island.add(g);
    add(g, new THREE.CylinderGeometry(0.09, 0.13, 0.75, 7), palette.wood, [0, 0.3, 0], [0, 0, 0], [1, 1, 1], { outline: 1.1 });
    const leafMat = toon(color);
    add(g, new THREE.SphereGeometry(0.48, 10, 8), leafMat, [0, 0.95, 0], [0, 0, 0], [1, 0.85, 1], { outline: 1.055, cast: true });
    add(g, new THREE.SphereGeometry(0.33, 9, 7), leafMat, [-0.35, 0.78, 0.06], [0, 0, 0], [1, 1, 1], { outline: 1.055 });
    add(g, new THREE.SphereGeometry(0.3, 9, 7), leafMat, [0.32, 0.8, -0.02], [0, 0, 0], [1, 1, 1], { outline: 1.055 });
    return g;
  }

  makeTree(-4.25, -0.9, 0.95, 0x58a977);
  makeTree(-3.0, 3.2, 0.78, 0x69b77a);
  makeTree(4.2, 0.7, 0.92, 0x4f9f75);
  makeTree(2.9, 3.25, 0.58, 0x71bb6d);
  makeTree(-4.3, 3.65, 0.55, 0x71bb6d);
  makeTree(0.4, -3.1, 0.7, 0x4d956a);

  const flowerGeo = new THREE.SphereGeometry(0.055, 6, 5);
  const flowerColors = [0xffb1c4, 0xffdf74, 0xfff6dc, 0xa8c7ff, 0xd8b7ff];
  const flowerMeshes = flowerColors.map((c) => {
    const mat = toon(c);
    const inst = new THREE.InstancedMesh(flowerGeo, mat, 24);
    inst.castShadow = false;
    inst.receiveShadow = false;
    island.add(inst);
    return inst;
  });
  const dummy = new THREE.Object3D();
  let fi = 0;
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2 + (i % 7) * 0.23;
    const r = 4.25 - (i % 5) * 0.07;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    if (z > 1.4 && x > -1.4 && x < 2.2) continue;
    dummy.position.set(x, 0.59, z);
    dummy.scale.setScalar(0.8 + (i % 4) * 0.16);
    dummy.updateMatrix();
    flowerMeshes[fi % flowerMeshes.length].setMatrixAt(fi % 24, dummy.matrix);
    fi++;
  }
  flowerMeshes.forEach((m) => (m.instanceMatrix.needsUpdate = true));

  // ---------------- Ohori pond ----------------
  const ohori = new THREE.Group();
  ohori.position.set(-2.35, 0.57, 0.05);
  ohori.rotation.y = 0.26;
  island.add(ohori);

  const pondShape = new THREE.Shape();
  pondShape.moveTo(-1.45, 0.08);
  pondShape.bezierCurveTo(-1.5, 0.55, -0.95, 0.8, -0.35, 0.72);
  pondShape.bezierCurveTo(0.35, 0.84, 1.1, 0.6, 1.32, 0.2);
  pondShape.bezierCurveTo(1.5, -0.22, 1.0, -0.67, 0.38, -0.62);
  pondShape.bezierCurveTo(-0.3, -0.76, -1.1, -0.55, -1.28, -0.22);
  pondShape.bezierCurveTo(-1.36, -0.1, -1.44, 0.01, -1.45, 0.08);
  const pondGeo = new THREE.ShapeGeometry(pondShape, 22);
  const pond = add(ohori, pondGeo, palette.water, [0, 0.01, 0], [-Math.PI / 2, 0, 0], [1, 1, 1]);
  pond.receiveShadow = true;
  const pondEdgePoints = pondShape.getPoints(42).map((p) => new THREE.Vector3(p.x, 0.035, -p.y));
  const pondEdge = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(pondEdgePoints),
    new THREE.LineBasicMaterial({ color: 0x2f7f8e, transparent: true, opacity: 0.65 })
  );
  ohori.add(pondEdge);

  const ripples = [];
  for (let i = 0; i < 3; i++) {
    const r = add(
      ohori,
      new THREE.TorusGeometry(0.18 + i * 0.16, 0.009, 4, 24),
      basic(0xd7fbff),
      [-0.25 + i * 0.17, 0.045, 0.15 - i * 0.1],
      [-Math.PI / 2, 0, 0]
    );
    r.material.transparent = true;
    r.material.opacity = 0.8;
    ripples.push(r);
  }

  const bridge = new THREE.Group();
  bridge.position.set(-1.2, 0.14, -0.23);
  bridge.rotation.y = -0.38;
  ohori.add(bridge);
  add(bridge, new THREE.BoxGeometry(0.9, 0.07, 0.32), palette.cream, [0, 0, 0], [0, 0, -0.08], [1, 1, 1], { outline: 1.05 });
  [-0.32, 0, 0.32].forEach((x) => {
    add(bridge, new THREE.BoxGeometry(0.055, 0.22, 0.05), palette.coral, [x, 0.13, -0.12], [0, 0, 0], [1, 1, 1], { outline: 1.1 });
    add(bridge, new THREE.BoxGeometry(0.055, 0.22, 0.05), palette.coral, [x, 0.13, 0.12], [0, 0, 0], [1, 1, 1], { outline: 1.1 });
  });
  add(bridge, new THREE.BoxGeometry(0.9, 0.045, 0.035), palette.coral, [0, 0.25, -0.12], [0, 0, -0.08], [1, 1, 1]);

  const swan = new THREE.Group();
  swan.position.set(0.45, 0.12, 0.1);
  swan.rotation.y = -0.38;
  ohori.add(swan);
  add(swan, new THREE.SphereGeometry(0.3, 12, 8), palette.white, [0, 0.08, 0], [0, 0, 0], [1, 0.55, 1.25], { outline: 1.055, cast: true });
  const neckCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.16, 0.12, 0.2),
    new THREE.Vector3(-0.28, 0.42, 0.22),
    new THREE.Vector3(-0.18, 0.62, 0.24),
    new THREE.Vector3(0.0, 0.65, 0.26),
  ]);
  add(swan, new THREE.TubeGeometry(neckCurve, 12, 0.065, 6, false), palette.white, [0, 0, 0], [0, 0, 0], [1, 1, 1], { outline: 1.08 });
  add(swan, new THREE.SphereGeometry(0.16, 10, 8), palette.white, [0.02, 0.66, 0.26], [0, 0, 0], [1, 0.9, 1], { outline: 1.06 });
  add(swan, new THREE.ConeGeometry(0.075, 0.18, 8), palette.orange, [0.18, 0.64, 0.28], [0, 0, -Math.PI / 2], [1, 1, 1], { outline: 1.08 });
  addFace(swan, 0.02, 0.68, 0.405, 0.58, "happy");

  // pond-side benches & trees
  makeTree(-3.75, 0.2, 0.75, 0x4c9b6c);
  makeTree(-1.05, 0.9, 0.5, 0x65b274);

  // ---------------- ramen mascot ----------------
  const bowl = new THREE.Group();
  bowl.position.set(-0.52, 1.02, 2.42);
  bowl.rotation.y = 0.13;
  bowl.scale.setScalar(1.27);
  island.add(bowl);

  const bowlGeo = new THREE.SphereGeometry(0.95, 26, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  add(bowl, bowlGeo, palette.coral, [0, 0, 0], [0, 0, 0], [1, 0.78, 1], { outline: 1.04, cast: true });
  add(bowl, new THREE.TorusGeometry(0.94, 0.075, 8, 34), palette.cream, [0, 0.01, 0], [-Math.PI / 2, 0, 0], [1, 1, 1], { outline: 1.05 });
  add(bowl, new THREE.CylinderGeometry(0.86, 0.86, 0.03, 30), toon(0xf4b551), [0, 0.08, 0], [0, 0, 0], [1, 1, 1]);
  add(bowl, new THREE.CircleGeometry(0.83, 30), toon(0xffc35f), [0, 0.1, 0], [-Math.PI / 2, 0, 0], [1, 1, 1]);

  const noodleMat = toon(0xffdb70);
  const noodleArcs = [
    [0.46, 0.06, 0.42, 0.35],
    [0.58, 0.05, 0.62, -0.2],
    [0.36, 0.04, 0.38, 1.5],
    [0.52, 0.02, 0.52, 2.5],
    [0.32, 0.03, 0.44, -1.1],
  ];
  noodleArcs.forEach(([r, y, tube, rot], i) => {
    add(
      bowl,
      new THREE.TorusGeometry(r, tube * 0.1 + 0.015, 5, 20, Math.PI * (1.1 + (i % 3) * 0.2)),
      noodleMat,
      [-0.05 + i * 0.03, y + 0.11, 0.02],
      [-Math.PI / 2, 0, rot],
      [1, 1, 1]
    );
  });

  const egg = new THREE.Group();
  egg.position.set(0.33, 0.18, 0.21);
  egg.rotation.y = -0.2;
  bowl.add(egg);
  add(egg, new THREE.SphereGeometry(0.23, 14, 9), palette.white, [0, 0, 0], [0, 0, 0], [1, 0.55, 1.1], { outline: 1.06 });
  add(egg, new THREE.SphereGeometry(0.12, 12, 8), toon(0xffa33d), [0, 0.035, 0], [0, 0, 0], [1, 0.55, 1.05]);
  addFace(egg, 0, 0.06, 0.12, 0.42, "happy");

  add(bowl, new THREE.CylinderGeometry(0.2, 0.2, 0.035, 14), toon(0xb9704a), [-0.38, 0.16, 0.08], [0, 0, 0], [1, 1, 1]);
  add(bowl, new THREE.CylinderGeometry(0.16, 0.16, 0.03, 14), toon(0xb9704a), [-0.16, 0.15, 0.42], [0, 0, 0], [0.85, 1, 0.9]);
  add(bowl, new THREE.CylinderGeometry(0.12, 0.12, 0.035, 12), palette.white, [0.16, 0.15, -0.37], [0, 0, 0], [1, 1, 1]);
  add(bowl, new THREE.TorusGeometry(0.045, 0.016, 5, 10), palette.pink, [0.16, 0.175, -0.37], [-Math.PI / 2, 0, 0]);

  addFace(bowl, 0, -0.19, 0.91, 1.18, "happy");

  // bowl arms
  cylinderBetween(bowl, [-0.86, 0.03, 0.03], [-1.13, 0.38, 0.09], 0.048, palette.cream, 7, { outline: 1.12 });
  cylinderBetween(bowl, [0.86, -0.02, 0.03], [1.1, 0.24, 0.14], 0.048, palette.cream, 7, { outline: 1.12 });
  add(bowl, new THREE.SphereGeometry(0.075, 8, 6), palette.cream, [-1.14, 0.39, 0.09], [0, 0, 0], [1, 1, 1], { outline: 1.1 });
  add(bowl, new THREE.SphereGeometry(0.075, 8, 6), palette.cream, [1.1, 0.25, 0.14], [0, 0, 0], [1, 1, 1], { outline: 1.1 });
  add(bowl, new THREE.SphereGeometry(0.08, 8, 6), palette.cream, [1.2, 0.35, 0.16], [0, 0, 0], [1, 1, 1], { outline: 1.1 });

  // chopsticks
  const stickMat = toon(0xb98655);
  add(bowl, new THREE.CylinderGeometry(0.023, 0.018, 1.25, 6), stickMat, [0.62, 0.63, 0.14], [0, 0, -0.48], [1, 1, 1], { outline: 1.12 });
  add(bowl, new THREE.CylinderGeometry(0.023, 0.018, 1.25, 6), stickMat, [0.75, 0.66, 0.21], [0, 0, -0.43], [1, 1, 1], { outline: 1.12 });

  registerPick(bowl, "ramen");

  // ---------------- mentaiko sidekick ----------------
  const mentai = new THREE.Group();
  mentai.position.set(1.65, 0.68, 3.0);
  mentai.rotation.y = -0.35;
  mentai.scale.setScalar(0.92);
  island.add(mentai);
  add(mentai, new THREE.CylinderGeometry(0.4, 0.34, 0.22, 18), palette.white, [0, 0.08, 0], [0, 0, 0], [1, 1, 1], { outline: 1.05 });
  add(mentai, new THREE.SphereGeometry(0.37, 14, 9), toon(0xfffbef), [0, 0.18, 0], [0, 0, 0], [1, 0.32, 1]);
  add(mentai, new THREE.SphereGeometry(0.3, 14, 10), palette.coral, [0, 0.42, 0], [0, 0, 0], [1.15, 0.8, 0.85], { outline: 1.06, cast: true });
  add(mentai, new THREE.SphereGeometry(0.22, 12, 8), palette.coral, [0.24, 0.38, 0], [0, 0, 0.25], [1, 0.8, 0.9], { outline: 1.06 });
  addFace(mentai, 0.05, 0.42, 0.285, 0.7, "wink");
  add(mentai, new THREE.SphereGeometry(0.06, 7, 5), toon(0xffd1ac), [-0.2, 0.32, 0.24], [0, 0, 0], [1, 1, 1]);
  add(mentai, new THREE.SphereGeometry(0.06, 7, 5), toon(0xffd1ac), [0.27, 0.3, 0.2], [0, 0, 0], [1, 1, 1]);
  add(mentai, new THREE.SphereGeometry(0.13, 9, 7), palette.green, [0.02, 0.72, 0], [0, 0, 0.5], [1, 0.35, 0.7], { outline: 1.1 });

  // ---------------- yatai ----------------
  const yatai = new THREE.Group();
  yatai.position.set(3.1, 0.55, 1.75);
  yatai.rotation.y = -0.22;
  yatai.scale.setScalar(0.94);
  island.add(yatai);

  add(yatai, new THREE.BoxGeometry(1.28, 0.56, 0.8), palette.wood, [0, 0.44, 0], [0, 0, 0], [1, 1, 1], { outline: 1.035, cast: true });
  add(yatai, new THREE.BoxGeometry(1.45, 0.09, 0.92), palette.cream, [0, 0.77, 0], [0, 0, 0], [1, 1, 1], { outline: 1.04 });
  add(yatai, new THREE.BoxGeometry(0.95, 0.34, 0.55), toon(0xfff0c7), [0, 0.26, 0.68], [0, 0, 0], [1, 1, 1], { outline: 1.06 });
  add(yatai, new THREE.BoxGeometry(0.68, 0.09, 0.38), palette.red, [0, 0.09, 0.32], [0, 0, 0], [1, 1, 1]);

  // posts
  [-0.6, 0.6].forEach((x) => {
    [-0.36, 0.36].forEach((z) => {
      add(yatai, new THREE.CylinderGeometry(0.035, 0.04, 0.9, 6), palette.woodDark, [x, 1.18, z], [0, 0, x * 0.04], [1, 1, 1], { outline: 1.12 });
    });
  });
  add(yatai, new THREE.BoxGeometry(1.5, 0.1, 0.98), palette.red, [0, 1.62, 0], [0, 0, 0], [1, 1, 1], { outline: 1.04, cast: true });
  add(yatai, new THREE.BoxGeometry(1.32, 0.08, 0.84), toon(0xffe9b0), [0, 1.56, 0], [0, 0, 0], [1, 1, 1]);
  for (let i = -2; i <= 2; i++) {
    add(yatai, new THREE.BoxGeometry(0.13, 0.06, 0.9), palette.cream, [i * 0.28, 1.585, 0], [0, 0, 0], [1, 1, 1]);
  }
  // noren
  for (let i = 0; i < 3; i++) {
    add(yatai, new THREE.BoxGeometry(0.27, 0.33, 0.03), palette.red, [-0.3 + i * 0.3, 1.33, 0.47], [0, 0, 0], [1, 1, 1], { outline: 1.09 });
    add(yatai, new THREE.BoxGeometry(0.27, 0.055, 0.035), palette.cream, [-0.3 + i * 0.3, 1.19, 0.472], [0, 0, 0], [1, 1, 1]);
  }
  addFace(yatai, 0, 0.42, 0.412, 0.66, "happy");
  add(yatai, new THREE.BoxGeometry(0.24, 0.19, 0.02), toon(0xfff6dd), [0, 0.6, 0.414], [0, 0, 0], [1, 1, 1]);

  // lanterns
  const lanterns = [];
  [-0.56, 0.56].forEach((x, idx) => {
    const l = new THREE.Group();
    l.position.set(x, 1.26, 0.56);
    yatai.add(l);
    const mat = new THREE.MeshToonMaterial({
      color: 0xffc65a,
      emissive: 0xff8c36,
      emissiveIntensity: 0.2,
      gradientMap,
    });
    add(l, new THREE.SphereGeometry(0.15, 10, 8), mat, [0, 0, 0], [0, 0, 0], [1, 1.25, 1], { outline: 1.08, cast: true });
    add(l, new THREE.CylinderGeometry(0.09, 0.09, 0.035, 8), palette.ink, [0, 0.17, 0], [0, 0, 0], [1, 1, 1]);
    add(l, new THREE.CylinderGeometry(0.09, 0.09, 0.035, 8), palette.ink, [0, -0.17, 0], [0, 0, 0], [1, 1, 1]);
    addFace(l, 0, 0.0, 0.135, 0.33, idx === 0 ? "happy" : "wink");
    l.userData.baseY = 1.26;
    lanterns.push(l);
    nightMaterials.push({ mat, day: 0.15, night: 1.25 });
  });
  add(yatai, new THREE.CylinderGeometry(0.14, 0.17, 0.1, 10), palette.cream, [0.45, 0.84, 0.35], [0, 0, 0], [1, 1, 1], { outline: 1.08 });
  add(yatai, new THREE.CylinderGeometry(0.13, 0.13, 0.06, 10), toon(0xf2b64e), [0.45, 0.9, 0.35], [0, 0, 0], [1, 1, 1]);
  add(yatai, new THREE.TorusGeometry(0.095, 0.025, 5, 12, Math.PI * 1.2), palette.cream, [0.45, 0.94, 0.35], [Math.PI / 2, 0, 0]);

  // stools
  [-0.45, 0.36].forEach((x, i) => {
    const st = new THREE.Group();
    st.position.set(x, 0.34, 0.78 + i * 0.05);
    yatai.add(st);
    add(st, new THREE.CylinderGeometry(0.19, 0.16, 0.09, 10), palette.cream, [0, 0.24, 0], [0, 0, 0], [1, 1, 1], { outline: 1.07 });
    add(st, new THREE.CylinderGeometry(0.035, 0.04, 0.25, 6), palette.woodDark, [0, 0.06, 0], [0, 0, 0], [1, 1, 1]);
  });

  // cat on the roof
  const cat = new THREE.Group();
  cat.position.set(-0.42, 1.68, 0.12);
  yatai.add(cat);
  add(cat, new THREE.SphereGeometry(0.15, 10, 8), palette.white, [0, 0, 0], [0, 0, 0], [0.9, 1, 1.15], { outline: 1.08 });
  add(cat, new THREE.SphereGeometry(0.12, 10, 8), palette.white, [0.11, 0.13, 0.02], [0, 0, 0], [1, 1, 1], { outline: 1.08 });
  add(cat, new THREE.ConeGeometry(0.06, 0.11, 4), palette.white, [0.06, 0.25, 0.02], [0, 0, 0.2], [1, 1, 1], { outline: 1.12 });
  add(cat, new THREE.ConeGeometry(0.06, 0.11, 4), palette.white, [0.17, 0.24, 0.02], [0, 0, -0.2], [1, 1, 1], { outline: 1.12 });
  addFace(cat, 0.12, 0.13, 0.132, 0.32, "wink");
  const tail = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.12, 0.01, 0),
    new THREE.Vector3(-0.28, 0.08, 0.06),
    new THREE.Vector3(-0.34, 0.26, 0.12),
  ]);
  add(cat, new THREE.TubeGeometry(tail, 8, 0.035, 5, false), palette.white, [0, 0, 0], [0, 0, 0]);

  registerPick(yatai, "yatai");

  // ---------------- tower ----------------
  const tower = new THREE.Group();
  tower.position.set(1.55, 0.56, -1.95);
  tower.rotation.y = 0.06;
  tower.scale.setScalar(1.07);
  island.add(tower);

  add(tower, new THREE.CylinderGeometry(0.92, 1.0, 0.26, 18), palette.cream, [0, 0.1, 0], [0, 0, 0], [1, 1, 1], { outline: 1.04 });
  add(tower, new THREE.CylinderGeometry(0.62, 0.72, 0.38, 14), toon(0xf3e5c9), [0, 0.34, 0], [0, 0, 0], [1, 1, 1], { outline: 1.04 });

  const body = add(
    tower,
    new THREE.CylinderGeometry(0.38, 0.83, 5.3, 3),
    palette.white,
    [0, 2.95, 0],
    [0, Math.PI / 6, 0],
    [1, 1, 1],
    { outline: 1.045, cast: true }
  );
  body.castShadow = true;
  add(tower, new THREE.CylinderGeometry(0.72, 0.76, 0.12, 3), palette.coral, [0, 1.05, 0], [0, Math.PI / 6, 0], [1, 1, 1], { outline: 1.06 });
  add(tower, new THREE.CylinderGeometry(0.58, 0.62, 0.11, 3), palette.coral, [0, 2.05, 0], [0, Math.PI / 6, 0], [1, 1, 1], { outline: 1.06 });
  add(tower, new THREE.CylinderGeometry(0.47, 0.5, 0.1, 3), palette.coral, [0, 3.95, 0], [0, Math.PI / 6, 0], [1, 1, 1], { outline: 1.06 });
  add(tower, new THREE.CylinderGeometry(0.38, 0.41, 0.1, 3), palette.coral, [0, 4.94, 0], [0, Math.PI / 6, 0], [1, 1, 1], { outline: 1.06 });

  // windows
  for (let i = 0; i < 4; i++) {
    const y = 1.3 + i * 0.83;
    for (let s = -1; s <= 1; s++) {
      const a = s * 0.42;
      add(tower, new THREE.BoxGeometry(0.16, 0.13, 0.055), palette.glass, [Math.sin(a) * 0.62, y, Math.cos(a) * 0.62], [0, a, 0], [1, 1, 1]);
    }
  }

  // observation deck
  const deckMat = new THREE.MeshToonMaterial({
    color: 0xff7059,
    emissive: 0xff7040,
    emissiveIntensity: 0.05,
    gradientMap,
  });
  add(tower, new THREE.CylinderGeometry(0.95, 0.95, 0.62, 3), deckMat, [0, 3.48, 0], [0, Math.PI / 6, 0], [1, 1, 1], { outline: 1.04, cast: true });
  add(tower, new THREE.CylinderGeometry(1.0, 1.0, 0.16, 3), palette.cream, [0, 3.15, 0], [0, Math.PI / 6, 0], [1, 1, 1], { outline: 1.05 });
  add(tower, new THREE.CylinderGeometry(0.86, 0.86, 0.14, 3), palette.cream, [0, 3.78, 0], [0, Math.PI / 6, 0], [1, 1, 1], { outline: 1.05 });
  for (let i = 0; i < 3; i++) {
    const a = -0.9 + i * 0.9;
    add(tower, new THREE.BoxGeometry(0.23, 0.15, 0.06), toon(0xbff2ff), [Math.sin(a) * 0.83, 3.52, Math.cos(a) * 0.83], [0, a, 0], [1, 1, 1]);
  }
  addFace(tower, 0, 3.5, 0.74, 0.78, "happy");
  nightMaterials.push({ mat: deckMat, day: 0.05, night: 0.9 });

  // upper + antenna
  add(tower, new THREE.CylinderGeometry(0.18, 0.38, 1.35, 3), palette.white, [0, 4.45, 0], [0, Math.PI / 6, 0], [1, 1, 1], { outline: 1.06, cast: true });
  add(tower, new THREE.CylinderGeometry(0.06, 0.08, 0.9, 6), palette.coral, [0, 5.55, 0], [0, 0, 0], [1, 1, 1], { outline: 1.12 });
  const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff5a4e });
  const beacon = add(tower, new THREE.SphereGeometry(0.075, 8, 6), beaconMat, [0, 6.02, 0], [0, 0, 0], [1, 1, 1]);

  // tiny legs / details
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
    cylinderBetween(
      tower,
      [Math.sin(a) * 0.7, 0.45, Math.cos(a) * 0.7],
      [Math.sin(a) * 0.33, 3.0, Math.cos(a) * 0.33],
      0.035,
      palette.coral,
      6,
      { outline: 1.14 }
    );
  }

  registerPick(tower, "tower");

  // ---------------- shrine + torii ----------------
  const shrine = new THREE.Group();
  shrine.position.set(3.55, 0.57, -1.1);
  shrine.rotation.y = -0.3;
  shrine.scale.setScalar(0.9);
  island.add(shrine);

  add(shrine, new THREE.BoxGeometry(1.0, 0.18, 0.8), palette.sand, [0, 0.12, 0], [0, 0, 0], [1, 1, 1], { outline: 1.06 });
  add(shrine, new THREE.BoxGeometry(0.72, 0.58, 0.55), palette.cream, [0, 0.48, 0], [0, 0, 0], [1, 1, 1], { outline: 1.05 });
  add(shrine, new THREE.BoxGeometry(0.55, 0.42, 0.06), palette.red, [0, 0.47, 0.29], [0, 0, 0], [1, 1, 1], { outline: 1.08 });
  addFace(shrine, 0, 0.47, 0.326, 0.42, "happy");
  add(shrine, new THREE.BoxGeometry(0.94, 0.09, 0.72), palette.roof, [0, 0.84, 0], [0, 0, 0], [1, 1, 1], { outline: 1.045, cast: true });
  add(shrine, new THREE.BoxGeometry(0.58, 0.08, 0.8), palette.roof, [0, 0.95, 0], [0, 0, 0], [1, 1, 1], { outline: 1.045 });
  add(shrine, new THREE.CylinderGeometry(0.045, 0.045, 0.9, 6), toon(0xffd166), [0, 0.99, 0], [0, 0, Math.PI / 2], [1, 1, 1]);
  add(shrine, new THREE.CylinderGeometry(0.06, 0.06, 0.05, 8), toon(0xffd166), [0, 1.03, 0], [0, 0, 0]);

  // torii
  const torii = new THREE.Group();
  torii.position.set(2.85, 0.57, -0.35);
  torii.rotation.y = -0.3;
  torii.scale.setScalar(0.85);
  island.add(torii);
  [-0.33, 0.33].forEach((x) => {
    add(torii, new THREE.CylinderGeometry(0.055, 0.07, 1.05, 7), palette.red, [x, 0.52, 0], [0, 0, x * 0.07], [1, 1, 1], { outline: 1.08, cast: true });
  });
  add(torii, new THREE.BoxGeometry(0.96, 0.1, 0.13), palette.red, [0, 1.06, 0], [0, 0, 0], [1, 1, 1], { outline: 1.05 });
  add(torii, new THREE.BoxGeometry(0.68, 0.08, 0.1), palette.red, [0, 0.84, 0], [0, 0, 0], [1, 1, 1], { outline: 1.06 });
  add(torii, new THREE.BoxGeometry(0.2, 0.06, 0.1), toon(0xffd166), [0, 0.96, 0], [0, 0, 0], [1, 1, 1]);

  // plum tree
  const plum = new THREE.Group();
  plum.position.set(4.25, 0.55, -2.05);
  shrine.add(plum);
  add(plum, new THREE.CylinderGeometry(0.06, 0.09, 0.9, 6), palette.woodDark, [0, 0.45, 0], [0, 0, 0.14], [1, 1, 1], { outline: 1.12 });
  [[-0.25, 0.9, 0.12], [0.15, 1.0, 0.0], [0.0, 1.16, 0.08], [0.3, 0.9, 0.1]].forEach(([x, y, z], i) => {
    add(plum, new THREE.SphereGeometry(0.22 - i * 0.02, 8, 6), i % 2 ? palette.plum : toon(0xffc8d6), [x, y, z], [0, 0, 0], [1, 0.9, 1], { outline: 1.06 });
  });

  // ---------------- ferris wheel ----------------
  const ferris = new THREE.Group();
  ferris.position.set(-3.6, 0.58, -2.55);
  ferris.rotation.y = 0.08;
  ferris.scale.setScalar(0.95);
  island.add(ferris);
  add(ferris, new THREE.CylinderGeometry(0.75, 0.9, 0.15, 16), palette.cream, [0, 0.08, 0], [0, 0, 0], [1, 1, 1], { outline: 1.04 });
  const wheel = new THREE.Group();
  wheel.position.set(0, 2.15, 0);
  ferris.add(wheel);
  add(wheel, new THREE.TorusGeometry(1.28, 0.055, 6, 40), palette.coral, [0, 0, 0], [0, 0, 0], [1, 1, 1], { outline: 1.04, cast: true });
  add(wheel, new THREE.TorusGeometry(1.05, 0.025, 5, 32), palette.cream, [0, 0, 0], [0, 0, 0]);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    cylinderBetween(wheel, [0, 0, 0], [Math.cos(a) * 1.24, Math.sin(a) * 1.24, 0], 0.018, palette.cream, 5);
  }
  const gondolaColors = [0xffd15c, 0x7ed9c7, 0xff9db5, 0xa8c7ff, 0xff8f6b];
  const gondolas = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const holder = new THREE.Group();
    holder.position.set(Math.cos(a) * 1.22, Math.sin(a) * 1.22, 0);
    wheel.add(holder);
    const col = gondolaColors[i % gondolaColors.length];
    const mat = new THREE.MeshToonMaterial({
      color: col,
      emissive: col,
      emissiveIntensity: 0.03,
      gradientMap,
    });
    add(holder, new THREE.BoxGeometry(0.2, 0.17, 0.2), mat, [0, -0.12, 0], [0, 0, 0], [1, 1, 1], { outline: 1.1 });
    add(holder, new THREE.BoxGeometry(0.23, 0.035, 0.23), palette.cream, [0, -0.02, 0], [0, 0, 0], [1, 1, 1]);
    gondolas.push(holder);
    nightMaterials.push({ mat, day: 0.03, night: 0.55 });
  }
  add(ferris, new THREE.CylinderGeometry(0.18, 0.18, 0.24, 10), palette.cream, [0, 2.15, 0], [Math.PI / 2, 0, 0], [1, 1, 1], { outline: 1.06 });
  addFace(ferris, 0, 2.15, 0.25, 0.62, "happy");
  cylinderBetween(ferris, [-0.65, 0.15, 0], [0, 2.05, 0], 0.035, palette.cream, 6, { outline: 1.12 });
  cylinderBetween(ferris, [0.65, 0.15, 0], [0, 2.05, 0], 0.035, palette.cream, 6, { outline: 1.12 });
  registerPick(ferris, "ferris");

  // ---------------- wisteria ----------------
  const wisteria = new THREE.Group();
  wisteria.position.set(-3.85, 0.55, 2.55);
  wisteria.rotation.y = 0.32;
  wisteria.scale.setScalar(1.0);
  island.add(wisteria);
  const archCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.05, 0.0, 0),
    new THREE.Vector3(-0.75, 1.25, 0.02),
    new THREE.Vector3(0, 1.72, 0.06),
    new THREE.Vector3(0.75, 1.25, 0.02),
    new THREE.Vector3(1.05, 0.0, 0),
  ]);
  add(wisteria, new THREE.TubeGeometry(archCurve, 24, 0.055, 6, false), palette.greenDark, [0, 0, 0], [0, 0, 0], [1, 1, 1], { outline: 1.09 });
  const clusterMat = toon(0xa88bea);
  const clusterMat2 = toon(0xc7afff);
  for (let i = 0; i < 13; i++) {
    const t = 0.1 + (i / 13) * 0.82;
    const p = archCurve.getPointAt(t);
    const cluster = new THREE.Group();
    cluster.position.set(p.x, p.y - 0.1, p.z + 0.02);
    wisteria.add(cluster);
    const len = 0.35 + (i % 4) * 0.12;
    add(cluster, new THREE.ConeGeometry(0.13, len, 5), i % 3 ? clusterMat : clusterMat2, [0, -len / 2, 0], [0, 0, 0], [1, 1, 1], { outline: 1.09 });
    add(cluster, new THREE.SphereGeometry(0.15, 7, 5), i % 3 ? clusterMat : clusterMat2, [0, 0, 0], [0, 0, 0], [1, 0.75, 1], { outline: 1.07 });
  }
  add(wisteria, new THREE.SphereGeometry(0.16, 8, 6), palette.green, [-0.9, 0.9, 0], [0, 0, 0], [1, 1, 1]);
  add(wisteria, new THREE.SphereGeometry(0.18, 8, 6), palette.green, [0.92, 0.95, 0], [0, 0, 0], [1, 1, 1]);

  // ---------------- sign ----------------
  const sign = new THREE.Group();
  sign.position.set(-2.55, 0.58, 3.72);
  sign.rotation.y = 0.24;
  island.add(sign);
  add(sign, new THREE.CylinderGeometry(0.045, 0.055, 1.02, 6), palette.woodDark, [-0.55, 0.48, 0], [0, 0, 0.06], [1, 1, 1], { outline: 1.12 });
  add(sign, new THREE.CylinderGeometry(0.045, 0.055, 1.02, 6), palette.woodDark, [0.55, 0.48, 0], [0, 0, -0.06], [1, 1, 1], { outline: 1.12 });
  add(sign, new THREE.BoxGeometry(1.42, 0.68, 0.08), palette.cream, [0, 0.98, 0], [0, 0, -0.03], [1, 1, 1], { outline: 1.035, cast: true });
  const signMat = new THREE.MeshBasicMaterial({ map: signTexture("FUKUOKA", "MAY 2027") });
  add(sign, new THREE.PlaneGeometry(1.24, 0.56), signMat, [0, 0.99, 0.05], [0, 0, -0.03]);
  registerPick(sign, "sign");

  // ---------------- train ----------------
  const trackCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-5.0, 1.12, -3.25),
    new THREE.Vector3(-2.5, 1.3, -3.95),
    new THREE.Vector3(0.2, 1.34, -4.1),
    new THREE.Vector3(2.7, 1.3, -3.9),
    new THREE.Vector3(5.0, 1.12, -3.2),
  ]);
  const railMat = toon(0x5e6d72);
  const rail1 = new THREE.CatmullRomCurve3(trackCurve.getPoints(40).map((p) => new THREE.Vector3(p.x, p.y, p.z - 0.1)));
  const rail2 = new THREE.CatmullRomCurve3(trackCurve.getPoints(40).map((p) => new THREE.Vector3(p.x, p.y, p.z + 0.1)));
  const railGeo = new THREE.TubeGeometry(rail1, 32, 0.025, 4, false);
  add(island, railGeo, railMat, [0, 0, 0], [0, 0, 0]);
  add(island, new THREE.TubeGeometry(rail2, 32, 0.025, 4, false), railMat, [0, 0, 0], [0, 0, 0]);
  for (let i = 0; i <= 18; i++) {
    const p = trackCurve.getPointAt(i / 18);
    add(island, new THREE.BoxGeometry(0.06, 0.035, 0.34), toon(0xb18d68), [p.x, p.y - 0.04, p.z], [0, 0, 0]);
  }

  const train = new THREE.Group();
  island.add(train);
  add(train, new THREE.CapsuleGeometry(0.2, 0.72, 4, 9), palette.cream, [0, 0.16, 0], [0, 0, Math.PI / 2], [1, 1, 1], { outline: 1.07, cast: true });
  add(train, new THREE.BoxGeometry(0.84, 0.08, 0.26), palette.blue, [0, 0.08, 0], [0, 0, 0], [1, 1, 1], { outline: 1.09 });
  add(train, new THREE.ConeGeometry(0.18, 0.3, 10), palette.coral, [0.62, 0.16, 0], [0, 0, -Math.PI / 2], [1, 1, 1], { outline: 1.08 });
  [-0.3, 0, 0.3].forEach((x) => {
    add(train, new THREE.BoxGeometry(0.15, 0.1, 0.03), toon(0xa9eeff), [x, 0.23, 0.195], [0, 0, 0], [1, 1, 1]);
  });
  addFace(train, 0.57, 0.2, 0.13, 0.38, "happy");
  const trainLight = new THREE.MeshBasicMaterial({ color: 0xfff2b0 });
  add(train, new THREE.SphereGeometry(0.035, 6, 5), trainLight, [0.74, 0.16, 0.1], [0, 0, 0], [1, 1, 1]);
  const trainPos = new THREE.Vector3();
  const trainTan = new THREE.Vector3();

  // ---------------- sun / moon / clouds ----------------
  const skyGroup = new THREE.Group();
  scene.add(skyGroup);
  const sun = new THREE.Group();
  sun.position.set(6.4, 7.2, -5.5);
  skyGroup.add(sun);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffdf70 });
  add(sun, new THREE.SphereGeometry(1.15, 18, 14), sunMat, [0, 0, 0], [0, 0, 0], [1, 1, 1]);
  const sunRays = new THREE.Group();
  sun.add(sunRays);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const ray = add(sunRays, new THREE.BoxGeometry(0.1, 0.28, 0.06), sunMat, [Math.cos(a) * 1.55, Math.sin(a) * 1.55, -0.2], [0, 0, a], [1, 1, 1]);
    ray.material = sunMat;
  }
  addFace(sun, 0, 0.02, 1.1, 1.2, "happy");

  const moon = new THREE.Group();
  moon.position.copy(sun.position);
  moon.visible = false;
  skyGroup.add(moon);
  const moonMat = new THREE.MeshBasicMaterial({ color: 0xfff3c9 });
  add(moon, new THREE.SphereGeometry(1.0, 18, 14), moonMat, [0, 0, 0], [0, 0, 0], [1, 1, 1]);
  addFace(moon, 0, 0.02, 1.02, 1.05, "wink");
  add(moon, new THREE.SphereGeometry(0.1, 8, 6), basic(0xf1e2b4), [-0.4, 0.35, 0.8], [0, 0, 0], [1, 1, 1]);
  add(moon, new THREE.SphereGeometry(0.07, 8, 6), basic(0xf1e2b4), [0.3, -0.3, 0.83], [0, 0, 0], [1, 1, 1]);

  const cloudGroups = [];
  function makeCloud(x, y, z, s, opacity = 1) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.scale.setScalar(s);
    g.userData = { baseX: x, speed: 0.08 + Math.random() * 0.08, phase: Math.random() * 6 };
    const m = new THREE.MeshToonMaterial({
      color: 0xfffcf0,
      gradientMap,
      transparent: opacity < 1,
      opacity,
    });
    add(g, new THREE.SphereGeometry(0.65, 10, 8), m, [0, 0, 0], [0, 0, 0], [1.3, 0.85, 0.9]);
    add(g, new THREE.SphereGeometry(0.48, 9, 7), m, [-0.55, 0.1, 0.03], [0, 0, 0], [1, 0.8, 0.9]);
    add(g, new THREE.SphereGeometry(0.52, 9, 7), m, [0.58, 0.04, 0.02], [0, 0, 0], [1, 0.95, 0.9]);
    add(g, new THREE.BoxGeometry(1.4, 0.35, 0.7), m, [0, -0.2, 0], [0, 0, 0]);
    cloudGroups.push(g);
    skyGroup.add(g);
    return g;
  }
  makeCloud(-6.5, 3.7, -4.5, 0.85, 0.95);
  makeCloud(6.9, 4.6, -6.0, 0.62, 0.9);
  makeCloud(-4.9, -2.5, 1.8, 0.65, 0.9);
  makeCloud(4.7, -2.9, 1.3, 0.55, 0.85);
  makeCloud(0.2, -4.1, -1.4, 0.72, 0.8);
  makeCloud(-7.4, 6.5, -8.0, 0.55, 0.75);

  // stars
  const starCount = 90;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 12 + Math.random() * 18;
    const a = Math.random() * Math.PI * 2;
    starPositions[i * 3] = Math.cos(a) * r;
    starPositions[i * 3 + 1] = 2 + Math.random() * 12;
    starPositions[i * 3 + 2] = -4 - Math.random() * 12;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      color: 0xfff2b5,
      size: 0.08,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      map: softCircleTexture(),
      alphaTest: 0.03,
    })
  );
  skyGroup.add(stars);

  // birds
  const birdGroup = new THREE.Group();
  skyGroup.add(birdGroup);
  const birdMat = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.55 });
  for (let i = 0; i < 4; i++) {
    const pts = [
      new THREE.Vector3(-0.12, 0, 0),
      new THREE.Vector3(0, 0.08, 0),
      new THREE.Vector3(0.12, 0, 0),
    ];
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), birdMat);
    line.position.set(-4 + i * 1.4, 5.5 + (i % 2) * 0.7, -3.5 - i * 0.4);
    line.userData.phase = i * 1.7;
    birdGroup.add(line);
  }

  // floating petals
  const petalCount = 110;
  const petalPositions = new Float32Array(petalCount * 3);
  const petalColors = new Float32Array(petalCount * 3);
  const petalSeeds = [];
  const c1 = new THREE.Color(0xffb3c7);
  const c2 = new THREE.Color(0xfff0c2);
  const c3 = new THREE.Color(0xcdb6ff);
  for (let i = 0; i < petalCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 1.2 + Math.random() * 4.4;
    petalPositions[i * 3] = Math.cos(a) * r;
    petalPositions[i * 3 + 1] = 1 + Math.random() * 5.5;
    petalPositions[i * 3 + 2] = Math.sin(a) * r * 0.75 + 0.4;
    const col = [c1, c2, c3][i % 3];
    petalColors[i * 3] = col.r;
    petalColors[i * 3 + 1] = col.g;
    petalColors[i * 3 + 2] = col.b;
    petalSeeds.push({ speed: 0.18 + Math.random() * 0.25, phase: Math.random() * 6.28, x: petalPositions[i * 3] });
  }
  const petalGeo = new THREE.BufferGeometry();
  petalGeo.setAttribute("position", new THREE.BufferAttribute(petalPositions, 3));
  petalGeo.setAttribute("color", new THREE.BufferAttribute(petalColors, 3));
  const petals = new THREE.Points(
    petalGeo,
    new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      map: softCircleTexture(),
      alphaTest: 0.05,
    })
  );
  world.add(petals);

  // fireflies
  const flyCount = 36;
  const flyPositions = new Float32Array(flyCount * 3);
  for (let i = 0; i < flyCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 1.5 + Math.random() * 4;
    flyPositions[i * 3] = Math.cos(a) * r;
    flyPositions[i * 3 + 1] = 1.3 + Math.random() * 2.4;
    flyPositions[i * 3 + 2] = Math.sin(a) * r;
  }
  const flyGeo = new THREE.BufferGeometry();
  flyGeo.setAttribute("position", new THREE.BufferAttribute(flyPositions, 3));
  const fireflies = new THREE.Points(
    flyGeo,
    new THREE.PointsMaterial({
      color: 0xffe480,
      size: 0.13,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      map: softCircleTexture(),
      alphaTest: 0.04,
      blending: THREE.AdditiveBlending,
    })
  );
  world.add(fireflies);

  // steam
  const steamTex = softCircleTexture();
  const steamParticles = [];
  function makeSteam(x, y, z, parent = world, n = 7, color = 0xffffff) {
    const positions = new Float32Array(n * 3);
    const seeds = [];
    for (let i = 0; i < n; i++) {
      positions[i * 3] = x + (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 1] = y + Math.random() * 0.3;
      positions[i * 3 + 2] = z + (Math.random() - 0.5) * 0.3;
      seeds.push({ y: positions[i * 3 + 1], speed: 0.18 + Math.random() * 0.2, phase: Math.random() * 6.28, x: positions[i * 3], z: positions[i * 3 + 2] });
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color,
      map: steamTex,
      size: 0.2,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      alphaTest: 0.03,
    });
    const pts = new THREE.Points(geo, mat);
    parent.add(pts);
    steamParticles.push({ pts, seeds, baseY: y });
    return pts;
  }
  makeSteam(-0.45, 1.55, 2.3, world, 8, 0xffffff);

  // ---------------- lights ----------------
  const hemi = new THREE.HemisphereLight(0xfff4d9, 0x5f8c7b, 1.45);
  scene.add(hemi);
  const dirLight = new THREE.DirectionalLight(0xfff2d1, 2.6);
  dirLight.position.set(8, 13, 9);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(1024, 1024);
  dirLight.shadow.camera.left = -10;
  dirLight.shadow.camera.right = 10;
  dirLight.shadow.camera.top = 11;
  dirLight.shadow.camera.bottom = -8;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 40;
  dirLight.shadow.bias = -0.0005;
  scene.add(dirLight);
  const fill = new THREE.DirectionalLight(0x9fe9ff, 0.65);
  fill.position.set(-8, 5, -7);
  scene.add(fill);

  // ---------------- anchors for labels ----------------
  const anchors = {};
  function anchor(name, parent, x, y, z) {
    const o = new THREE.Object3D();
    o.position.set(x, y, z);
    parent.add(o);
    anchors[name] = o;
  }
  anchor("tower", tower, 0, 6.15, 0.2);
  anchor("ramen", bowl, 0, 0.9, 0.2);
  anchor("yatai", yatai, 0, 2.15, 0.2);
  anchor("ferris", ferris, 0, 2.5, 0.2);

  // ---------------- state & animation ----------------
  let width = 1;
  let height = 1;
  let active = true;
  let night = false;
  let nightLerp = 0;
  let t = 0;
  let last = performance.now();
  let dragging = false;
  let moved = 0;
  let lastPointer = { x: 0, y: 0 };
  let startPointer = { x: 0, y: 0 };
  let downTime = 0;
  let vel = 0;
  let baseRot = 0.04;
  let currentRot = 0.04;
  let targetRot = 0.04;
  let pointerNDC = new THREE.Vector2();
  let parallax = { x: 0, y: 0 };

  const baseNight = {
    hemiSky: new THREE.Color(0xfff4d9),
    hemiGround: new THREE.Color(0x5f8c7b),
    dir: new THREE.Color(0xfff2d1),
    fill: new THREE.Color(0x9fe9ff),
    sea: new THREE.Color(0x69cfe2),
  };
  const darkNight = {
    hemiSky: new THREE.Color(0x8fa7d8),
    hemiGround: new THREE.Color(0x24323b),
    dir: new THREE.Color(0xffd6a0),
    fill: new THREE.Color(0x6d8cff),
    sea: new THREE.Color(0x315e88),
  };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, width < 760 ? 1.45 : 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const mobile = width < 760;
    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const targetWidth = mobile ? 11.5 : 12.3;
    const distance = Math.max(mobile ? 36 : 23.5, targetWidth / (2 * Math.tan(hFov / 2)));
    camera.position.set(0, mobile ? 10.6 : 9.4, distance);
    camera.lookAt(0, mobile ? 4.72 : 4.0, 0);
    world.position.x = mobile ? 0 : 3.0;
    world.position.y = mobile ? -0.1 : 0;
    camera.updateProjectionMatrix();
    sun.position.set(mobile ? 4.8 : 6.6, 7.6, -5);
    moon.position.copy(sun.position);
  }

  function setActive(v) {
    active = v;
  }

  function setNight(v) {
    night = v;
    sun.visible = !v;
    moon.visible = v;
    nightLerp = v ? nightLerp : nightLerp;
  }

  function pickAt(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointerNDC, camera);
    const hits = raycaster.intersectObjects(pickRoots, true);
    if (!hits.length) return null;
    let o = hits[0].object;
    while (o && !o.userData.pickId) o = o.parent;
    return o?.userData.pickId || null;
  }

  function triggerPick(id) {
    if (!id) return;
    if (onPick) onPick(id);
    const group = bounceTargets.get(id);
    if (group) {
      group.userData.bounceStart = performance.now();
      group.userData.baseScale = group.userData.baseScale || group.scale.clone();
    }
    if (navigator.vibrate) navigator.vibrate(8);
  }

  function onPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    dragging = true;
    moved = 0;
    lastPointer = { x: e.clientX, y: e.clientY };
    startPointer = { x: e.clientX, y: e.clientY };
    downTime = performance.now();
    vel = 0;
    canvas.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    parallax.x += (pointerNDC.x - parallax.x) * 0.08;
    parallax.y += (pointerNDC.y - parallax.y) * 0.08;
    if (!dragging) return;
    const dx = e.clientX - lastPointer.x;
    const dy = e.clientY - lastPointer.y;
    moved += Math.abs(dx) + Math.abs(dy);
    lastPointer = { x: e.clientX, y: e.clientY };
    if (moved > 5) {
      targetRot += dx * 0.006;
      targetRot = THREE.MathUtils.clamp(targetRot, -0.72, 0.72);
      vel = dx * 0.006;
      world.rotation.x = THREE.MathUtils.clamp(world.rotation.x + dy * 0.0005, -0.06, 0.08);
    }
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    const dt = performance.now() - downTime;
    if (moved < 7 && dt < 550) {
      const id = pickAt(e.clientX, e.clientY);
      triggerPick(id);
    }
    canvas.releasePointerCapture?.(e.pointerId);
  }

  function onPointerLeave() {
    dragging = false;
    parallax.x *= 0.3;
    parallax.y *= 0.3;
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("pointerleave", onPointerLeave);
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  function update(dt) {
    const now = performance.now();
    t += dt;

    // gentle default sway + drag inertia
    if (!dragging) {
      targetRot += vel;
      vel *= 0.94;
      targetRot += Math.sin(t * 0.22) * 0.00035;
      targetRot = THREE.MathUtils.clamp(targetRot, -0.72, 0.72);
    }
    currentRot += (targetRot - currentRot) * 0.08;
    world.rotation.y = currentRot;
    world.rotation.x += ((parallax.y * 0.025) - world.rotation.x) * 0.04;
    world.position.y = (width < 760 ? -0.1 : 0) + Math.sin(t * 0.5) * 0.035;

    // island float
    island.position.y = Math.sin(t * 0.75) * 0.045;

    // sea shimmer
    seaRing.material.opacity = 0.94 + Math.sin(t * 1.5) * 0.025;
    foam.rotation.z = t * 0.05;
    const foamScale = 1 + Math.sin(t * 1.8) * 0.006;
    foam.scale.set(foamScale, foamScale, 1);

    // pond ripples
    ripples.forEach((r, i) => {
      const s = 1 + ((t * 0.25 + i * 0.27) % 1) * 1.6;
      r.scale.set(s, s, 1);
      r.material.opacity = 0.65 * (1 - ((t * 0.25 + i * 0.27) % 1));
    });

    // swan bob
    swan.position.y = 0.12 + Math.sin(t * 1.1 + 1) * 0.025;
    swan.rotation.z = Math.sin(t * 0.9) * 0.03;

    // ferris wheel
    wheel.rotation.z = -t * 0.14;
    gondolas.forEach((g) => (g.rotation.z = t * 0.14));

    // train
    const trainT = ((t * 0.026) % 1 + 1) % 1;
    if (Number.isFinite(trainT)) {
      trackCurve.getPointAt(trainT, trainPos);
      trackCurve.getTangentAt(trainT, trainTan);
    }
    train.position.copy(trainPos);
    train.position.y += 0.08;
    train.rotation.y = Math.atan2(-trainTan.z, trainTan.x);
    train.rotation.z = Math.sin(t * 2) * 0.01;

    // lantern sway
    lanterns.forEach((l, i) => {
      l.rotation.z = Math.sin(t * 1.4 + i * 1.2) * 0.06;
      l.position.y = l.userData.baseY + Math.sin(t * 1.1 + i) * 0.012;
    });

    // steam
    steamParticles.forEach(({ pts, seeds, baseY }) => {
      if (!pts.parent) return;
      const arr = pts.geometry.attributes.position.array;
      seeds.forEach((s, i) => {
        const life = ((t * s.speed + s.phase) % 1);
        arr[i * 3] = s.x + Math.sin(t * 0.9 + i) * 0.09 * life;
        arr[i * 3 + 1] = baseY + life * 1.25;
        arr[i * 3 + 2] = s.z + Math.cos(t * 0.8 + i) * 0.07 * life;
      });
      pts.geometry.attributes.position.needsUpdate = true;
      pts.material.opacity = 0.42 + Math.sin(t * 2) * 0.08;
    });

    // clouds
    cloudGroups.forEach((c) => {
      c.position.x = c.userData.baseX + Math.sin(t * c.userData.speed * 0.35 + c.userData.phase) * 0.6;
      c.position.y += Math.sin(t * 0.5 + c.userData.phase) * 0.0007;
    });

    // birds
    birdGroup.children.forEach((b, i) => {
      b.position.x += Math.sin(t * 0.18 + i) * 0.0008;
      b.position.y += Math.cos(t * 0.7 + i * 1.7) * 0.0008;
      b.scale.y = 0.8 + Math.sin(t * 4 + i) * 0.25;
    });

    // sun rays
    sunRays.rotation.z = t * 0.045;
    sun.position.y = 7.6 + Math.sin(t * 0.45) * 0.08;

    // petals
    const pArr = petalGeo.attributes.position.array;
    for (let i = 0; i < petalCount; i++) {
      const seed = petalSeeds[i];
      pArr[i * 3 + 1] -= seed.speed * dt;
      pArr[i * 3] += Math.sin(t * 0.5 + seed.phase) * 0.0012;
      if (pArr[i * 3 + 1] < 0.8) {
        pArr[i * 3 + 1] = 6.4 + Math.random() * 0.8;
        pArr[i * 3] = (Math.random() - 0.5) * 7;
        pArr[i * 3 + 2] = (Math.random() - 0.5) * 5 + 0.4;
      }
    }
    petalGeo.attributes.position.needsUpdate = true;

    // fireflies
    const fArr = flyGeo.attributes.position.array;
    for (let i = 0; i < flyCount; i++) {
      fArr[i * 3 + 1] += Math.sin(t * 1.6 + i) * 0.0012;
    }
    flyGeo.attributes.position.needsUpdate = true;
    fireflies.material.opacity = nightLerp * (0.55 + Math.sin(t * 2.4) * 0.2);

    // day / night transition
    nightLerp += ((night ? 1 : 0) - nightLerp) * 0.035;
    hemi.color.copy(baseNight.hemiSky).lerp(darkNight.hemiSky, nightLerp);
    hemi.groundColor.copy(baseNight.hemiGround).lerp(darkNight.hemiGround, nightLerp);
    hemi.intensity = 1.45 - nightLerp * 0.7;
    dirLight.color.copy(baseNight.dir).lerp(darkNight.dir, nightLerp);
    dirLight.intensity = 2.6 - nightLerp * 1.2;
    fill.color.copy(baseNight.fill).lerp(darkNight.fill, nightLerp);
    fill.intensity = 0.65 + nightLerp * 0.15;
    seaRing.material.color.copy(baseNight.sea).lerp(darkNight.sea, nightLerp);
    stars.material.opacity = nightLerp * (0.6 + Math.sin(t * 1.2) * 0.1);
    nightMaterials.forEach(({ mat, day, night: nt }) => {
      mat.emissiveIntensity = day + (nt - day) * nightLerp;
    });
    beacon.material.color.setHex(Math.sin(t * 3.2) > 0 ? 0xff5a4e : 0xffc1a6);

    // bounce pick
    bounceTargets.forEach((group, id) => {
      if (!group.userData.bounceStart) return;
      const age = (now - group.userData.bounceStart) / 1000;
      if (age > 0.65) {
        group.userData.bounceStart = 0;
        if (group.userData.baseScale) group.scale.copy(group.userData.baseScale);
        return;
      }
      const s = 1 + Math.sin(age * 16) * 0.07 * Math.exp(-age * 4);
      if (group.userData.baseScale) {
        group.scale.set(
          group.userData.baseScale.x * (2 - s),
          group.userData.baseScale.y * s,
          group.userData.baseScale.z * (2 - s)
        );
      }
    });
  }

  let raf = 0;
  let paused = false;
  let lastRender = 0;
  let shadowFrozen = false;
  function loop(now) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    if (paused || document.hidden) return;
    update(dt);
    const minFrame = width < 760 ? 33 : 15;
    if (active && now - lastRender >= minFrame) {
      lastRender = now;
      if (!shadowFrozen) renderer.shadowMap.needsUpdate = true;
      renderer.render(scene, camera);
      if (!shadowFrozen) {
        shadowFrozen = true;
        renderer.shadowMap.autoUpdate = false;
      }
    }
  }
  raf = requestAnimationFrame(loop);

  document.addEventListener("visibilitychange", () => {
    paused = document.hidden;
    if (!paused) last = performance.now();
  });

  function projectAnchors() {
    const rect = canvas.getBoundingClientRect();
    const out = {};
    Object.entries(anchors).forEach(([key, obj]) => {
      obj.getWorldPosition(tmpV);
      tmpV.project(camera);
      out[key] = {
        x: (tmpV.x * 0.5 + 0.5) * rect.width,
        y: (-tmpV.y * 0.5 + 0.5) * rect.height,
        visible: tmpV.z < 1 && tmpV.z > -1 && Math.abs(tmpV.x) < 1.2 && Math.abs(tmpV.y) < 1.2,
      };
    });
    return out;
  }

  function dispose() {
    cancelAnimationFrame(raf);
    ro.disconnect();
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerUp);
    canvas.removeEventListener("pointerleave", onPointerLeave);
    renderer.dispose();
  }

  return {
    setActive,
    setNight,
    triggerPick,
    resize,
    projectAnchors,
    dispose,
    renderer,
    scene,
    camera,
    worldGroup: world,
    get night() {
      return night;
    },
  };
}
