import { AxesHelper, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GUI } from 'dat.gui'

import { loadTexture } from './utils/threeUtils'
import { remap } from './utils/utils'

import Planet from './models/planet'
import Sphere from './models/sphere'

const init = async () => {
    const scene = new Scene()

    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 150000)
    camera.position.z = 50000

    const renderer = new WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // GUI DATA and Tools
    const GUIData = {
        Realism: 1,
        Radius: 1,
        Distance: 1,
        Speed: 3600,
    }

    const remapDistance = (x: number, index: number, maxDistance: number) =>
        remap(x, 0, 1, 5000 * (index + 1), maxDistance)

    const remapScale = (x: number, maxScale: number) => remap(x, 0, 1, 1, maxScale)

    // Planets

    const uaToKm = (ua: number) => ua * 149597870.691

    console.log('Loading Sun')
    const Sun = new Sphere(await loadTexture(`assets/2k_sun.jpg`), 1391400 / 2)

    console.log('Loading Mercury')
    const Mercury = new Planet(
        await loadTexture(`assets/2k_mercury.jpg`),
        4879 / 2,
        uaToKm(0.39),
        3.302e23
    )

    console.log('Loading Venus')
    const Venus = new Planet(
        await loadTexture(`assets/2k_venus_atmosphere.jpg`),
        12104 / 2,
        uaToKm(0.72),
        4.8685e24
    )

    console.log('Loading Earth')
    const Earth = new Planet(
        await loadTexture(`assets/2k_earth_daymap.jpg`),
        12756 / 2,
        uaToKm(1),
        5.9742e24
    )

    console.log('Loading Mars')
    const Mars = new Planet(
        await loadTexture(`assets/2k_mars.jpg`),
        6792 / 2,
        uaToKm(1.52),
        6.4185e23
    )

    console.log('Loading Jupiter')
    const Jupiter = new Planet(
        await loadTexture(`assets/2k_jupiter.jpg`),
        142984 / 2,
        uaToKm(5.2),
        1.899e27
    )

    console.log('Loading Saturn')
    const Saturn = new Planet(
        await loadTexture(`assets/2k_saturn.jpg`),
        120536 / 2,
        uaToKm(9.54),
        5.6846e26
    )

    console.log('Loading Uranus')
    const Uranus = new Planet(
        await loadTexture(`assets/2k_uranus.jpg`),
        51118 / 2,
        uaToKm(19.2),
        8.6832e25
    )

    console.log('Loading Neptune')
    const Neptune = new Planet(
        await loadTexture(`assets/2k_neptune.jpg`),
        49528 / 2,
        uaToKm(30.06),
        1.0243e26
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

    scene.add(Mercury.ellipse)
    scene.add(Venus.ellipse)
    scene.add(Earth.ellipse)
    scene.add(Mars.ellipse)
    scene.add(Jupiter.ellipse)
    scene.add(Saturn.ellipse)
    scene.add(Uranus.ellipse)
    scene.add(Neptune.ellipse)

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
    parametersFolder.add(GUIData, 'Speed', 0)
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
        const dt = (GUIData.Speed * (currentTime - prevTime)) / 1000
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
