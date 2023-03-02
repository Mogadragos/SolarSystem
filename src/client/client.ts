import { AxesHelper, PerspectiveCamera, Scene, Texture, TextureLoader, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GUI } from 'dat.gui'

import MovingSphere from './models/movingSphere'
import Sphere from './models/sphere'

const loadTexture = (url: string) => {
    const loader = new TextureLoader()
    return new Promise<Texture>((resolve) =>
        loader.load(url, resolve, undefined, (err) => resolve(new Texture()))
    )
}

const remap = (x: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return ((x - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

const init = async () => {
    const scene = new Scene()

    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000)
    camera.position.z = 50000

    const renderer = new WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // GUI DATA and Tools
    const GUIData = {
        Realism: 1,
        Radius: 1,
        Distance: 1,
    }

    const remapDistance = (x: number, index: number, maxDistance: number) =>
        remap(x, 0, 1, 5000 * (index + 1), maxDistance)

    const remapScale = (x: number, maxScale: number) => remap(x, 0, 1, 1, maxScale)

    // Planets

    const uaToKm = (ua: number) => ua * 149597870.691

    console.log('Loading Sun')
    const Sun = new Sphere(await loadTexture(`assets/2k_sun.jpg`), 1391400 / 2)

    console.log('Loading Mercury')
    const Mercury = new MovingSphere(
        await loadTexture(`assets/2k_mercury.jpg`),
        4879 / 2,
        uaToKm(0.39)
    )

    console.log('Loading Venus')
    const Venus = new MovingSphere(
        await loadTexture(`assets/2k_venus_atmosphere.jpg`),
        12104 / 2,
        uaToKm(0.72)
    )

    console.log('Loading Earth')
    const Earth = new MovingSphere(
        await loadTexture(`assets/2k_earth_daymap.jpg`),
        12756 / 2,
        uaToKm(1)
    )

    console.log('Loading Mars')
    const Mars = new MovingSphere(await loadTexture(`assets/2k_mars.jpg`), 6792 / 2, uaToKm(1.52))

    console.log('Loading Jupiter')
    const Jupiter = new MovingSphere(
        await loadTexture(`assets/2k_jupiter.jpg`),
        142984 / 2,
        uaToKm(5.2)
    )

    console.log('Loading Saturn')
    const Saturn = new MovingSphere(
        await loadTexture(`assets/2k_saturn.jpg`),
        120536 / 2,
        uaToKm(9.54)
    )

    console.log('Loading Uranus')
    const Uranus = new MovingSphere(
        await loadTexture(`assets/2k_uranus.jpg`),
        51118 / 2,
        uaToKm(19.2)
    )

    console.log('Loading Neptune')
    const Neptune = new MovingSphere(
        await loadTexture(`assets/2k_neptune.jpg`),
        49528 / 2,
        uaToKm(30.06)
    )

    console.log('Planets Loaded !')

    scene.add(Sun.mesh)
    scene.add(Mercury.mesh)
    scene.add(Venus.mesh)
    scene.add(Earth.mesh)
    scene.add(Mars.mesh)
    scene.add(Jupiter.mesh)
    scene.add(Saturn.mesh)
    scene.add(Uranus.mesh)
    scene.add(Neptune.mesh)

    const planets = [Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune]

    // Add Controls
    const controls = new OrbitControls(camera, renderer.domElement)

    // Display Axis
    const axesHelper = new AxesHelper(50)
    scene.add(axesHelper)

    // Add GUI
    const gui = new GUI()
    const parametersFolder = gui.addFolder('Paramètres')
    const realismController = parametersFolder.add(GUIData, 'Realism', 0, 1)
    const realismFolder = gui.addFolder('Réalisme')
    const radiusController = realismFolder.add(GUIData, 'Radius', 0, 1)
    radiusController.onChange((value) => {
        Sun.scale = remapScale(value, Sun.initialScale)
        planets.forEach((planet) => {
            planet.scale = remapScale(value, planet.initialScale)
        })
    })
    const distanceController = realismFolder.add(GUIData, 'Distance', 0, 1)
    distanceController.onChange((value) =>
        planets.forEach((planet, index) => {
            planet.distanceToSun = remapDistance(value, index, planet.initialDistanceToSun)
        })
    )
    realismController.onChange((value) => {
        radiusController.setValue(value)
        distanceController.setValue(value)
    })
    parametersFolder.open()

    // Handle screen resizing
    window.addEventListener('resize', onWindowResize, false)
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        render()
    }

    let prevTime = 0

    function animate(currentTime: number) {
        const dt = (currentTime - prevTime) / 1000
        prevTime = currentTime

        controls.update()

        Sun.update(dt)
        planets.forEach((planet) => planet.update(dt))

        render()

        requestAnimationFrame(animate)
    }

    function render() {
        renderer.render(scene, camera)
    }
    animate(0)
}

init()
