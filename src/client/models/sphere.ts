import { SphereGeometry, MeshBasicMaterial, Mesh, Texture, Vector3 } from 'three'

class Sphere {
    initialScale: number
    scale: number

    mesh: Mesh
    constructor(map: Texture, radius = 1) {
        radius /= 1000
        this.initialScale = radius / 1000
        this.scale = this.initialScale

        const geometry = new SphereGeometry(1000, 32, 16)
        const material = new MeshBasicMaterial({
            map: map,
        })

        this.mesh = new Mesh(geometry, material)
        this.mesh.rotation.x = 90
        this.mesh.scale.set(this.initialScale, this.initialScale, this.initialScale)
    }

    update(dt: number) {
        // Update realism
        this.mesh.scale.set(this.scale, this.scale, this.scale)
    }
}

export default Sphere
