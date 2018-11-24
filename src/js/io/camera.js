import { getZRatio } from '../utils'

export default class Camera {
  constructor ({
    particles,
    fov = 400,
    aspectRatio = window.innerWidth / window.innerHeight,
    near = 0.1,
    far = 2000,
    position = {
      x: 0, y: 0, z: 0
    },
    up = [0, 0, 1]
  }) {
    this.particles = particles
    this.particles.setCameraZ(position.z)
    this.camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far)
    this.up = up

    this.setPosition(position)
    this.setUp(...this.up)
    this.setLookAt()
  }

  onWindowResize () {
    const WIDTH = window.innerWidth
    const HEIGHT = window.innerHeight

    this.camera.aspect = WIDTH / HEIGHT
    this.setZ(window.innerHeight / getZRatio())
    this.camera.updateProjectionMatrix()
  }

  setUp (x, y, z) {
    this.camera.up.set(x, y, z)
  }

  setPosition ({
    x = this.camera.position.x,
    y = this.camera.position.y,
    z = this.camera.position.z
  }) {
    this.setX(x)
    this.setY(y)
    this.setZ(z)
  }

  setX (x) {
    this.camera.position.x = x
    this.setLookAt()
  }

  setY (y) {
    this.camera.position.y = y
    this.setLookAt()
  }

  setZ (z) {
    this.camera.position.z = z
    this.setLookAt()
    this.setUp(0, 0, 1)
    this.particles.setCameraZ(z)
  }

  setLookAt () {
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))
  }

  get () {
    return this.camera
  }

  getPosition () {
    return this.camera.position
  }

  getZ () {
    return this.camera.position.z
  }
}
