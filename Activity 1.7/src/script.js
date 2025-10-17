import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Create an empty BufferGeometry
const geometry = new THREE.BufferGeometry()
// Create 50 triangles (450 values)
const count = 50
const positionsArray = new Float32Array(count * 3 * 3)
for(let i = 0; i < count * 9 * 9; i++)
{
positionsArray[i] = (Math.random() - 0.1) * 5
}
// Create the attribute and name it 'position'
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)

const triangleMaterial = new THREE.MeshBasicMaterial({ color: 0xffadd8e6, wireframe: true })
const triangleMesh = new THREE.Mesh(geometry, triangleMaterial)
scene.add(triangleMesh)

triangleMesh.position.set(0,.5,-3)
// ===== Cone Geometry =====
const coneGeometry = new THREE.ConeGeometry(1, 1, 32) // radius, height, radial segments
const coneMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial)

coneMesh.position.x = 2
scene.add(coneMesh)

// ===== Sizes =====
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// ===== Camera =====
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// ===== Controls =====
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// ===== Renderer =====
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// ===== Animation Loop =====
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Optional: make the cone rotate slowly
    coneMesh.rotation.y = elapsedTime

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
