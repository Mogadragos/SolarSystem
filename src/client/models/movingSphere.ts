import { Texture } from 'three'
import Sphere from './sphere'

class MovingSphere extends Sphere {
    initialDistanceToSun: number
    distanceToSun: number
    constructor(map: Texture, radius: number, distanceToSun: number) {
        super(map, radius)

        distanceToSun /= 100000

        this.initialDistanceToSun = distanceToSun
        this.distanceToSun = distanceToSun
        this.mesh.position.x = distanceToSun
    }

    update(dt: number) {
        super.update(dt)

        this.mesh.position.x = this.distanceToSun
    }
}

export default MovingSphere
