(() => {
  'use strict';
  const host = document.querySelector('#scene');
  const canvas = document.querySelector('#yarn-canvas');
  if (!window.THREE) { host.dataset.state = 'fallback'; return; }
  const THREE = window.THREE;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch { host.dataset.state = 'fallback'; return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
  camera.position.set(0, 0, 17);
  scene.add(new THREE.HemisphereLight(0xfffdf7, 0x66745c, 2.4));
  const keyLight = new THREE.DirectionalLight(0xffedcd, 3.3);
  keyLight.position.set(-4, 6, 8);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0xd6e5d1, 2);
  rimLight.position.set(5, -1, 3);
  scene.add(rimLight);
  const world = new THREE.Group();
  scene.add(world);
  const crochetCanvas = document.createElement('canvas');
  crochetCanvas.width = 128;
  crochetCanvas.height = 128;
  const crochetContext = crochetCanvas.getContext('2d');
  crochetContext.fillStyle = '#777';
  crochetContext.fillRect(0, 0, 128, 128);
  crochetContext.lineWidth = 3;
  for (let row = -1; row < 9; row++) {
    for (let stitch = -1; stitch < 9; stitch++) {
      const x = stitch * 16 + (row % 2) * 8;
      const y = row * 16;
      crochetContext.strokeStyle = '#bdbdbd';
      crochetContext.beginPath();
      crochetContext.moveTo(x, y + 13);
      crochetContext.quadraticCurveTo(x + 4, y - 1, x + 8, y + 13);
      crochetContext.stroke();
      crochetContext.strokeStyle = '#595959';
      crochetContext.beginPath();
      crochetContext.moveTo(x + 8, y + 13);
      crochetContext.quadraticCurveTo(x + 12, y - 1, x + 16, y + 13);
      crochetContext.stroke();
    }
  }
  const crochetBump = new THREE.CanvasTexture(crochetCanvas);
  crochetBump.wrapS = crochetBump.wrapT = THREE.RepeatWrapping;
  crochetBump.repeat.set(3, 2);
  const yarnMaterial = new THREE.MeshStandardMaterial({ color: 0x77836a, roughness: 1, bumpMap: crochetBump, bumpScale: .055 });
  const yarnLight = new THREE.MeshStandardMaterial({ color: 0x8c987c, roughness: 1, bumpMap: crochetBump, bumpScale: .06 });
  const yarnDark = new THREE.MeshStandardMaterial({ color: 0x53624b, roughness: 1, bumpMap: crochetBump, bumpScale: .055 });
  const copper = new THREE.MeshStandardMaterial({ color: 0xc98d55, metalness: .76, roughness: .29 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x594638, roughness: .55 });
  const ball = new THREE.Group();
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.33, 40, 28), yarnDark);
  sphere.scale.set(1, .95, .9);
  ball.add(sphere);
  class WindingCurve extends THREE.Curve {
    constructor(layer, radius = 1.39) { super(); this.layer = layer; this.radius = radius; }
    getPoint(progress, target = new THREE.Vector3()) {
      const angle = progress * Math.PI * 2 * 29;
      const latitude = Math.sin(progress * Math.PI * 2 + this.layer * 1.1) * 1.18;
      const radius = this.radius + this.layer * .035;
      const point = target.set(radius * Math.cos(latitude) * Math.cos(angle), radius * Math.sin(latitude) * .95, radius * Math.cos(latitude) * Math.sin(angle) * .9);
      return point.applyAxisAngle(new THREE.Vector3(0, 0, 1), this.layer * .89);
    }
  }
  for (let layer = 0; layer < 5; layer++) {
    ball.add(new THREE.Mesh(new THREE.TubeGeometry(new WindingCurve(layer), 1600, .032, 5, false), layer % 2 ? yarnLight : yarnMaterial));
  }
  const ballRig = new THREE.Group();
  ballRig.add(ball);
  world.add(ballRig);
  const secondBall = new THREE.Group();
  const coralBallYarn = new THREE.MeshStandardMaterial({ color: 0xe18469, roughness: 1, bumpMap: crochetBump, bumpScale: .055 });
  const secondBallCore = new THREE.Mesh(new THREE.SphereGeometry(1.05, 36, 28), new THREE.MeshStandardMaterial({ color: 0xe18469, roughness: 1, bumpMap: crochetBump, bumpScale: .06 }));
  secondBallCore.scale.set(1, .95, .92);
  secondBall.add(secondBallCore);
  const peachYarn = new THREE.MeshStandardMaterial({ color: 0xf0ad83, roughness: 1, bumpMap: crochetBump, bumpScale: .055 });
  for (let layer = 0; layer < 5; layer++) {
    secondBall.add(new THREE.Mesh(new THREE.TubeGeometry(new WindingCurve(layer, 1.09), 1200, .03, 5, false), layer % 2 ? peachYarn : coralBallYarn));
  }
  const secondBallRig = new THREE.Group();
  secondBallRig.add(secondBall);
  world.add(secondBallRig);
  const hook = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(.065, .075, 2.4, 20), copper);
  hook.add(shaft);
  const handle = new THREE.Mesh(new THREE.CapsuleGeometry(.145, 1.12, 8, 20), wood);
  handle.position.y = -1.02;
  hook.add(handle);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(.15, .15, .065, 20), copper);
  collar.position.y = -.47;
  hook.add(collar);
  const hookCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 1.16, 0), new THREE.Vector3(.025, 1.33, 0), new THREE.Vector3(.15, 1.41, 0), new THREE.Vector3(.27, 1.32, 0), new THREE.Vector3(.22, 1.20, 0)]);
  hook.add(new THREE.Mesh(new THREE.TubeGeometry(hookCurve, 36, .067, 10, false), copper));
  world.add(hook);
  const secondHook = hook.clone(true);
  world.add(secondHook);
  const centerpiece = new THREE.Group();
  const texturedYarn = (color, bumpScale = .05) => new THREE.MeshStandardMaterial({ color, roughness: 1, bumpMap: crochetBump, bumpScale });
  const terracotta = texturedYarn(0xb96952, .065);
  const terracottaLight = texturedYarn(0xdd9471, .06);
  const butter = texturedYarn(0xe7bd69, .055);
  const teal = texturedYarn(0x347a78, .075);
  const tealLight = texturedYarn(0x6bb2a0, .065);
  const coral = texturedYarn(0xe18469, .075);
  const creamYarn = texturedYarn(0xf0dfbb, .06);
  const amberYarn = texturedYarn(0xc78549, .055);
  const stitchPoints = [new THREE.Vector3(-.09, .1, 0), new THREE.Vector3(-.045, -.07, .025), new THREE.Vector3(0, -.12, .04), new THREE.Vector3(.045, -.07, .025), new THREE.Vector3(.09, .1, 0), new THREE.Vector3(.04, .13, -.025), new THREE.Vector3(0, .045, .01), new THREE.Vector3(-.04, .13, -.025), new THREE.Vector3(-.09, .1, 0)];
  const stitchGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(stitchPoints), 24, .034, 5, false);
  const stitchTransform = new THREE.Object3D();
  const surfaceNormal = new THREE.Vector3();
  const potGeometry = new THREE.LatheGeometry([
    new THREE.Vector2(.62, -1.44), new THREE.Vector2(.69, -1.36), new THREE.Vector2(.78, -1.08),
    new THREE.Vector2(.92, -.48), new THREE.Vector2(1.02, -.13), new THREE.Vector2(.94, -.05)
  ], 72);
  const planterBody = new THREE.Mesh(potGeometry, terracotta);
  centerpiece.add(planterBody);
  const planterRim = new THREE.Mesh(new THREE.TorusGeometry(.98, .105, 10, 96), terracottaLight);
  planterRim.rotation.x = Math.PI / 2;
  planterRim.position.y = -.1;
  centerpiece.add(planterRim);
  const planterBase = new THREE.Mesh(new THREE.TorusGeometry(.64, .055, 8, 72), terracottaLight);
  planterBase.rotation.x = Math.PI / 2;
  planterBase.position.y = -1.4;
  centerpiece.add(planterBase);
  const planterRows = [];
  for (let row = 0; row < 9; row++) {
    const height = row / 8;
    const radius = .72 + height * .255;
    const sageLoops = new THREE.InstancedMesh(stitchGeometry, row % 2 ? yarnLight : yarnMaterial, 18);
    const coralLoops = new THREE.InstancedMesh(stitchGeometry, row % 3 ? coralBallYarn : terracottaLight, 18);
    for (let column = 0; column < 36; column++) {
      const direction = column / 36 * Math.PI * 2 + (row % 2) * Math.PI / 36;
      const angle = direction + Math.sin(column * 1.71 + row * .9) * .012;
      const irregularity = Math.sin(column * 2.1 + row * 1.3) * .012;
      stitchTransform.position.set(Math.sin(angle) * (radius + irregularity), -1.3 + height * 1.08 + irregularity, Math.cos(angle) * (radius + irregularity));
      surfaceNormal.set(Math.sin(angle), .12, Math.cos(angle)).normalize();
      stitchTransform.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), surfaceNormal);
      stitchTransform.scale.setScalar(.78);
      stitchTransform.updateMatrix();
      if (column % 2) coralLoops.setMatrixAt(Math.floor(column / 2), stitchTransform.matrix);
      else sageLoops.setMatrixAt(Math.floor(column / 2), stitchTransform.matrix);
    }
    sageLoops.count = 0;
    coralLoops.count = 0;
    centerpiece.add(sageLoops, coralLoops);
    planterRows.push({ sage: sageLoops, coral: coralLoops });
  }
  const treeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(.02, -.19, 0), new THREE.Vector3(-.08, .22, 0), new THREE.Vector3(.1, .65, -.02),
    new THREE.Vector3(-.02, 1.08, -.04), new THREE.Vector3(.08, 1.45, -.06), new THREE.Vector3(.02, 1.82, -.08)
  ]);
  treeCurve.arcLengthDivisions = 1400;
  const treeGeometry = new THREE.TubeGeometry(treeCurve, 700, .07, 10, false);
  const treeYarn = new THREE.Mesh(treeGeometry, yarnMaterial);
  centerpiece.add(treeYarn);
  const branches = [
    { points: [[0, .2, 0], [-.36, .44, .02], [-.66, .72, .03]], leaves: [[-.55, .7, .05, -.7], [-.64, .86, .02, -1.1]] },
    { points: [[0, .44, 0], [.35, .63, .04], [.72, .77, .05]], leaves: [[.62, .78, .08, .8], [.76, .93, .02, 1.1]] },
    { points: [[.02, .74, -.01], [-.32, .98, -.02], [-.53, 1.28, 0]], leaves: [[-.46, 1.2, .06, -.8], [-.58, 1.36, 0, -1.1]] },
    { points: [[0, 1.02, -.03], [.28, 1.28, -.02], [.48, 1.59, -.02]], leaves: [[.42, 1.52, .03, .7], [.53, 1.66, -.03, 1]] }
  ];
  const branchMeshes = [];
  branches.forEach((branch, branchIndex) => {
    const curve = new THREE.CatmullRomCurve3(branch.points.map(point => new THREE.Vector3(...point)));
    const geometry = new THREE.TubeGeometry(curve, 64, .043, 8, false);
    const mesh = new THREE.Mesh(geometry, branchIndex % 2 ? yarnLight : yarnMaterial);
    centerpiece.add(mesh);
    branchMeshes.push(mesh);
  });
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.bezierCurveTo(.12, .17, .24, .38, 0, .8);
  leafShape.bezierCurveTo(-.24, .38, -.12, .17, 0, 0);
  const botanicalLeafGeometry = new THREE.ExtrudeGeometry(leafShape, { depth: .075, bevelEnabled: true, bevelThickness: .035, bevelSize: .025, bevelSegments: 3, curveSegments: 18 });
  const veinCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, .06, .105), new THREE.Vector3(.012, .35, .12), new THREE.Vector3(0, .7, .105)]);
  const botanicalVeinGeometry = new THREE.TubeGeometry(veinCurve, 24, .012, 5, false);
  const flowerPetalGeometry = new THREE.SphereGeometry(1, 18, 12);
  const leafMaterials = [yarnLight, tealLight, yarnMaterial, butter];
  const leafMeshes = [];
  const veinMeshes = [];
  branches.forEach((branch, branchIndex) => branch.leaves.forEach(([x, y, z, angle], leafIndex) => {
    const leaf = new THREE.Mesh(botanicalLeafGeometry, leafMaterials[(branchIndex + leafIndex) % leafMaterials.length]);
    leaf.position.set(x, y, z);
    leaf.rotation.z = angle + Math.PI / 2;
    leaf.rotation.x = -.25 + leafIndex * .32;
    leaf.scale.setScalar(.72);
    centerpiece.add(leaf);
    leafMeshes.push(leaf);
    const vein = new THREE.Mesh(botanicalVeinGeometry, yarnDark);
    vein.position.copy(leaf.position);
    vein.rotation.copy(leaf.rotation);
    vein.scale.copy(leaf.scale);
    centerpiece.add(vein);
    veinMeshes.push(vein);
  }));
  const flowerMeshes = [];
  for (let flowerIndex = 0; flowerIndex < 3; flowerIndex++) {
    const flower = new THREE.Group();
    const petalMaterial = flowerIndex === 1 ? butter : flowerIndex === 2 ? coral : creamYarn;
    for (let petalIndex = 0; petalIndex < 5; petalIndex++) {
      const petal = new THREE.Mesh(flowerPetalGeometry, petalMaterial);
      const angle = petalIndex / 5 * Math.PI * 2;
      petal.position.set(Math.cos(angle) * .1, Math.sin(angle) * .1, .02);
      petal.rotation.z = angle;
      petal.scale.set(.085, .15, .06);
      flower.add(petal);
    }
    const center = new THREE.Mesh(new THREE.SphereGeometry(.09, 16, 12), amberYarn);
    center.position.z = .1;
    flower.add(center);
    flower.position.set([-0.65, .71, -.52][flowerIndex], [.76, .8, 1.32][flowerIndex], .08);
    centerpiece.add(flower);
    flowerMeshes.push(flower);
  }
  centerpiece.rotation.set(.03, -.2, -.025);
  world.add(centerpiece);
  const perches = [new THREE.Vector3(.72, .88, .2), new THREE.Vector3(-.58, 2.05, .2)];
  const chain = new THREE.InstancedMesh(stitchGeometry, yarnLight, 80);
  chain.count = 0;
  world.add(chain);
  const birds = [];
  const birdBodyGeometry = new THREE.SphereGeometry(1, 32, 24);
  const birdHeadGeometry = new THREE.SphereGeometry(1, 28, 20);
  const birdMaterials = [teal, coral];
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x292b24, roughness: .8 });
  const beakMaterial = texturedYarn(0xe8a341, .06);
  const footMaterial = texturedYarn(0xb96952, .06);
  const birdDetailSphere = new THREE.SphereGeometry(1, 18, 12);
  const birdUnitZ = new THREE.Vector3(0, 0, 1);
  function addFeather(parent, position, scale, material, rotation = 0) {
    const feather = new THREE.Mesh(birdDetailSphere, material);
    feather.position.set(...position);
    feather.scale.set(...scale);
    feather.rotation.z = rotation;
    parent.add(feather);
    return feather;
  }
  function addFoot(bird, side) {
    const x = -.08 + side * .17;
    const z = .08;
    const points = [
      [[x, -.26, z], [x, -.38, z + .01], [x + .1, -.4, z + .02]],
      [[x, -.38, z + .01], [x, -.43, z + .02], [x - .08, -.44, z + .02]],
      [[x, -.36, z + .01], [x + .02, -.44, z + .02], [x + .07, -.46, z + .02]]
    ];
    points.forEach(line => bird.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(line.map(point => new THREE.Vector3(...point))), 14, .025, 6, false), footMaterial)));
  }
  function addEllipsoidStitches(parent, center, radii, rows, columns, axis, material, stitchScale = .58) {
    const embroidery = new THREE.InstancedMesh(stitchGeometry, material, rows * columns);
    let stitch = 0;
    for (let row = 0; row < rows; row++) {
      const along = -.78 + row * 1.56 / (rows - 1);
      const ring = Math.sqrt(1 - along * along);
      for (let column = 0; column < columns; column++) {
        const angle = column / columns * Math.PI * 2;
        if (axis === 'x') {
          stitchTransform.position.set(center.x + along * radii.x, center.y + Math.cos(angle) * radii.y * ring, center.z + Math.sin(angle) * radii.z * ring);
          surfaceNormal.set(along / radii.x, Math.cos(angle) * ring / radii.y, Math.sin(angle) * ring / radii.z).normalize();
        } else {
          stitchTransform.position.set(center.x + Math.cos(angle) * radii.x * ring, center.y + along * radii.y, center.z + Math.sin(angle) * radii.z * ring);
          surfaceNormal.set(Math.cos(angle) * ring / radii.x, along / radii.y, Math.sin(angle) * ring / radii.z).normalize();
        }
        stitchTransform.quaternion.setFromUnitVectors(birdUnitZ, surfaceNormal);
        stitchTransform.scale.setScalar(stitchScale);
        stitchTransform.updateMatrix();
        embroidery.setMatrixAt(stitch++, stitchTransform.matrix);
      }
    }
    parent.add(embroidery);
  }
  for (let index = 0; index < 2; index++) {
    const bird = new THREE.Group();
    const plumage = birdMaterials[index];
    const breast = new THREE.Mesh(birdBodyGeometry, creamYarn);
    breast.position.set(-.015, -.1, .225);
    breast.scale.set(.34, .235, .085);
    bird.add(breast);
    const body = new THREE.Mesh(birdBodyGeometry, plumage);
    body.scale.set(.49, .335, .315);
    bird.add(body);
    addEllipsoidStitches(bird, new THREE.Vector3(0, 0, 0), new THREE.Vector3(.49, .335, .315), 12, 24, 'x', index === 0 ? tealLight : terracottaLight);
    const head = new THREE.Mesh(birdHeadGeometry, plumage);
    head.position.set(.265, .235, .025);
    head.scale.set(.275, .27, .27);
    bird.add(head);
    addEllipsoidStitches(bird, new THREE.Vector3(.265, .235, .025), new THREE.Vector3(.275, .27, .27), 10, 20, 'y', index === 0 ? tealLight : terracottaLight, .46);
    addEllipsoidStitches(bird, new THREE.Vector3(-.015, -.1, .225), new THREE.Vector3(.34, .235, .085), 7, 18, 'x', index === 0 ? creamYarn : butter, .42);
    addFeather(bird, [.32, .49, .015], [.075, .19, .055], index === 0 ? butter : tealLight, .45);
    const tail = new THREE.Group();
    tail.position.set(-.38, .08, -.025);
    for (let feather = 0; feather < 3; feather++) {
      addFeather(tail, [-.16 - feather * .035, (feather - 1) * .105, 0], [.25, .075, .055], plumage, -.18 + feather * .16);
    }
    bird.add(tail);
    const farWing = new THREE.Group();
    farWing.position.set(-.1, .06, -.17);
    addFeather(farWing, [-.12, .16, 0], [.3, .23, .11], plumage, -.3);
    addEllipsoidStitches(farWing, new THREE.Vector3(-.12, .16, 0), new THREE.Vector3(.3, .23, .11), 6, 14, 'x', index === 0 ? tealLight : terracottaLight, .42);
    for (let feather = 0; feather < 4; feather++) {
      addFeather(farWing, [-.24 - feather * .075, .24 + feather * .035, .005], [.17, .075, .055], plumage, .38 + feather * .12);
    }
    const nearWing = new THREE.Group();
    nearWing.position.set(-.1, .08, .23);
    addFeather(nearWing, [-.12, .16, 0], [.32, .235, .11], plumage, -.3);
    addEllipsoidStitches(nearWing, new THREE.Vector3(-.12, .16, 0), new THREE.Vector3(.32, .235, .11), 6, 14, 'x', index === 0 ? tealLight : terracottaLight, .42);
    for (let feather = 0; feather < 4; feather++) {
      addFeather(nearWing, [-.24 - feather * .075, .245 + feather * .035, .025], [.17, .075, .06], index === 0 ? tealLight : terracottaLight, .38 + feather * .12);
    }
    bird.add(farWing, nearWing);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(.058, 20, 16), eyeMaterial);
    eye.position.set(.39, .275, .272);
    bird.add(eye);
    const beak = new THREE.Mesh(new THREE.ConeGeometry(.115, .23, 7), beakMaterial);
    beak.rotation.z = -Math.PI / 2;
    beak.position.set(.53, .18, .04);
    bird.add(beak);
    addFoot(bird, -1);
    addFoot(bird, 1);
    const traceCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-.46, -.02, .04), new THREE.Vector3(-.4, .25, .08), new THREE.Vector3(-.12, .43, .14),
      new THREE.Vector3(.2, .5, .15), new THREE.Vector3(.42, .34, .17), new THREE.Vector3(.62, .2, .12),
      new THREE.Vector3(.42, -.04, .15), new THREE.Vector3(.05, -.27, .16), new THREE.Vector3(-.38, -.2, .08),
      new THREE.Vector3(-.46, -.02, .04)
    ]);
    const traceGeometry = new THREE.TubeGeometry(traceCurve, 260, .026, 6, false);
    const trace = new THREE.Mesh(traceGeometry, index === 0 ? butter : terracottaLight);
    bird.add(trace);
    bird.scale.setScalar(.01);
    scene.add(bird);
    birds.push({ group: bird, nearWing, farWing, tail, trace, traceGeometry, traceCurve, state: {} });
  }
  const threadCount = 100;
  const threadSides = 6;
  const threadPositions = new Float32Array((threadCount + 1) * threadSides * 3);
  const threadIndices = [];
  for (let segment = 0; segment < threadCount; segment++) {
    for (let side = 0; side < threadSides; side++) {
      const current = segment * threadSides + side;
      const next = segment * threadSides + (side + 1) % threadSides;
      threadIndices.push(current, current + threadSides, next, next, current + threadSides, next + threadSides);
    }
  }
  const threadGeometry = new THREE.BufferGeometry();
  threadGeometry.setAttribute('position', new THREE.BufferAttribute(threadPositions, 3).setUsage(THREE.DynamicDrawUsage));
  threadGeometry.setIndex(threadIndices);
  const thread = new THREE.Mesh(threadGeometry, yarnLight);
  thread.frustumCulled = false;
  world.add(thread);
  const secondThreadPositions = new Float32Array(threadPositions.length);
  const secondThreadGeometry = threadGeometry.clone();
  secondThreadGeometry.setAttribute('position', new THREE.BufferAttribute(secondThreadPositions, 3).setUsage(THREE.DynamicDrawUsage));
  const secondThread = new THREE.Mesh(secondThreadGeometry, peachYarn);
  secondThread.frustumCulled = false;
  world.add(secondThread);
  const dustPositions = new Float32Array(65 * 3);
  for (let point = 0; point < 65; point++) {
    dustPositions[point * 3] = Math.sin(point * 127.1) * 9;
    dustPositions[point * 3 + 1] = Math.cos(point * 311.7) * 6;
    dustPositions[point * 3 + 2] = -3 + Math.sin(point * 71.9);
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0x66745c, size: .025, transparent: true, opacity: .35 }));
  scene.add(dust);
  const pointer = new THREE.Vector2();
  let scrollProgress = 0;
  let renderedProgress = 0;
  let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hidden = false;
  let expanded = false;
  let mobile = false;
  let frame = 0;
  let previousTime = 0;
  let elapsed = 0;
  let frameCount = 0;
  let pageMetrics;
  let drawnTreeSegments = 0;
  let contextLost = false;
  const screenState = {};
  const start = new THREE.Vector3();
  const end = new THREE.Vector3();
  const bendA = new THREE.Vector3();
  const bendB = new THREE.Vector3();
  const secondStart = new THREE.Vector3();
  const secondEnd = new THREE.Vector3();
  const secondBendA = new THREE.Vector3();
  const secondBendB = new THREE.Vector3();
  const center = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const binormal = new THREE.Vector3();
  const up = new THREE.Vector3(0, 0, 1);
  const workingTip = new THREE.Vector3();
  const secondWorkingTip = new THREE.Vector3();
  const hookTip = hookCurve.getPoint(1);
  const ballAnchor = new WindingCurve(4).getPoint(.25);
  const secondBallAnchor = new WindingCurve(4, 1.09).getPoint(.25);
  const tipOffset = new THREE.Vector3();
  const planterTip = new THREE.Vector3();
  const nextPlanterTip = new THREE.Vector3();
  const planterStitchMatrix = new THREE.Matrix4();
  const threadCurve = new THREE.CubicBezierCurve3(start, bendA, bendB, end);
  const secondThreadCurve = new THREE.CubicBezierCurve3(secondStart, secondBendA, secondBendB, secondEnd);
  function getPlanterTip(stitches, color, target) {
    const stitchProgress = THREE.MathUtils.clamp(stitches - 1, 0, planterRows.length * 18 - 1);
    const stitchIndex = Math.floor(stitchProgress);
    const nextIndex = Math.min(stitchIndex + 1, planterRows.length * 18 - 1);
    planterRows[Math.floor(stitchIndex / 18)][color].getMatrixAt(stitchIndex % 18, planterStitchMatrix);
    target.setFromMatrixPosition(planterStitchMatrix);
    planterRows[Math.floor(nextIndex / 18)][color].getMatrixAt(nextIndex % 18, planterStitchMatrix);
    nextPlanterTip.setFromMatrixPosition(planterStitchMatrix);
    target.lerp(nextPlanterTip, stitchProgress - stitchIndex).applyEuler(centerpiece.rotation).add(centerpiece.position);
    return target;
  }
  function resize() {
    mobile = innerWidth <= 700;
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.position.z = mobile ? 20 : 17;
    camera.updateProjectionMatrix();
    requestDraw();
  }
  function updateThread(time) {
    start.copy(ballAnchor).applyMatrix4(ball.matrix).applyMatrix4(ballRig.matrix);
    hook.updateMatrix();
    end.copy(hookTip).applyMatrix4(hook.matrix);
    const crossing = THREE.MathUtils.clamp(renderedProgress / .3, 0, 1);
    bendA.copy(start).add(new THREE.Vector3(-2.2 * crossing + .7, -1.5 + Math.sin(time * .65) * .1, .2));
    bendB.copy(end).add(new THREE.Vector3(1.6 * crossing - .3, -1.1, -.2));
    for (let segment = 0; segment <= threadCount; segment++) {
      const progress = segment / threadCount;
      threadCurve.getPoint(progress, center);
      threadCurve.getTangent(progress, tangent).normalize();
      normal.crossVectors(tangent, up).normalize();
      binormal.crossVectors(tangent, normal).normalize();
      for (let side = 0; side < threadSides; side++) {
        const angle = side / threadSides * Math.PI * 2 + progress * 35;
        const offset = (segment * threadSides + side) * 3;
        threadPositions[offset] = center.x + .042 * (normal.x * Math.cos(angle) + binormal.x * Math.sin(angle));
        threadPositions[offset + 1] = center.y + .042 * (normal.y * Math.cos(angle) + binormal.y * Math.sin(angle));
        threadPositions[offset + 2] = center.z + .042 * (normal.z * Math.cos(angle) + binormal.z * Math.sin(angle));
      }
    }
    threadGeometry.attributes.position.needsUpdate = true;
    threadGeometry.computeVertexNormals();
    secondStart.copy(secondBallAnchor).applyMatrix4(secondBall.matrix).applyMatrix4(secondBallRig.matrix);
    secondHook.updateMatrix();
    secondEnd.copy(hookTip).applyMatrix4(secondHook.matrix);
    secondBendA.copy(secondStart).lerp(secondEnd, .35).add(new THREE.Vector3(-.1, -.45, .2));
    secondBendB.copy(secondStart).lerp(secondEnd, .72).add(new THREE.Vector3(.05, .2, .15));
    for (let segment = 0; segment <= threadCount; segment++) {
      const progress = segment / threadCount;
      secondThreadCurve.getPoint(progress, center);
      secondThreadCurve.getTangent(progress, tangent).normalize();
      normal.crossVectors(tangent, up).normalize();
      binormal.crossVectors(tangent, normal).normalize();
      for (let side = 0; side < threadSides; side++) {
        const angle = side / threadSides * Math.PI * 2 + progress * 35;
        const offset = (segment * threadSides + side) * 3;
        secondThreadPositions[offset] = center.x + .038 * (normal.x * Math.cos(angle) + binormal.x * Math.sin(angle));
        secondThreadPositions[offset + 1] = center.y + .038 * (normal.y * Math.cos(angle) + binormal.y * Math.sin(angle));
        secondThreadPositions[offset + 2] = center.z + .038 * (normal.z * Math.cos(angle) + binormal.z * Math.sin(angle));
      }
    }
    secondThreadGeometry.attributes.position.needsUpdate = true;
    secondThreadGeometry.computeVertexNormals();
  }
  function draw(timestamp) {
    frame = 0;
    if (document.hidden || contextLost) return;
    const delta = Math.min((timestamp - (previousTime || timestamp)) / 1000, .05);
    previousTime = timestamp;
    if (!paused) elapsed += delta;
    const target = expanded ? 0 : scrollProgress;
    renderedProgress += (target - renderedProgress) * (paused ? 1 : Math.min(1, delta * 7));
    const outbound = THREE.MathUtils.clamp(renderedProgress / .3, 0, 1);
    const returning = THREE.MathUtils.smoothstep(renderedProgress, .43, .64);
    const forming = THREE.MathUtils.clamp((renderedProgress - .52) / .22, 0, 1);
    const potStitches = THREE.MathUtils.clamp(forming / .72, 0, 1) * planterRows.length * 18;
    const potEngagement = THREE.MathUtils.smoothstep(renderedProgress, .48, .52);
    const plantEngagement = THREE.MathUtils.smoothstep(forming, .72, .96);
    const viewHeight = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const viewWidth = viewHeight * camera.aspect;
    const compact = innerHeight < 600 && !expanded;
    const sizing = (mobile ? Math.min(viewWidth / 7.5, 1.05) : Math.min(1.65, viewWidth / 11.5)) * (compact ? .68 : 1);
    world.scale.setScalar(sizing);
    world.position.y = expanded ? 0 : Math.max(0, (pageMetrics?.scrollY || 0) - (pageMetrics?.journeyEnd || 0)) / innerHeight * viewHeight;
    world.visible = expanded || world.position.y < viewHeight * 1.4;
    const rightX = (expanded ? 0 : mobile ? viewWidth * (compact ? .3 : .14) : viewWidth * .235) / sizing;
    const leftX = (mobile ? -viewWidth * .26 : -viewWidth * .28) / sizing;
    const localY = (expanded ? 0 : compact ? -viewHeight * .26 : mobile ? -viewHeight * .23 : THREE.MathUtils.lerp(-.6, -viewHeight * .22, outbound * (1 - returning))) / sizing;
    const travelX = THREE.MathUtils.lerp(THREE.MathUtils.lerp(rightX + 2.2, leftX, outbound), rightX, returning);
    const sourceSpread = THREE.MathUtils.smoothstep(renderedProgress, .2, .66);
    const firstBallX = mobile ? THREE.MathUtils.lerp(.77, .8, sourceSpread) : THREE.MathUtils.lerp(.63, .54, sourceSpread);
    const secondBallX = mobile ? THREE.MathUtils.lerp(.77, .94, sourceSpread) : THREE.MathUtils.lerp(.85, .95, sourceSpread);
    const firstBallY = mobile ? THREE.MathUtils.lerp(.59, .3, sourceSpread) : .3;
    const secondBallY = mobile ? THREE.MathUtils.lerp(.79, .3, sourceSpread) : .3;
    ballRig.position.set((firstBallX - .5) * viewWidth / sizing, (.5 - firstBallY) * viewHeight / sizing, .4);
    ballRig.scale.setScalar((mobile ? .44 : .5) * (1 - renderedProgress * .68));
    ballRig.visible = ballRig.scale.x > .02;
    secondBallRig.position.set((secondBallX - .5) * viewWidth / sizing, (.5 - secondBallY) * viewHeight / sizing, .25);
    secondBallRig.scale.setScalar((mobile ? .49 : .55) * (1 - renderedProgress * .68));
    secondBallRig.visible = secondBallRig.scale.x > .02;
    thread.visible = true;
    secondThread.visible = true;
    ball.rotation.set(.16, elapsed * .075 - renderedProgress * 5, -.35);
    secondBall.rotation.set(-.12, -elapsed * .06 + renderedProgress * 3, .24);
    secondWorkingTip.set(
      THREE.MathUtils.lerp((.9 - .5) * viewWidth / sizing, travelX + .65, outbound),
      localY + .75 + Math.sin(renderedProgress * Math.PI * 7) * .55,
      .35
    );
    secondHook.scale.setScalar((mobile ? .34 : .38) * (1 - renderedProgress * .35));
    secondHook.rotation.set(0, .08, .5 - outbound * 1.6 + Math.sin(renderedProgress * 24) * .25);
    secondHook.visible = true;
    centerpiece.position.set(rightX, localY - .15, 0);
    centerpiece.rotation.y = -.2 + Math.sin(elapsed * .25) * .04;
    centerpiece.visible = forming > 0;
    planterBody.visible = forming > .015;
    planterRim.visible = forming > .08;
    planterBase.visible = forming > .03;
    for (let row = 0; row < planterRows.length; row++) {
      const courseProgress = THREE.MathUtils.clamp(potStitches - row * 18, 0, 18);
      planterRows[row].sage.count = Math.floor(courseProgress);
      planterRows[row].coral.count = Math.floor(courseProgress);
    }
    drawnTreeSegments = Math.floor(forming * treeGeometry.index.count / 3);
    treeGeometry.setDrawRange(0, drawnTreeSegments * 3);
    branchMeshes.forEach((branch, index) => {
      const branchProgress = THREE.MathUtils.clamp((forming - .12 - index * .1) / .48, 0, 1);
      branch.visible = branchProgress > 0;
      branch.geometry.setDrawRange(0, Math.floor(branchProgress * branch.geometry.index.count / 3) * 3);
    });
    leafMeshes.forEach((leaf, index) => {
      const growth = THREE.MathUtils.clamp((forming - .28 - index * .035) / .26, 0, 1);
      leaf.visible = growth > 0;
      leaf.scale.setScalar(.72 * growth);
      veinMeshes[index].visible = growth > .8;
      flowerMeshes[index] && (flowerMeshes[index].visible = forming > .82 + index * .035);
    });
    chain.count = Math.floor(THREE.MathUtils.smoothstep(renderedProgress, .08, .35) * (1 - returning) * 48);
    for (let link = 0; link < chain.count; link++) {
      const fraction = link / 48;
      stitchTransform.position.set(THREE.MathUtils.lerp(rightX, leftX, fraction), localY - .55 - Math.sin(fraction * Math.PI) * .45, .05);
      stitchTransform.rotation.set(0, 0, Math.PI / 2 + Math.cos(fraction * Math.PI) * .2);
      stitchTransform.updateMatrix();
      chain.setMatrixAt(link, stitchTransform.matrix);
    }
    chain.instanceMatrix.needsUpdate = true;
    workingTip.set(travelX, localY + 1.8 - outbound * 1.45, .5);
    getPlanterTip(potStitches, 'sage', planterTip);
    workingTip.lerp(planterTip, potEngagement);
    treeCurve.getPointAt(forming, planterTip).applyEuler(centerpiece.rotation).add(centerpiece.position);
    workingTip.lerp(planterTip, plantEngagement);
    getPlanterTip(potStitches, 'coral', planterTip);
    secondWorkingTip.lerp(planterTip, potEngagement);
    planterTip.set(1.15, -.15, .3).applyEuler(centerpiece.rotation).add(centerpiece.position);
    secondWorkingTip.lerp(planterTip, plantEngagement);
    hook.rotation.set(.05, -.15, THREE.MathUtils.lerp(-.5, 2.8, outbound) + Math.sin(elapsed * 1.6) * .035);
    hook.rotation.z = THREE.MathUtils.lerp(hook.rotation.z, .85 + Math.sin(potStitches * Math.PI * 2) * .12, potEngagement * (1 - plantEngagement));
    secondHook.rotation.z = THREE.MathUtils.lerp(secondHook.rotation.z, -.85 - Math.sin(potStitches * Math.PI * 2) * .12, potEngagement);
    hook.scale.setScalar(THREE.MathUtils.lerp(.46, .3, outbound));
    tipOffset.copy(hookTip).multiplyScalar(hook.scale.x).applyEuler(hook.rotation);
    hook.position.copy(workingTip).sub(tipOffset);
    tipOffset.copy(hookTip).multiplyScalar(secondHook.scale.x).applyEuler(secondHook.rotation);
    secondHook.position.copy(secondWorkingTip).sub(tipOffset);
    world.rotation.y += ((paused ? 0 : pointer.x * .025) - world.rotation.y) * .04;
    world.rotation.x = 0;
    world.updateMatrixWorld(true);
    centerpiece.updateMatrixWorld(true);
    dust.rotation.z = elapsed * .009;
    const flightProgress = renderedProgress + Math.max(0, (pageMetrics?.scrollY || 0) - (pageMetrics?.journeyEnd || 0)) / innerHeight * .28;
    birds.forEach((bird, index) => {
      const formation = THREE.MathUtils.smoothstep(renderedProgress, .73 + index * .08, .81 + index * .08);
      const flight = THREE.MathUtils.clamp((flightProgress - (.81 + index * .13)) / .26, 0, 1);
      const phase = elapsed * 4.2 + index * 1.7;
      const perch = centerpiece.localToWorld(perches[index].clone()).project(camera);
      const perchX = index === 1 ? compact ? .82 : mobile ? .9 : .65 : (perch.x + 1) / 2;
      const perchY = index === 1 ? compact ? .45 : mobile ? .48 : .32 : (1 - perch.y) / 2;
      const birdX = THREE.MathUtils.lerp(perchX, -.15, THREE.MathUtils.smoothstep(flight, 0, 1));
      const corridor = compact ? .78 : mobile ? .6 + index * .2 : .62 + index * .2;
      const birdY = THREE.MathUtils.lerp(perchY, corridor, THREE.MathUtils.smoothstep(flight, 0, .2)) + Math.sin(elapsed * .65 + index) * .004 * flight;
      const width = (mobile ? Math.min(70, innerWidth * .18) : 138) * (1 - index * .1) * (compact ? .58 : 1);
      const scale = width * viewHeight / innerHeight / 1.44;
      bird.group.visible = !expanded && formation > 0 && flight < 1;
      bird.group.position.set((birdX - .5) * viewWidth, (.5 - birdY) * viewHeight, 0);
      bird.group.position.z = 1.25 + index * .12;
      const birdGrowth = THREE.MathUtils.smoothstep(formation, .05, .6);
      bird.group.scale.set(-scale * birdGrowth, scale * birdGrowth, scale * birdGrowth);
      bird.group.rotation.set(.05, .12 * Math.sin(elapsed * .5 + index), .08 + Math.sin(flight * Math.PI) * .16);
      const flutter = THREE.MathUtils.smoothstep(formation, .55, .8);
      bird.nearWing.rotation.z = .08 + Math.sin(phase) * .8 * flutter;
      bird.farWing.rotation.z = -.08 - Math.sin(phase + .3) * .72 * flutter;
      bird.traceGeometry.setDrawRange(0, Math.floor(formation * bird.traceGeometry.index.count / 3) * 3);
      if (formation > 0 && formation < 1 && !expanded) {
        bird.group.updateWorldMatrix(true, true);
        bird.traceCurve.getPointAt(formation, workingTip).applyMatrix4(bird.trace.matrixWorld);
        world.worldToLocal(workingTip);
        const activeHook = index === 0 ? hook : secondHook;
        tipOffset.copy(hookTip).multiplyScalar(activeHook.scale.x).applyEuler(activeHook.rotation);
        activeHook.position.copy(workingTip).sub(tipOffset);
      }
      bird.state = { visible: bird.group.visible, formation, flight, x: birdX, y: birdY, width, wingAngle: bird.nearWing.rotation.z };
    });
    world.updateMatrixWorld(true);
    updateThread(elapsed);
    const hookScreen = end.clone().applyMatrix4(world.matrixWorld).project(camera);
    const ballScreen = ballRig.getWorldPosition(new THREE.Vector3()).project(camera);
    screenState.hookX = (hookScreen.x + 1) / 2;
    screenState.hookY = (1 - hookScreen.y) / 2;
    screenState.ballX = (ballScreen.x + 1) / 2;
    screenState.ballScale = ballRig.scale.x;
    screenState.yarnBalls = [
      { visible: ballRig.visible, x: (ballRig.getWorldPosition(new THREE.Vector3()).project(camera).x + 1) / 2, scale: ballRig.scale.x },
      { visible: secondBallRig.visible, x: (secondBallRig.getWorldPosition(new THREE.Vector3()).project(camera).x + 1) / 2, scale: secondBallRig.scale.x }
    ];
    screenState.hooksVisible = Number(hook.visible) + Number(secondHook.visible);
    screenState.strands = [
      { source: ball, anchor: ballAnchor, start, end, tool: hook },
      { source: secondBall, anchor: secondBallAnchor, start: secondStart, end: secondEnd, tool: secondHook }
    ].map(({ source, anchor, start: strandStart, end: strandEnd, tool }) => {
      const sourcePoint = source.localToWorld(anchor.clone());
      const tipPoint = tool.localToWorld(hookTip.clone());
      const projectedTip = tipPoint.clone().project(camera);
      return {
        attachmentError: world.localToWorld(strandStart.clone()).distanceTo(sourcePoint),
        tipError: world.localToWorld(strandEnd.clone()).distanceTo(tipPoint),
        tipX: (projectedTip.x + 1) / 2,
        tipY: (1 - projectedTip.y) / 2
      };
    });
    screenState.treeProgress = forming;
    screenState.potStitches = planterRows.map(row => ({ sage: row.sage.count, coral: row.coral.count }));
    renderer.render(scene, camera);
    frameCount++;
    canvas.dataset.frames = String(frameCount);
    canvas.dataset.progress = renderedProgress.toFixed(3);
    canvas.dataset.treeSegments = String(drawnTreeSegments);
    if (!paused || Math.abs(target - renderedProgress) > .001) frame = requestAnimationFrame(draw);
  }
  function requestDraw() { if (!frame) frame = requestAnimationFrame(draw); }
  window.threadScene = {
    setScroll(progress, metrics) { scrollProgress = progress; pageMetrics = metrics; hidden = false; requestDraw(); },
    setPaused(value) { paused = value; previousTime = 0; requestDraw(); },
    setExpanded(value) { expanded = value; requestDraw(); },
    getState() { return { paused, hidden, expanded, progress: renderedProgress, frames: frameCount, treeSegments: drawnTreeSegments, birds: birds.map(bird => ({ ...bird.state })), ...screenState }; }
  };
  addEventListener('pointermove', event => { pointer.set(event.clientX / innerWidth * 2 - 1, event.clientY / innerHeight * 2 - 1); }, { passive: true });
  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => { previousTime = 0; if (!document.hidden) requestDraw(); });
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); contextLost = true; cancelAnimationFrame(frame); frame = 0; host.classList.remove('is-ready'); host.dataset.state = 'fallback'; });
  canvas.addEventListener('webglcontextrestored', () => { contextLost = false; host.classList.add('is-ready'); host.dataset.state = 'ready'; requestDraw(); });
  addEventListener('pagehide', event => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (event.persisted) return;
    const geometries = new Set();
    const materials = new Set();
    scene.traverse(object => { if (object.geometry) geometries.add(object.geometry); if (object.material) materials.add(object.material); });
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
    renderer.dispose();
  });
  addEventListener('pageshow', event => { if (event.persisted) { previousTime = 0; requestDraw(); } });
  host.classList.add('is-ready');
  host.dataset.state = 'ready';
  resize();
})();