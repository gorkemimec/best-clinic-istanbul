import { useEffect, useRef } from 'react'
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl'

/* ── helpers ── */
function debounce(fn, ms) {
  let t
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms) }
}
function lerp(a, b, t) { return a + (b - a) * t }

function createTextTexture(gl, text, font = 'bold 24px sans-serif', color = '#ffffff') {
  const c = document.createElement('canvas')
  const ctx = c.getContext('2d')
  ctx.font = font
  const m = ctx.measureText(text)
  const w = Math.ceil(m.width) + 20
  const h = Math.ceil(parseInt(font, 10) * 1.4) + 20
  c.width = w; c.height = h
  ctx.font = font
  ctx.fillStyle = color
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  ctx.clearRect(0, 0, w, h)
  ctx.fillText(text, w / 2, h / 2)
  const texture = new Texture(gl, { generateMipmaps: false })
  texture.image = c
  return { texture, width: w, height: h }
}

/* ── Title mesh ── */
class Title {
  constructor({ gl, plane, renderer, text, textColor, font }) {
    this.gl = gl; this.plane = plane; this.text = text
    const { texture, width, height } = createTextTexture(gl, text, font || 'bold 22px sans-serif', textColor || '#ffffff')
    const geo = new Plane(gl)
    const prog = new Program(gl, {
      vertex: `attribute vec3 position; attribute vec2 uv; uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix; varying vec2 vUv;
        void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragment: `precision highp float; uniform sampler2D tMap; varying vec2 vUv;
        void main(){ vec4 c=texture2D(tMap,vUv); if(c.a<0.1)discard; gl_FragColor=c; }`,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    })
    this.mesh = new Mesh(gl, { geometry: geo, program: prog })
    const aspect = width / height
    const th = plane.scale.y * 0.12
    this.mesh.scale.set(th * aspect, th, 1)
    this.mesh.position.y = -plane.scale.y * 0.5 - th * 0.6
    this.mesh.setParent(plane)
  }
}

/* ── Media item ── */
class Media {
  constructor({ geometry, gl, image, index, length, renderer, scene, screen, text, viewport, bend, textColor, borderRadius, font }) {
    this.extra = 0; this.geometry = geometry; this.gl = gl; this.image = image
    this.index = index; this.length = length; this.renderer = renderer
    this.scene = scene; this.screen = screen; this.text = text
    this.viewport = viewport; this.bend = bend; this.textColor = textColor
    this.borderRadius = borderRadius; this.font = font
    this.createShader(); this.createMesh(); this.createTitle(); this.onResize()
  }
  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true })
    this.program = new Program(this.gl, {
      depthTest: false, depthWrite: false,
      vertex: `precision highp float; attribute vec3 position; attribute vec2 uv;
        uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragment: `precision highp float; uniform vec2 uImageSizes; uniform vec2 uPlaneSizes;
        uniform sampler2D tMap; uniform float uBorderRadius; varying vec2 vUv;
        float roundedBoxSDF(vec2 p,vec2 b,float r){ vec2 d=abs(p)-b; return length(max(d,vec2(0.0)))+min(max(d.x,d.y),0.0)-r; }
        void main(){
          vec2 ratio=vec2(min((uPlaneSizes.x/uPlaneSizes.y)/(uImageSizes.x/uImageSizes.y),1.0),min((uPlaneSizes.y/uPlaneSizes.x)/(uImageSizes.y/uImageSizes.x),1.0));
          vec2 uv=vec2(vUv.x*ratio.x+(1.0-ratio.x)*0.5,vUv.y*ratio.y+(1.0-ratio.y)*0.5);
          vec4 color=texture2D(tMap,uv);
          float d=roundedBoxSDF(vUv-0.5,vec2(0.5-uBorderRadius),uBorderRadius);
          float alpha=1.0-smoothstep(-0.002,0.002,d);
          gl_FragColor=vec4(color.rgb,alpha); }`,
      uniforms: {
        tMap: { value: texture }, uPlaneSizes: { value: [0, 0] }, uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 }, uTime: { value: 100 * Math.random() }, uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    })
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = this.image
    img.onload = () => {
      texture.image = img
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight]
    }
  }
  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program })
    this.plane.setParent(this.scene)
  }
  createTitle() {
    this.title = new Title({ gl: this.gl, plane: this.plane, renderer: this.renderer, text: this.text, textColor: this.textColor, font: this.font })
  }
  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra
    const x = this.plane.position.x
    const H = this.viewport.width / 2
    if (this.bend === 0) {
      this.plane.position.y = 0; this.plane.rotation.z = 0
    } else {
      const B = Math.abs(this.bend)
      const R = (H * H + B * B) / (2 * B)
      const eX = Math.min(Math.abs(x), H)
      const arc = R - Math.sqrt(R * R - eX * eX)
      if (this.bend > 0) { this.plane.position.y = -arc; this.plane.rotation.z = -Math.sign(x) * Math.asin(eX / R) }
      else { this.plane.position.y = arc; this.plane.rotation.z = Math.sign(x) * Math.asin(eX / R) }
    }
    this.speed = scroll.current - scroll.last
    this.program.uniforms.uTime.value += 0.04
    this.program.uniforms.uSpeed.value = this.speed
    const po = this.plane.scale.x / 2, vo = this.viewport.width / 2
    this.isBefore = this.plane.position.x + po < -vo
    this.isAfter = this.plane.position.x - po > vo
    if (direction === 'right' && this.isBefore) { this.extra -= this.widthTotal; this.isBefore = this.isAfter = false }
    if (direction === 'left' && this.isAfter) { this.extra += this.widthTotal; this.isBefore = this.isAfter = false }
  }
  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen
    if (viewport) this.viewport = viewport
    this.scale = this.screen.height / 1500
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y]
    this.padding = 2
    this.width = this.plane.scale.x + this.padding
    this.widthTotal = this.width * this.length
    this.x = this.width * this.index
  }
}

