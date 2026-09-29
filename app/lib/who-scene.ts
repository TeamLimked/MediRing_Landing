// "Who we are → Our Principles" 배경 장면.
// 1) 와이어프레임 지형 위에 와이어프레임 캡슐 + 링(MediRing)
// 2) 스크롤하면 캡슐·링이 입자로 흩어지고, 지형이 빛나는 입자 파도로 바뀜
// 3) 다음 섹션(원칙 카드) 뒤에서 파도가 은은하게 계속 흐름
// 진행도는 setProgress(who 0..1, principles 0..1) 로 받는다(ScrollTrigger scrub). 클라이언트 전용.
import * as THREE from 'three'

export type WhoScene = {
  setProgress: (who: number, principles: number) => void
  dispose: () => void
}

const CYAN = new THREE.Color('#3AD6D4')
const BG = 0x03040c

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a))
const smooth = (t: number) => t * t * (3 - 2 * t)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// 지형 높이 — 선·점 셰이더가 같은 함수를 쓴다
const HEIGHT_GLSL = /* glsl */ `
  float terrain(vec2 p, float t, float amp) {
    float h = sin(p.x * 0.26 + t * 0.45) * cos(p.y * 0.34 + t * 0.32) * 0.95;
    h += sin((p.x + p.y) * 0.62 - t * 0.7) * 0.32;
    h += sin(p.x * 1.25 + p.y * 0.4 + t * 1.1) * 0.1;
    return h * amp;
  }
`

