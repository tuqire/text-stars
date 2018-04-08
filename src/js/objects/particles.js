import FBO from 'three.js-fbo'
import { createDataTexture } from '../utils'
import { positionSimulationVertexShader, positionSimulationFragmentShader } from '../shaders/positionSimulationShaders'
import { sizeSimulationVertexShader, sizeSimulationFragmentShader } from '../shaders/sizeSimulationShaders'
import { vertexShader, fragmentShader } from '../shaders/shaders'

export default class Particles {
  constructor ({
    numParticles = 10000,
    configUniforms = {
      color: { value: new THREE.Color(0xffffff) },
      sizeMultiplierForScreen: { value: (window.innerHeight * window.devicePixelRatio) / 2 },
      starImg: { value: new THREE.TextureLoader().load('images/star.png') }
    },
    blending = THREE.AdditiveBlending,
    transparent = true,
    depthTest = true,
    depthWrite = false,

    renderer,

    radius = 100, // radius of outer particle

    // used to define and animate sizes
    sizeRange = 0.5, // the amount the size is allowed to fluxuate in animation
    minSize = 1,
    maxSize = 3,
    incSize = 0.01, // the amount the size is increased / decreased per frame

    // used to define raycasting boundries
    hoverDist = 10,
    hoverSizeInc = 0.05,
    hoverMaxSizeMultiplier = 5,
    skew = 1,

    // values to use when stars form text
    animationFrames = [],
    topSpeed = 0.07,
    acceleration = 0.01,
    textSizeMultiplier = 2,
    textPositionMultiplier = 2
  }) {
    this.renderer = renderer

    this.numParticles = numParticles
    this.radius = radius
    this.skew = skew // skews the median size

    // used to define star glinting
    this.sizeRange = sizeRange
    this.minSize = minSize
    this.maxSize = maxSize
    this.incSize = incSize

    // used to define mouse interaction animation
    this.hoverDist = hoverDist
    this.hoverSizeInc = hoverSizeInc
    this.hoverMaxSizeMultiplier = hoverMaxSizeMultiplier

    // use to define moving particles
    this.topSpeed = topSpeed
    this.acceleration = acceleration
    this.textSizeMultiplier = textSizeMultiplier
    this.textPositionMultiplier = textPositionMultiplier
    this.animationFrames = animationFrames

    // used to define mouse interaction
    this.windowHalfX = window.innerWidth / 2
    this.windowHalfY = window.innerHeight / 2

    // height and width that set up a texture in memory
    // this texture is used to store particle position values
    const tHeight = Math.ceil(Math.sqrt(this.numParticles))
    const tWidth = tHeight
    this.numParticles = tWidth * tHeight

    this.positions = new Float32Array(this.numParticles * 3)

    this.positionFBO = new FBO({
      tWidth,
      tHeight,
      renderer: renderer.get(),
      uniforms: {
        tDefaultPosition: { type: 't', value: 0 }, // default star positions
        tText: { type: 't', value: 0 }, // texture holding text

        topSpeed: { type: 'f', value: this.topSpeed }, // the top speed of stars
        acceleration: { type: 'f', value: this.acceleration }, // the star particle acceleration

        textPositionMultiplier: { type: 'f', value: this.textPositionMultiplier }
      },
      simulationVertexShader: positionSimulationVertexShader,
      simulationFragmentShader: positionSimulationFragmentShader
    })

    this.positionFBO.setTextureUniform('tDefaultPosition', this.getPositions())

    this.sizeFBO = new FBO({
      tWidth,
      tHeight,
      renderer: renderer.get(),
      uniforms: {
        tPosition: { type: 't', value: 0 },
        tDefaultSize: { type: 't', value: 0 },

        mouse: { value: new THREE.Vector3(10000, 10000, 10000) },

        sizeRange: { type: 'f', value: this.sizeRange },
        incSize: { type: 'f', value: this.incSize },

        hoverDist: { type: 'f', value: this.hoverDist },
        hoverSizeInc: { type: 'f', value: this.hoverSizeInc },
        hoverMaxSizeMultiplier: { type: 'f', value: this.hoverMaxSizeMultiplier }
      },
      simulationVertexShader: sizeSimulationVertexShader,
      simulationFragmentShader: sizeSimulationFragmentShader
    })

    this.sizeFBO.setTextureUniform('tDefaultSize', this.getSizes())

    const uniforms = Object.assign({}, configUniforms, {
      tDefaultPosition: { type: 't', value: this.positionFBO.simulationShader.uniforms.tDefaultPosition.value },
      tText: { type: 't', value: 0 },
      tPosition: { type: 't', value: this.positionFBO.targets[0] },
      tSize: { type: 't', value: this.sizeFBO.targets[0] },
      textSizeMultiplier: { type: 'f', value: this.textSizeMultiplier },

      tColour: { type: 't',
        value: createDataTexture({
          data: this.getColours(),
          tWidth,
          tHeight,
          format: this.positionFBO.format,
          filterType: this.positionFBO.filterType
        }) }
    })

    this.material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      blending,
      transparent,
      depthTest,
      depthWrite
    })

    // set uv coords of particles in texture as positions
    const geometry = new THREE.Geometry()

    for (let i = 0; i < this.numParticles; i++) {
      const vertex = new THREE.Vector3()
      vertex.x = (i % tWidth) / tWidth
      vertex.y = Math.floor(i / tWidth) / tHeight
      geometry.vertices.push(vertex)
    }

    this.particles = new THREE.Points(geometry, this.material)
    this.particles.frustumCulled = false

    this.text = ''
    document.onkeydown = this.onTextInput.bind(this)

    window.addEventListener('resize', this.onWindowResize.bind(this))
    // document.addEventListener('touchmove', this.onMouseMove.bind(this), false);
    document.addEventListener('mousemove', this.onMouseMove.bind(this), false)
  }

  setAnimation () {
    this.animationFrames.forEach(animationFrame =>
      setTimeout(() => this.createCanvasAnimation(animationFrame), animationFrame.animationDelay || 0)
    )
  }

  onWindowResize () {
    this.windowHalfX = window.innerWidth / 2
    this.windowHalfY = window.innerHeight / 2
  }

  onMouseMove (event) {
    const xMultiplier = this.cameraZ / (this.windowHalfY * 2.8)
    const yMultiplier = this.cameraZ / (this.windowHalfY * 2.65)
    const mouseX = event.clientX - this.windowHalfX
    const mouseY = this.windowHalfY - event.clientY

    this.sizeFBO.simulationShader.uniforms.mouse.value.set(xMultiplier * mouseX, yMultiplier * mouseY, 0)
  }

  setTextTexture (textCanvas) {
    const textTexture = new THREE.Texture(textCanvas)
    textTexture.minFilter = textTexture.magFilter = THREE.NearestFilter
    textTexture.needsUpdate = true
    textTexture.flipY = true
    this.positionFBO.simulationShader.uniforms.tText.value = this.material.uniforms.tText.value = textTexture
  }

  onTextInput ({
    key = ''
  }) {
    const canvasDepth = 1
    const textCanvas = document.createElement('canvas')

    if (key !== 'Backspace' && (key.length !== 1 || !key.match(/[a-z ]?/i))) {
      return
    }

    this.text = key === 'Backspace' ? this.text.slice(0, -1) : this.text + key

    textCanvas.width = textCanvas.height = Math.sqrt(this.numParticles) * canvasDepth

    const canvasCenterV = textCanvas.height / 2
    const ctx = textCanvas.getContext('2d', {
      alpha: false
    })

    ctx.font = `80px bold serif`
    ctx.fillStyle = 'white'
    ctx.fillText(this.text, 0, canvasCenterV, textCanvas.width)

    this.setTextTexture(textCanvas)
  }

  getPositions () {
    const vertices = new Float32Array(this.numParticles * 4)
    for (let i = 0, i3 = 0, i4 = 0; i < this.numParticles; i++, i3 += 3, i4 += 4) {
      const vertice = this.calcPosition()

      this.positions[i3] = vertices[i4] = vertice[0]
      this.positions[i3 + 1] = vertices[i4 + 1] = vertice[1]
      this.positions[i3 + 2] = vertices[i4 + 2] = vertice[2]

      vertices[i4 + 3] = 0.0 // stores whether particle is representing text or not
    }
    return vertices
  }

  calcPosition () {
    const radius = this.radius
    const x = Math.random() - 0.5
    const y = Math.random() - 0.5
    const z = 0
    const d = Math.pow(Math.random(), 0.6) * radius * (1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)))

    return [
      x * d,
      y * d,
      z
    ]
  }

  getSizes () {
    const sizes = new Float32Array(this.numParticles * 4)
    for (let i = 0, i4 = 0; i < this.numParticles; i++, i4 += 4) {
      sizes[i4 + 3] = this.calcSize()
    }
    return sizes
  }

  calcSize () {
    const sizeRange = this.maxSize - this.minSize
    const size = this.minSize + (sizeRange * Math.pow(Math.random(), this.skew))

    return size
  }

  getColours () {
    const colours = new Float32Array(this.numParticles * 4)

    for (let i = 0, i4 = 0; i < this.numParticles; i++, i4 += 4) {
      const colour = this.calcColour()

      colours[i4] = colour[0]
      colours[i4 + 1] = colour[1]
      colours[i4 + 2] = colour[2]
      colours[i4 + 3] = colour[3]
    }

    return colours
  }

  calcColour () {
    const getColor = (r, g, b, a) => [r / 255, g / 255, b / 255, a]
    const randomVal = Math.ceil(Math.random() * 10)

    switch (randomVal) {
      case 1:
        return getColor(155, 176, 255, 1)

      case 2:
        return getColor(170, 191, 255, 1)

      case 3:
        return getColor(202, 215, 255, 1)

      case 4:
        return getColor(248, 247, 255, 1)

      case 5:
        return getColor(255, 244, 234, 1)

      case 6:
        return getColor(255, 210, 161, 1)

      case 7:
        return getColor(255, 204, 111, 1)

      default:
        return getColor(255, 255, 255, 1)
    }
  }

  update () {
    this.positionFBO.simulate()
    this.sizeFBO.simulate()
    this.sizeFBO.simulationShader.uniforms.tPosition.value = this.material.uniforms.tPosition.value = this.positionFBO.getCurrentFrame()
    this.material.uniforms.tSize.value = this.sizeFBO.getCurrentFrame()
  }

  get () {
    return this.particles
  }

  setCameraZ (newCameraZ) {
    this.cameraZ = newCameraZ
  }
}
