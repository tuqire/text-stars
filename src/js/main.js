import isWebglEnabled from 'detector-webgl'
import Stats from 'stats.js'
import Camera from './io/camera'
import Controls from './io/controls'
import Renderer from './io/renderer'
import Scene from './objects/scene'
import Particles from './objects/particles'

document.addEventListener('DOMContentLoaded', () => {
  if (isWebglEnabled) {
    const container = document.getElementById('stars-simulation-container')
    const renderer = new Renderer({ container })
    const scene = new Scene()
    const particles = new Particles({
      renderer,
      numParticles: window.matchMedia('(max-width: 480px)').matches ? 40000 : 120000,
      radius: 4,
      minSize: 0.015,
      maxSize: 0.03,
      sizeRange: 0.003,
      sizeInc: 0.00005,
      skew: 35,
      hoverDist: 0.04,
      hoverSizeInc: 0.002,
      hoverMaxSizeMultiplier: 1.7,
      font: 'arial',
      fontSize: 80,
      topSpeed: 1,
      acceleration: 0.0001,
      textAlign: 'left',
      textSizeMultiplier: 600,
      textPositionMultiplier: 5.5,
      brightness: 0.9,
      opacity: 1
    })
    const camera = new Camera({
      particles,
      position: {
        x: 0,
        y: -0.001,
        z: 4.5
      }
    })
    const stats = new Stats()

    const init = () => {
      new Controls({ particles }) // eslint-disable-line

      stats.showPanel(0)
      document.body.appendChild(stats.dom)

      scene.add(particles.get())
    }

    const animate = () => {
      requestAnimationFrame(animate) // eslint-disable-line
      render()
    }

    const render = () => {
      stats.begin()

      particles.update()

      renderer.render({
        scene: scene.get(),
        camera: camera.get()
      })

      stats.end()
    }

    init()
    animate()
  } else {
    const info = document.getElementById('info')
    info.innerHTML = 'Your browser is not supported. Please use the latest version of Firefox or Chrome.'
  }
})
