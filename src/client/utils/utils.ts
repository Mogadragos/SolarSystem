const remap = (x: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return ((x - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

const G = 6.67428e-11

const orbitalSpeed = (mass: number, distance: number) => Math.sqrt((G * mass) / distance)

const orbitalSpeedSun = (distanceInKm: number) => orbitalSpeed(1.9891e30, distanceInKm * 1000)

export { remap, orbitalSpeedSun }
