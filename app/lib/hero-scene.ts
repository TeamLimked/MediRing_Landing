// 히어로 3D 장면: 유리 링(MediRing) + 링 코어를 도는 심박(ECG) 펄스 + 궤도를 도는 캡슐·연질캡슐·정제 + 입자 필드.
// 클라이언트 전용 — HeroScene.client.vue 에서 동적 import 한다(three 가 메인 번들에 들어가지 않도록).
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

export type HeroSceneOptions = {
  onReady?: () => void
}

// 앱 theme.ts 의 영양소 색(NUTRIENT_HUES)
const HUES = ['#10B981', '#FF8A3D', '#22B8CF', '#F7B801', '#6D8BFF', '#FF6B9D', '#12C4B0', '#A06CD5']
const MINT = new THREE.Color('#48E0D8') // 시안-민트(시네마틱 톤)
const RING_RADIUS = 1.75
const TUBE_RADIUS = 0.34

type Pill = {
  pivot: THREE.Group // 궤도면(기울기)
  body: THREE.Object3D // 실제 알약
  radius: number
  speed: number
  phase: number
  spin: THREE.Vector3
  bob: number
  delay: number
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeOutBack = (t: number) => {
  const c1 = 1.4
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

// 약 55bpm 심박: R 파 + 약한 T 파
function heartbeat(seconds: number) {
  const p = (seconds % 1.1) / 1.1
  return Math.exp(-Math.pow(p - 0.05, 2) / 0.0012) + 0.45 * Math.exp(-Math.pow(p - 0.32, 2) / 0.004)
}

// 원주 위 한 박동의 ECG 파형(0..1 구간) — P·Q·R·S·T
function ecgShape(u: number) {
  const g = (c: number, w: number, a: number) => a * Math.exp(-Math.pow(u - c, 2) / w)
  return g(0.18, 0.0012, 0.12) + g(0.3, 0.00012, -0.12) + g(0.335, 0.00018, 0.95) + g(0.37, 0.00015, -0.28) + g(0.58, 0.003, 0.22)
}

function makeGlowTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.45)')
  g.addColorStop(0.6, 'rgba(255,255,255,0.08)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function createHeroScene(container: HTMLElement, options: HeroSceneOptions = {}): () => void {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4 || window.innerWidth < 640

  // WebGL 을 쓸 수 없으면 여기서 throw → 컴포넌트가 정적 포스터로 대체
  const renderer = new THREE.WebGLRenderer({ antialias: !lowPower, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2))
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  const canvas = renderer.domElement
  canvas.setAttribute('aria-hidden', 'true')
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  container.appendChild(canvas)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
  camera.position.set(0, 0, 11)

  const pmrem = new THREE.PMREMGenerator(renderer)
  const envScene = new RoomEnvironment()
  const envTexture = pmrem.fromScene(envScene, 0.04).texture
  scene.environment = envTexture

  // ── 조명 ──────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0xffffff, 0.35))
  const key = new THREE.DirectionalLight(0xe6fff4, 2.2)
  key.position.set(3, 4, 6)
  scene.add(key)
  const rimWarm = new THREE.PointLight(0xff8a3d, 22, 18)
  rimWarm.position.set(-4, -2.5, 2)
  scene.add(rimWarm)
  const rimCool = new THREE.PointLight(0x22b8cf, 40, 18)
  rimCool.position.set(4, 3, -2)
  scene.add(rimCool)

  // 레이아웃(화면비에 따라 위치·크기) → 마우스 기울기 → 장면 본체
  const layout = new THREE.Group()
  const tilt = new THREE.Group()
  const world = new THREE.Group()
  layout.add(tilt)
  tilt.add(world)
  scene.add(layout)

  // ── 배경 후광 ────────────────────────────────────────────
  const glowTex = makeGlowTexture()
  const glowMat = new THREE.SpriteMaterial({
    map: glowTex,
    color: MINT,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const glow = new THREE.Sprite(glowMat)
  glow.scale.setScalar(9)
  glow.position.z = -1.5
  world.add(glow)

  // ── 유리 링 ──────────────────────────────────────────────
  const ringGroup = new THREE.Group()
  ringGroup.rotation.set(0.42, -0.5, 0.1)
  world.add(ringGroup)

  const ringMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#E6FBFF'),
    metalness: 0,
    roughness: 0.08,
    transmission: 1,
    thickness: 1.3,
    ior: 1.42,
    iridescence: 0.55,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [120, 480],
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    attenuationColor: new THREE.Color('#1FB5C4'),
    attenuationDistance: 2.4,
    envMapIntensity: 1.25,
  })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(RING_RADIUS, TUBE_RADIUS, lowPower ? 48 : 96, lowPower ? 160 : 256), ringMat)
  ringGroup.add(ring)

  // 링 속을 흐르는 빛나는 코어
  const coreMat = new THREE.MeshBasicMaterial({ color: MINT, transparent: true, opacity: 0.9 })
  const core = new THREE.Mesh(new THREE.TorusGeometry(RING_RADIUS, 0.028, 12, 256), coreMat)
  ringGroup.add(core)

  // ── ECG 펄스(링 바깥 원주를 도는 심박 파형) ───────────────────────
  const ECG_POINTS = 720
  const ECG_BEATS = 3
  const ecgPositions = new Float32Array(ECG_POINTS * 3)
  const ecgColors = new Float32Array(ECG_POINTS * 3)
  const ecgR = RING_RADIUS + TUBE_RADIUS + 0.32
  for (let i = 0; i < ECG_POINTS; i += 1) {
    const f = i / ECG_POINTS
    const theta = f * Math.PI * 2
    const u = (f * ECG_BEATS) % 1
    const r = ecgR + ecgShape(u) * 0.55
    ecgPositions[i * 3] = Math.cos(theta) * r
    ecgPositions[i * 3 + 1] = Math.sin(theta) * r
    ecgPositions[i * 3 + 2] = 0
    // 머리(f→1)가 가장 밝고 꼬리로 갈수록 사라짐
    const intensity = Math.pow(f, 2.4)
    ecgColors[i * 3] = MINT.r * intensity
    ecgColors[i * 3 + 1] = MINT.g * intensity
    ecgColors[i * 3 + 2] = MINT.b * intensity
  }
  const ecgGeo = new THREE.BufferGeometry()
  ecgGeo.setAttribute('position', new THREE.BufferAttribute(ecgPositions, 3))
  ecgGeo.setAttribute('color', new THREE.BufferAttribute(ecgColors, 3))
  const ecgMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const ecg = new THREE.Line(ecgGeo, ecgMat)
  ringGroup.add(ecg)

  // 펄스 머리의 빛 점
  const headMat = new THREE.SpriteMaterial({
    map: glowTex,
    color: new THREE.Color('#B8FFE4'),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const head = new THREE.Sprite(headMat)
  head.scale.setScalar(0.5)
  ecg.add(head)
  head.position.set(ecgR, 0, 0.001)

  // ── 알약 ────────────────────────────────────────────────
  const materials = new Map<string, THREE.Material>()
  const shellMat = (color: string) => {
    let m = materials.get(color)
    if (!m) {
      m = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        roughness: 0.28,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        sheen: 0.4,
        sheenColor: new THREE.Color('#ffffff'),
      })
      materials.set(color, m)
    }
    return m
  }
  const tabletMat = (color: string) => {
    const k = `tablet:${color}`
    let m = materials.get(k)
    if (!m) {
      m = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.62, metalness: 0 })
      materials.set(k, m)
    }
    return m
  }
  const softgelMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#FFC857'),
    roughness: 0.04,
    transmission: 0.92,
    thickness: 0.45,
    ior: 1.48,
    attenuationColor: new THREE.Color('#F7A801'),
    attenuationDistance: 0.35,
    clearcoat: 1,
    envMapIntensity: 1.4,
  })

  // 캡슐: 반쪽 두 개(원통 + 반구) — 한쪽은 흰색, 한쪽은 영양소 색
  const CAP_R = 0.15
  const CAP_H = 0.4
  const capCyl = new THREE.CylinderGeometry(CAP_R, CAP_R, CAP_H / 2, 28, 1, true)
  const capTop = new THREE.SphereGeometry(CAP_R, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2)
  const capBottom = new THREE.SphereGeometry(CAP_R, 28, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2)
  // 이음새가 살짝 겹쳐 보이도록 색 쪽을 아주 조금 굵게
  const capCylOuter = new THREE.CylinderGeometry(CAP_R * 1.035, CAP_R * 1.035, CAP_H / 2, 28, 1, true)
  const capTopOuter = new THREE.SphereGeometry(CAP_R * 1.035, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2)

  function makeCapsule(color: string) {
    const g = new THREE.Group()
    const cA = new THREE.Mesh(capCylOuter, shellMat(color))
    cA.position.y = CAP_H / 4
    const sA = new THREE.Mesh(capTopOuter, shellMat(color))
    sA.position.y = CAP_H / 2
    const cB = new THREE.Mesh(capCyl, shellMat('#F4FBF7'))
    cB.position.y = -CAP_H / 4
    const sB = new THREE.Mesh(capBottom, shellMat('#F4FBF7'))
    sB.position.y = -CAP_H / 2
    g.add(cA, sA, cB, sB)
    return g
  }

  const softgelGeo = new THREE.SphereGeometry(0.17, 32, 20)
  function makeSoftgel() {
    const m = new THREE.Mesh(softgelGeo, softgelMat)
    m.scale.set(1, 1.38, 1)
    return m
  }

  // 정제: 가장자리가 둥근 원판(Lathe)
  const tabletProfile: THREE.Vector2[] = [new THREE.Vector2(0, -0.055)]
  for (let i = 0; i <= 10; i += 1) {
    const a = -Math.PI / 2 + (i / 10) * Math.PI
    tabletProfile.push(new THREE.Vector2(0.17 + Math.cos(a) * 0.055, Math.sin(a) * 0.055))
  }
  tabletProfile.push(new THREE.Vector2(0, 0.055))
  const tabletGeo = new THREE.LatheGeometry(tabletProfile, 40)
  function makeTablet(color: string) {
    return new THREE.Mesh(tabletGeo, tabletMat(color))
  }

  const orbitPlanes = [
    new THREE.Euler(1.2, 0.2, 0.3),
    new THREE.Euler(-0.9, 0.6, -0.2),
    new THREE.Euler(0.25, -1.1, 0.5),
  ]
  const pills: Pill[] = []
  const PILL_COUNT = lowPower ? 11 : 16
  const orbitGuides: THREE.LineLoop[] = []
  const guideMat = new THREE.LineBasicMaterial({ color: MINT, transparent: true, opacity: 0.1, depthWrite: false })

  orbitPlanes.forEach((euler, i) => {
    const radius = 2.9 + i * 0.45
    const pts: THREE.Vector3[] = []
    for (let k = 0; k < 128; k += 1) {
      const a = (k / 128) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0))
    }
    const guide = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), guideMat)
    guide.rotation.copy(euler)
    world.add(guide)
    orbitGuides.push(guide)
  })

  for (let i = 0; i < PILL_COUNT; i += 1) {
    const planeIndex = i % orbitPlanes.length
    const pivot = new THREE.Group()
    pivot.rotation.copy(orbitPlanes[planeIndex]!)
    world.add(pivot)

    const kind = i % 5
    const hue = HUES[i % HUES.length]!
    const body = kind === 1 || kind === 4 ? makeSoftgel() : kind === 3 ? makeTablet(i % 2 ? '#F4FBF7' : '#FFE7D3') : makeCapsule(hue)
    body.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
    pivot.add(body)

    pills.push({
      pivot,
      body,
      radius: 2.9 + planeIndex * 0.45 + (Math.random() - 0.5) * 0.3,
      speed: (0.16 + Math.random() * 0.1) * (planeIndex === 1 ? -1 : 1),
      phase: (i / PILL_COUNT) * Math.PI * 2 * 3 + Math.random() * 0.4,
      spin: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(1.4),
      bob: Math.random() * Math.PI * 2,
      delay: 0.25 + i * 0.07,
    })
  }

  // ── 입자 필드 ────────────────────────────────────────────
  const PARTICLES = lowPower ? 700 : 1500
  const pPos = new Float32Array(PARTICLES * 3)
  const pCol = new Float32Array(PARTICLES * 3)
  const pScale = new Float32Array(PARTICLES)
  const pPhase = new Float32Array(PARTICLES)
  const particlePalette = ['#3AD6D4', '#3AD6D4', '#49D0E4', '#49D0E4', '#34D9A0', '#8FB8FF', '#EAF6EF'].map((c) => new THREE.Color(c))
  for (let i = 0; i < PARTICLES; i += 1) {
    // 링 주변에 모이고 바깥으로 흩어지는 분포
    const r = 2.6 + Math.pow(Math.random(), 1.6) * 9
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7
    pPos[i * 3 + 2] = r * Math.cos(phi) * 0.8 - 1
    const c = particlePalette[Math.floor(Math.random() * particlePalette.length)]!
    pCol[i * 3] = c.r
    pCol[i * 3 + 1] = c.g
    pCol[i * 3 + 2] = c.b
    pScale[i] = 0.4 + Math.random() * 1.6
    pPhase[i] = Math.random() * Math.PI * 2
  }
  const particleGeo = new THREE.BufferGeometry()
  particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
  particleGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3))
  particleGeo.setAttribute('aScale', new THREE.BufferAttribute(pScale, 1))
  particleGeo.setAttribute('aPhase', new THREE.BufferAttribute(pPhase, 1))
  const particleMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uPulse: { value: 0 },
    },
    vertexShader: /* glsl */ `
      attribute float aScale;
      attribute float aPhase;
      attribute vec3 color;
      uniform float uTime;
      uniform float uPixelRatio;
      uniform float uPulse;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        p.y += sin(uTime * 0.35 + aPhase) * 0.12;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float twinkle = 0.55 + 0.45 * sin(uTime * 1.4 + aPhase * 3.0);
        gl_PointSize = aScale * (22.0 + uPulse * 6.0) * uPixelRatio / -mv.z;
        vColor = color;
        vAlpha = twinkle * smoothstep(22.0, 6.0, -mv.z);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vColor, a * a * vAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const particles = new THREE.Points(particleGeo, particleMat)
  world.add(particles)

  // ── 레이아웃·입력 ──────────────────────────────────────────
  let width = 1
  let height = 1
  function resize() {
    width = Math.max(1, container.clientWidth)
    height = Math.max(1, container.clientHeight)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    const dist = camera.position.z
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist
    const halfW = halfH * camera.aspect
    if (camera.aspect > 1.05) {
      // 데스크톱: 헤드라인이 왼쪽 아래에 오므로 장면은 오른쪽 위로
      layout.position.set(halfW * 0.34, halfH * 0.16, 0)
      layout.scale.setScalar(Math.min(1.12, 0.8 + camera.aspect * 0.14))
    } else {
      // 모바일·세로: 위쪽 가운데, 텍스트는 아래
      layout.position.set(0, halfH * 0.36, 0)
      layout.scale.setScalar(Math.max(0.46, Math.min(0.8, halfW / 4.4)))
    }
    if (!running) renderFrame(lastT)
  }

  const pointer = new THREE.Vector2(0, 0)
  const pointerTarget = new THREE.Vector2(0, 0)
  function onPointerMove(e: PointerEvent) {
    if (e.pointerType !== 'mouse') return
    pointerTarget.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)
  }

  let scrollProgress = 0
  function onScroll() {
    const rect = container.getBoundingClientRect()
    scrollProgress = clamp01(-rect.top / Math.max(1, rect.height))
  }

  // ── 프레임 ──────────────────────────────────────────────
  const start = performance.now()
  let lastT = reducedMotion ? 6 : 0
  let readyFired = false
  let prevT = lastT

  function renderFrame(t: number) {
    const dt = Math.min(0.05, Math.max(0, t - prevT))
    prevT = t
    const pulse = reducedMotion ? 0.3 : heartbeat(t)
    const intro = reducedMotion ? 1 : clamp01(t / 2.2)

    // 링 등장 + 심박에 맞춘 미세한 팽창
    const ringScale = easeOutBack(clamp01(t / 1.6)) * (1 + pulse * 0.012)
    ringGroup.scale.setScalar(Math.max(0.001, reducedMotion ? 1 : ringScale))
    ringGroup.rotation.z = 0.1 + t * 0.06
    ringGroup.rotation.x = 0.42 + Math.sin(t * 0.3) * 0.06
    ecg.rotation.z = t * 1.35

    coreMat.opacity = 0.55 + pulse * 0.45
    glowMat.opacity = (0.22 + pulse * 0.16) * intro
    headMat.opacity = intro

    for (const p of pills) {
      const local = reducedMotion ? 1 : clamp01((t - p.delay) / 1.8)
      const e = easeOutCubic(local)
      const angle = p.phase + t * p.speed
      const r = p.radius * (1 + (1 - e) * 2.2)
      p.body.position.set(Math.cos(angle) * r, Math.sin(angle) * r, Math.sin(t * 0.8 + p.bob) * 0.12)
      p.body.rotation.x += p.spin.x * dt
      p.body.rotation.y += p.spin.y * dt
      p.body.rotation.z += p.spin.z * dt
      p.body.scale.setScalar(Math.max(0.001, e))
    }

    guideMat.opacity = 0.1 * intro
    particleMat.uniforms.uTime!.value = t
    particleMat.uniforms.uPulse!.value = pulse
    particles.rotation.y = t * 0.02
    particles.rotation.x = Math.sin(t * 0.05) * 0.05

    // 마우스 기울기 + 스크롤
    pointer.lerp(pointerTarget, 0.05)
    tilt.rotation.y = pointer.x * 0.28
    tilt.rotation.x = pointer.y * 0.18
    world.rotation.z = scrollProgress * 0.6
    world.position.y = scrollProgress * 1.2
    camera.position.z = 11 + scrollProgress * 2.5

    renderer.render(scene, camera)

    if (!readyFired) {
      readyFired = true
      options.onReady?.()
    }
  }

  // ── 재생 제어(화면 밖·탭 숨김·모션 줄이기) ────────────────────────
  let running = false
  let inView = true
  function tick() {
    lastT = (performance.now() - start) / 1000
    renderFrame(lastT)
  }
  function updateRunning() {
    const shouldRun = !reducedMotion && inView && document.visibilityState === 'visible'
    if (shouldRun === running) return
    running = shouldRun
    renderer.setAnimationLoop(running ? tick : null)
  }

  const io = new IntersectionObserver(
    (entries) => {
      inView = entries.some((e) => e.isIntersecting)
      updateRunning()
    },
    { threshold: 0 },
  )
  io.observe(container)
  const ro = new ResizeObserver(resize)
  ro.observe(container)

  function onContextLost(e: Event) {
    e.preventDefault()
    renderer.setAnimationLoop(null)
    running = false
  }

  document.addEventListener('visibilitychange', updateRunning)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  canvas.addEventListener('webglcontextlost', onContextLost)

  resize()
  onScroll()
  if (reducedMotion) renderFrame(lastT)
  updateRunning()

  // ── 정리 ────────────────────────────────────────────────
  return () => {
    renderer.setAnimationLoop(null)
    io.disconnect()
    ro.disconnect()
    document.removeEventListener('visibilitychange', updateRunning)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('scroll', onScroll)
    canvas.removeEventListener('webglcontextlost', onContextLost)

    const geometries = new Set<THREE.BufferGeometry>()
    const mats = new Set<THREE.Material>()
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (mesh.geometry) geometries.add(mesh.geometry)
      const m = mesh.material
      if (Array.isArray(m)) m.forEach((x) => mats.add(x))
      else if (m) mats.add(m)
    })
    geometries.forEach((g) => g.dispose())
    mats.forEach((m) => m.dispose())
    glowTex.dispose()
    envTexture.dispose()
    envScene.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      mesh.geometry?.dispose()
      const m = mesh.material
      if (Array.isArray(m)) m.forEach((x) => x.dispose())
      else m?.dispose()
    })
    pmrem.dispose()
    renderer.dispose()
    canvas.remove()
  }
}