/* ── Gallery engine ── */
class GalleryApp {
  constructor(container, { items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase }) {
    this.container = container
    this.scrollSpeed = scrollSpeed
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 }
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200)
    this.createRenderer(); this.createCamera(); this.createScene()
    this.onResize(); this.createGeometry()
    this.createMedias(items, bend, textColor, borderRadius, font)
    this.update(); this.addEventListeners()
  }
  createRenderer() {
    this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)
    this.container.appendChild(this.gl.canvas)
  }
  createCamera() { this.camera = new Camera(this.gl); this.camera.fov = 45; this.camera.position.z = 20 }
  createScene() { this.scene = new Transform() }
  createGeometry() { this.planeGeometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 }) }
  createMedias(items, bend = 1, textColor, borderRadius, font) {
    const galleryItems = items && items.length ? items : []
    this.mediasImages = galleryItems.concat(galleryItems)
    this.medias = this.mediasImages.map((data, index) =>
      new Media({ geometry: this.planeGeometry, gl: this.gl, image: data.image, index, length: this.mediasImages.length, renderer: this.renderer, scene: this.scene, screen: this.screen, text: data.text, viewport: this.viewport, bend, textColor, borderRadius, font })
    )
  }
  onTouchDown(e) { this.isDown = true; this.scroll.position = this.scroll.current; this.start = e.touches ? e.touches[0].clientX : e.clientX }
  onTouchMove(e) { if (!this.isDown) return; const x = e.touches ? e.touches[0].clientX : e.clientX; this.scroll.target = this.scroll.position + (this.start - x) * (this.scrollSpeed * 0.025) }
  onTouchUp() { this.isDown = false; this.onCheck() }
  onWheel(e) { const d = e.deltaY || e.wheelDelta || 0; this.scroll.target += (d > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2; this.onCheckDebounce() }
  onCheck() { if (!this.medias?.[0]) return; const w = this.medias[0].width; const i = Math.round(Math.abs(this.scroll.target) / w); this.scroll.target = this.scroll.target < 0 ? -(w * i) : w * i }
  onResize() {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight }
    this.renderer.setSize(this.screen.width, this.screen.height)
    this.camera.perspective({ aspect: this.screen.width / this.screen.height })
    const fov = (this.camera.fov * Math.PI) / 180
    const h = 2 * Math.tan(fov / 2) * this.camera.position.z
    this.viewport = { width: h * this.camera.aspect, height: h }
    if (this.medias) this.medias.forEach(m => m.onResize({ screen: this.screen, viewport: this.viewport }))
  }
  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease)
    const dir = this.scroll.current > this.scroll.last ? 'right' : 'left'
    if (this.medias) this.medias.forEach(m => m.update(this.scroll, dir))
    this.renderer.render({ scene: this.scene, camera: this.camera })
    this.scroll.last = this.scroll.current
    this.raf = requestAnimationFrame(this.update.bind(this))
  }
  addEventListeners() {
    this._onResize = this.onResize.bind(this)
    this._onWheel = this.onWheel.bind(this)
    this._onDown = this.onTouchDown.bind(this)
    this._onMove = this.onTouchMove.bind(this)
    this._onUp = this.onTouchUp.bind(this)
    window.addEventListener('resize', this._onResize)
    this.container.addEventListener('wheel', this._onWheel, { passive: true })
    this.container.addEventListener('mousedown', this._onDown)
    this.container.addEventListener('mousemove', this._onMove)
    this.container.addEventListener('mouseup', this._onUp)
    this.container.addEventListener('touchstart', this._onDown, { passive: true })
    this.container.addEventListener('touchmove', this._onMove, { passive: true })
    this.container.addEventListener('touchend', this._onUp)
  }
  destroy() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this._onResize)
    this.container.removeEventListener('wheel', this._onWheel)
    this.container.removeEventListener('mousedown', this._onDown)
    this.container.removeEventListener('mousemove', this._onMove)
    this.container.removeEventListener('mouseup', this._onUp)
    this.container.removeEventListener('touchstart', this._onDown)
    this.container.removeEventListener('touchmove', this._onMove)
    this.container.removeEventListener('touchend', this._onUp)
    if (this.renderer?.gl?.canvas?.parentNode) this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas)
  }
}

/* ── React component ── */
export default function CircularGallery({
  items,
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  font = 'bold 22px sans-serif',
  scrollSpeed = 2,
  scrollEase = 0.05,
}) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const app = new GalleryApp(ref.current, { items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase })
    return () => app.destroy()
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase])
  return <div className="circular-gallery" ref={ref} />
}
