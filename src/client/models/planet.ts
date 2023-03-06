import { BufferGeometry, EllipseCurve, Line, LineBasicMaterial, Texture } from 'three'
import { rotateAroundPoint, VECTOR3 } from '../utils/threeUtils'
import { orbitalSpeedSun } from '../utils/utils'
import Sphere from './sphere'

class Planet extends Sphere {
    initialDistanceToSun: number
    distanceToSun: number
    speed: number
    mass: number

    ellipse: Line
    constructor(map: Texture, radius: number, distanceToSun: number, mass: number) {
        super(map, radius)

        // Calculate orbital speed
        this.speed = orbitalSpeedSun(distanceToSun) / distanceToSun

        // Initiate values
        distanceToSun /= 100000

        this.initialDistanceToSun = distanceToSun
        this.distanceToSun = distanceToSun
        this.mesh.position.x = distanceToSun

        this.mass = mass // Will be used if satellites

        // Add curve
        const curve = new EllipseCurve(
            0,
            0,
            distanceToSun,
            distanceToSun,
            -Math.PI / 4,
            0,
            false,
            0
        )
        const points = curve.getPoints(50)
        const geometry = new BufferGeometry().setFromPoints(points)
        const material = new LineBasicMaterial({ color: 0xa9a9a9 })

        this.ellipse = new Line(geometry, material)
    }

    update(dt: number) {
        super.update(dt)

        // Rotate
        rotateAroundPoint(this.mesh, VECTOR3.ZERO, VECTOR3.UP, dt * this.speed)
        this.ellipse.rotateOnAxis(VECTOR3.UP, dt * this.speed)

        // Update realism
        this.mesh.position.copy(this.mesh.position.normalize().multiplyScalar(this.distanceToSun))
        const scale = this.distanceToSun / this.initialDistanceToSun
        this.ellipse.scale.set(scale, scale, scale)
    }
}

export default Planet
