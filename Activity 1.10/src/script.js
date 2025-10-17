import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Debug GUI
 */
const gui = new dat.GUI()

/**
 * Base
 */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const earthTexture = textureLoader.load('/textures/door/earth.jpg')
const marsTexture = textureLoader.load('/textures/door/mars.jpg')
const venusTexture = textureLoader.load('/textures/door/venus.jpg')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

/**
 * Materials
 */
const earthMaterial = new THREE.MeshToonMaterial({
    map: earthTexture,
    color: 0xffffff,
    gradientMap: gradientTexture
})

const marsMaterial = new THREE.MeshToonMaterial({
    map: marsTexture,
    color: 0xffffff,
    gradientMap: gradientTexture
})

const venusMaterial = new THREE.MeshToonMaterial({
    map: venusTexture,
    color: 0xffffff,
    gradientMap: gradientTexture
})

/**
 * GUI Controls
 */
const addToonControls = (folderName, material) => {
    const folder = gui.addFolder(folderName)
    folder.addColor({ color: '#ffffff' }, 'color').name('Color Tint').onChange(value => {
        material.color.set(value)
    })
    folder.add(material, 'wireframe')
    folder.add(material, 'opacity').min(0).max(1).step(0.01).onChange(v => {
        material.transparent = v < 1
    })
}

addToonControls('Earth', earthMaterial)
addToonControls('Mars', marsMaterial)
addToonControls('Venus', venusMaterial)

/**
 * Objects
 */
const sphere1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), earthMaterial)
sphere1.position.x = -1.5

const sphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), marsMaterial)

const sphere3 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), venusMaterial)
sphere3.position.x = 1.5

scene.add(sphere1, sphere2, sphere3)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
directionalLight.position.set(2, 3, 4)
scene.add(directionalLight)

/**
 * Camera
 */
const sizes = { width: window.innerWidth, height: window.innerHeight }
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 2)
scene.add(camera)

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Rotate all spheres
    for (const mesh of [sphere1, sphere2, sphere3]) {
        mesh.rotation.y = elapsedTime * 1.5
        mesh.rotation.x = elapsedTime * 2.3
    }

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
