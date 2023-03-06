import { Object3D, Texture, TextureLoader, Vector3 } from 'three'

const loadTexture = (url: string) => {
    const loader = new TextureLoader()
    return new Promise<Texture>((resolve) =>
        loader.load(url, resolve, undefined, (err) => resolve(new Texture()))
    )
}

const rotateAroundPoint = (mesh: Object3D, point: Vector3, axis: Vector3, theta: number) => {
    mesh.position.sub(point) // remove the offset
    mesh.position.applyAxisAngle(axis, theta) // rotate the POSITION
    mesh.position.add(point) // re-add the offset
}

const VECTOR3 = {
    ZERO: new Vector3(0, 0, 0),
    UP: new Vector3(0, 0, 1),
}

export { loadTexture, rotateAroundPoint, VECTOR3 }
