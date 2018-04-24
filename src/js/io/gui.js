import DatGUI from 'dat-gui'
import { fonts } from '../constants'

export default class GUI {
  constructor ({
    particles,
    scene
  } = {}) {
    this.gui = new DatGUI.GUI()

    this.addBgControls(particles)
    this.addTextControls(particles)
    this.addMouseControls(particles)
    this.addSizeControls(particles)
    this.addColourStrengthControls(particles)
    this.addOpacityControls(particles)
  }

  addBgControls (particles) {
    this.gui
      .addColor(particles, 'bgColorTop')

    this.gui
      .addColor(particles, 'bgColorBottom')
  }

  addTextControls (particles) {
    this.gui
      .add(particles, 'font', Object.keys(fonts))
      .onFinishChange(() => {
        particles.updateTextTexture()
      })

    this.gui
      .add(particles, 'fontSize')
      .min(10)
      .max(200)
      .step(5)
      .onFinishChange(() => {
        particles.updateTextTexture()
      })

    this.gui
      .add(particles, 'textAlign', ['left', 'center'])
      .onFinishChange(() => {
        particles.updateTextTexture()
      })

    this.gui
      .add(particles, 'textSizeMultiplier')
      .min(1)
      .max(1000)
      .step(10)
      .onFinishChange(() => {
        particles.updateParticleVars()
      })

    this.gui
      .add(particles, 'topSpeed')
      .min(0.1)
      .max(10)
      .step(0.1)
      .onFinishChange(() => {
        particles.updateParticleVars()
      })

    this.gui
      .add(particles, 'acceleration')
      .min(0.00001)
      .max(0.01)
      .step(0.00001)
      .onFinishChange(() => {
        particles.updateParticleVars()
      })
  }

  addMouseControls (particles) {
    this.gui
      .add(particles, 'hoverDist')
      .min(0)
      .max(0.5)
      .step(0.01)
      .onFinishChange(() => {
        particles.updateParticleVars()
      })

    this.gui
      .add(particles, 'hoverSizeInc')
      .min(0)
      .max(0.03)
      .step(0.001)
      .onFinishChange(() => {
        particles.updateParticleVars()
      })

    this.gui
      .add(particles, 'hoverMaxSizeMultiplier')
      .min(1)
      .max(3)
      .step(0.05)
      .onFinishChange(() => {
        particles.updateParticleVars()
      })
  }

  addSizeControls (particles) {
    this.gui
      .add(particles, 'minSize')
      .min(0.01)
      .max(0.04)
      .step(0.001)
      .onFinishChange(() => {
        if (particles.minSize > particles.maxSize) {
          particles.minSize = particles.maxSize
        }

        particles.updateSizes()
      })

    this.gui
      .add(particles, 'maxSize')
      .min(0.01)
      .max(0.04)
      .step(0.001)
      .onFinishChange(() => {
        if (particles.maxSize < particles.minSize) {
          particles.maxSize = particles.minSize
        }

        particles.updateSizes()
      })

    this.gui
      .add(particles, 'sizeInc')
      .min(0.00001)
      .max(0.0002)
      .step(0.00001)
      .onFinishChange(() => {
        particles.updateSizes()
      })

    this.gui
      .add(particles, 'sizeRange')
      .min(0)
      .max(0.02)
      .step(0.0005)
      .onFinishChange(() => {
        particles.updateSizes()
      })

    this.gui
      .add(particles, 'skew')
      .min(1)
      .max(100)
      .step(1)
      .onFinishChange(() => {
        particles.updateSizes()
      })
  }

  addColourStrengthControls (particles) {
    this.gui
      .add(particles, 'brightness')
      .min(0.1)
      .max(3)
      .step(0.05)
      .onFinishChange(() => {
        particles.updateColours()
      })
  }

  addOpacityControls (particles) {
    this.gui
      .add(particles, 'opacity')
      .min(0.1)
      .max(1.5)
      .step(0.05)
      .onFinishChange(() => {
        particles.updateColours()
      })
  }
}