export function createWhoScene(container: HTMLElement): WhoScene {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4 || window.innerWidth < 640

  const renderer = new THREE.WebGLRenderer({ antialias: !lowPower, alpha: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.25 : 1.75))
  renderer.setClearColor(BG, 1)
  const canvas = renderer.domElement
  canvas.setAttribute('aria-hidden', 'true')
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  container.appendChild(canvas)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 80)
  const lookAt = new THREE.Vector3()

  const shared = {
    uTime: { value: 0 },
    uAmp: { value: 0.35 },
    uColor: { value: CYAN.clone() },
    uPixelRatio: { value: renderer.getPixelRatio() },
  }

  // ── 지형: 와이어프레임 선 ───────────────────────────────────
  const W = 56
  const D = 34
  const plane = new THREE.PlaneGeometry(W, D, lowPower ? 70 : 110, lowPower ? 42 : 66)
  plane.rotateX(-Math.PI / 2)
  const wire = new THREE.WireframeGeometry(plane)
  const lineMat = new THREE.ShaderMaterial({
    uniforms: { ...shared, uOpacity: { value: 0.55 } },
    vertexShader: /* glsl */ `
      ${HEIGHT_GLSL}
      uniform float uTime;
      uniform float uAmp;
      varying float vDepth;
      varying float vH;
      void main() {
        vec3 p = position;
        p.y = terrain(p.xz, uTime, uAmp);
        vH = p.y;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vDepth = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uAmp;
      varying float vDepth;
      varying float vH;
      void main() {
        float fade = smoothstep(30.0, 6.0, vDepth) * smoothstep(1.0, 4.0, vDepth);
        float crest = 0.55 + 0.45 * smoothstep(-uAmp, uAmp, vH);
        gl_FragColor = vec4(uColor * crest, uOpacity * fade * 0.55);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const terrainLines = new THREE.LineSegments(wire, lineMat)
  scene.add(terrainLines)

  // ── 지형: 입자 파도 ───────────────────────────────────────
  const dense = new THREE.PlaneGeometry(W, D, lowPower ? 150 : 240, lowPower ? 90 : 150)
  dense.rotateX(-Math.PI / 2)
  const count = dense.attributes.position!.count
  const seeds = new Float32Array(count)
  for (let i = 0; i < count; i += 1) seeds[i] = Math.random()
  dense.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
  const pointMat = new THREE.ShaderMaterial({
    uniforms: { ...shared, uOpacity: { value: 0 } },
    vertexShader: /* glsl */ `
      ${HEIGHT_GLSL}
      attribute float aSeed;
      uniform float uTime;
      uniform float uAmp;
      uniform float uPixelRatio;
      varying float vAlpha;
      varying float vCrest;
      void main() {
        vec3 p = position;
        p.x += (aSeed - 0.5) * 0.22;
        p.z += (fract(aSeed * 7.13) - 0.5) * 0.22;
        p.y = terrain(p.xz, uTime, uAmp);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        vCrest = smoothstep(-uAmp * 0.2, uAmp, p.y);
        float twinkle = 0.6 + 0.4 * sin(uTime * 2.0 + aSeed * 40.0);
        gl_PointSize = (1.7 + vCrest * 3.4 + step(0.985, aSeed) * 4.5) * uPixelRatio * (9.0 / -mv.z);
        vAlpha = twinkle * smoothstep(32.0, 5.0, -mv.z) * smoothstep(0.8, 3.0, -mv.z);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vAlpha;
      varying float vCrest;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        vec3 c = mix(uColor * 0.55, vec3(0.75, 1.0, 1.0), vCrest * 0.6);
        gl_FragColor = vec4(c, a * vAlpha * uOpacity * (0.55 + vCrest * 1.3));
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const terrainPoints = new THREE.Points(dense, pointMat)
  scene.add(terrainPoints)

  // ── 오브젝트: 와이어프레임 캡슐 + 링 ─────────────────────────
  const object = new THREE.Group()
  scene.add(object)
  const capsuleGeo = new THREE.CapsuleGeometry(0.85, 2.4, 5, 12)
  const ringGeo = new THREE.TorusGeometry(2.05, 0.1, 6, 56)
  const objLineMat = new THREE.LineBasicMaterial({
    color: CYAN,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const capsuleWire = new THREE.LineSegments(new THREE.WireframeGeometry(capsuleGeo), objLineMat)
  const ringWire = new THREE.LineSegments(new THREE.WireframeGeometry(ringGeo), objLineMat)
  const capsule = new THREE.Group()
  capsule.add(capsuleWire)
  capsule.rotation.z = -1.0
  const ring = new THREE.Group()
  ring.add(ringWire)
  ring.rotation.set(1.15, 0.2, 0.3)
  object.add(capsule, ring)

  // 흩어질 입자: 캡슐·링 정점 + 임의 방향
  const objPts: number[] = []
  const tmp = new THREE.Vector3()
  const collect = (geo: THREE.BufferGeometry, m: THREE.Matrix4) => {
    const pos = geo.attributes.position!
    for (let i = 0; i < pos.count; i += 1) {
      tmp.fromBufferAttribute(pos, i).applyMatrix4(m)
      objPts.push(tmp.x, tmp.y, tmp.z)
    }
  }
  capsule.updateMatrix()
  ring.updateMatrix()
  collect(capsuleGeo, capsule.matrix)
  collect(ringGeo, ring.matrix)
  const nObj = objPts.length / 3
  const dirs = new Float32Array(nObj * 3)
  for (let i = 0; i < nObj; i += 1) {
    tmp.set(Math.random() - 0.5, Math.random() * 0.8 - 0.2, Math.random() - 0.5).normalize().multiplyScalar(1.5 + Math.random() * 4)
    dirs[i * 3] = tmp.x
    dirs[i * 3 + 1] = tmp.y
    dirs[i * 3 + 2] = tmp.z
  }
  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(objPts, 3))
  dustGeo.setAttribute('aDir', new THREE.BufferAttribute(dirs, 3))
  const dustMat = new THREE.ShaderMaterial({
    uniforms: { ...shared, uDissolve: { value: 0 }, uOpacity: { value: 0 } },
    vertexShader: /* glsl */ `
      attribute vec3 aDir;
      uniform float uDissolve;
      uniform float uPixelRatio;
      void main() {
        vec3 p = position + aDir * uDissolve;
        p.y -= uDissolve * uDissolve * 0.6;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = 3.0 * uPixelRatio * (8.0 / -mv.z);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        gl_FragColor = vec4(uColor * 1.4, smoothstep(0.5, 0.0, d) * uOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const dust = new THREE.Points(dustGeo, dustMat)
  object.add(dust)

  // ── 레이아웃 ─────────────────────────────────────────────
  let mobile = false
  function resize() {
    const w = Math.max(1, container.clientWidth)
    const h = Math.max(1, container.clientHeight)
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    mobile = camera.aspect < 0.9
    if (!running) render()
  }

  // ── 상태 ────────────────────────────────────────────────
  let who = 0
  let principles = 0
  let time = 0

  function render() {
    // 단계: 0~0.4 와이어프레임 / 0.35~0.8 흩어짐·파도 전환 / 0.8~1 파도
    const dissolve = smooth(range(who, 0.34, 0.78))
    const wave = smooth(range(who, 0.45, 0.95))
    const settle = smooth(principles)

    shared.uTime.value = time
    shared.uAmp.value = lerp(0.35, 1.25, wave) * lerp(1, 0.7, settle)
    lineMat.uniforms.uOpacity!.value = (1 - wave) * 1.0
    pointMat.uniforms.uOpacity!.value = wave * lerp(1, 0.6, settle)
    objLineMat.opacity = 0.85 * (1 - smooth(range(who, 0.3, 0.55)))
    dustMat.uniforms.uOpacity!.value = Math.sin(Math.PI * range(who, 0.3, 0.85)) * 0.9
    dustMat.uniforms.uDissolve!.value = dissolve * 1.6

    // 오브젝트: 오른쪽 지형 위(모바일은 가운데 아래)
    object.position.set(mobile ? 0.3 : 4.2, mobile ? -0.9 : 1.55, mobile ? -0.5 : -0.5)
    object.scale.setScalar(mobile ? 0.6 : 1)
    capsule.rotation.y = time * 0.25
    ring.rotation.z = 0.3 + time * 0.18
    object.position.y += Math.sin(time * 0.8) * 0.08

    // 카메라: 지형을 내려다보다가 → 파도 가까이 낮게
    const camY = lerp(mobile ? 3.6 : 2.9, 1.5, wave) + settle * 0.6
    const camZ = lerp(mobile ? 13.5 : 10.5, 7.5, wave) - settle * 0.8
    camera.position.set(Math.sin(time * 0.05) * 0.4, camY, camZ)
    lookAt.set(mobile ? 0 : 1.2 * (1 - wave), lerp(0.6, 0.1, wave), lerp(0, -6, wave))
    camera.lookAt(lookAt)

    renderer.render(scene, camera)
  }

  // ── 재생 제어 ────────────────────────────────────────────
  let running = false
  let inView = false
  let last = performance.now()
  function tick() {
    const now = performance.now()
    time += Math.min(0.05, (now - last) / 1000)
    last = now
    render()
  }
  function updateRunning() {
    const shouldRun = !reducedMotion && inView && document.visibilityState === 'visible'
    if (shouldRun === running) return
    running = shouldRun
    last = performance.now()
    renderer.setAnimationLoop(running ? tick : null)
  }
  const io = new IntersectionObserver((entries) => {
    inView = entries.some((e) => e.isIntersecting)
    updateRunning()
  })
  io.observe(container)
  const ro = new ResizeObserver(resize)
  ro.observe(container)
  document.addEventListener('visibilitychange', updateRunning)

  resize()
  render()

  return {
    setProgress(w, p) {
      who = clamp01(w)
      principles = clamp01(p)
      if (!running) render()
    },
    dispose() {
      renderer.setAnimationLoop(null)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', updateRunning)
      ;[plane, wire, dense, capsuleGeo, ringGeo, dustGeo].forEach((g) => g.dispose())
      capsuleWire.geometry.dispose()
      ringWire.geometry.dispose()
      ;[lineMat, pointMat, objLineMat, dustMat].forEach((m) => m.dispose())
      renderer.dispose()
      canvas.remove()
    },
  }
}
