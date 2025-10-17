import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Texture Loader
 */
const textureLoader = new THREE.TextureLoader()

// Load matcap textures
const matcapTextures = [
    textureLoader.load('/textures/matcaps/1.png'),
    textureLoader.load('/textures/matcaps/2.png'),
    textureLoader.load('/textures/matcaps/3.png'),
    textureLoader.load('/textures/matcaps/4.png'),
    textureLoader.load('/textures/matcaps/5.png'),
    textureLoader.load('/textures/matcaps/6.png'),
    textureLoader.load('/textures/matcaps/7.png'),
    textureLoader.load('/textures/matcaps/8.png')
]

/**
 * Create animated green spheres
 */
const sphereGroup = new THREE.Group()
const sphereCount = 20

for (let i = 0; i < sphereCount; i++) {
    const sphereGeometry = new THREE.SphereGeometry(0.4, 32, 32)
    const sphereMaterial = new THREE.MeshMatcapMaterial({
        matcap: matcapTextures[Math.floor(Math.random() * matcapTextures.length)],
        color: 0x00ff88 // green
    })
    
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    
    sphere.position.x = (Math.random() - 0.5) * 25
    sphere.position.y = (Math.random() - 0.5) * 25
    sphere.position.z = (Math.random() - 0.5) * 25
    
    sphere.rotation.x = Math.random() * Math.PI
    sphere.rotation.y = Math.random() * Math.PI
    
    const scale = 0.5 + Math.random() * 1.5
    sphere.scale.set(scale, scale, scale)
    
    sphere.userData = {
        originalX: sphere.position.x,
        originalY: sphere.position.y,
        originalZ: sphere.position.z,
        rotationSpeedX: (Math.random() - 0.5) * 0.02,
        rotationSpeedY: (Math.random() - 0.5) * 0.02,
        rotationSpeedZ: (Math.random() - 0.5) * 0.02,
        floatSpeed: Math.random() * 0.01 + 0.005,
        floatAmplitude: Math.random() * 2 + 1
    }
    
    sphereGroup.add(sphere)
}

scene.add(sphereGroup)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

const pointLight1 = new THREE.PointLight(0x00ff88, 1.0, 15)
pointLight1.position.set(-5, 3, 5)
scene.add(pointLight1)

const pointLight2 = new THREE.PointLight(0x4ecdc4, 1.0, 15)
pointLight2.position.set(5, -3, -5)
scene.add(pointLight2)

const pointLight3 = new THREE.PointLight(0xf9ca24, 0.8, 12)
pointLight3.position.set(0, 5, 0)
scene.add(pointLight3)

/**
 * Font Loading and Text
 */
const fontLoader = new FontLoader()
const fontSources = [
    'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
    'https://cdn.jsdelivr.net/npm/three@0.150.0/examples/fonts/helvetiker_regular.typeface.json',
    'https://unpkg.com/three@0.150.0/examples/fonts/helvetiker_regular.typeface.json'
]

let currentFontIndex = 0

const tryLoadFont = () => {
    if (currentFontIndex >= fontSources.length) {
        console.log('All font sources failed, using fallback')
        createFallbackText()
        return
    }

    fontLoader.load(
        fontSources[currentFontIndex],
        (font) => {
            console.log('Font loaded successfully!')
            createFontText(font)
        },
        undefined,
        (error) => {
            console.log(`Font source ${currentFontIndex + 1} failed:`, error)
            currentFontIndex++
            tryLoadFont()
        }
    )
}

const createFontText = (font) => {
    const textGeometry = new TextGeometry("I'M BLOOMING", { 
        font: font,
        size: 0.4, 
        height: 0.1, 
        curveSegments: 12,
        bevelEnabled: false
    })
    
    textGeometry.computeBoundingBox()
    textGeometry.translate(
        -textGeometry.boundingBox.max.x * 0.5,
        -textGeometry.boundingBox.max.y * 0.5,
        -textGeometry.boundingBox.max.z * 0.5
    )
    
    const textMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ff88,
        metalness: 0.1,
        roughness: 0.0,
        transmission: 0.8,
        thickness: 0.5,
        ior: 1.4,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        envMapIntensity: 2.0,
        transparent: true,
        opacity: 0.9
    })

    const text = new THREE.Mesh(textGeometry, textMaterial)
    text.position.set(0, 0, 0)
    text.scale.setScalar(3)
    scene.add(text)
    
    const textFolder = gui.addFolder('Text Adjustment')
    textFolder.add(text.position, 'x', -5, 5, 0.1)
    textFolder.add(text.position, 'y', 0, 6, 0.1)
    textFolder.add(text.position, 'z', -5, 5, 0.1)
    textFolder.add(text.rotation, 'x', 0, Math.PI * 2, 0.01)
    textFolder.add(text.scale, 'x', 0.5, 2, 0.1)
    textFolder.add(text.scale, 'y', 0.5, 2, 0.1)
    textFolder.add(text.scale, 'z', 0.5, 2, 0.1)
    
    window.textMesh = text
    createBubbles()
}

const createFallbackText = () => {
    const fallbackGeometry = new THREE.BoxGeometry(1, 0.5, 0.1)
    const fallbackMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff88 })
    const fallbackMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial)
    scene.add(fallbackMesh)
    window.textMesh = fallbackMesh
}

const createBubbles = () => {
    const bubbleCount = 20
    const bubbleGeometry = new THREE.SphereGeometry(0.05, 8, 6)
    const bubbleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.0,
        roughness: 0.0,
        transmission: 0.9,
        thickness: 0.1,
        ior: 1.33,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        transparent: true,
        opacity: 0.6
    })
    
    const bubbleGroup = new THREE.Group()
    scene.add(bubbleGroup)
    
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial.clone())
        const radius = 2 + Math.random() * 3
        const angle = (i / bubbleCount) * Math.PI * 2
        bubble.position.set(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 4,
            Math.sin(angle) * radius
        )
        
        bubble.scale.setScalar(0.5 + Math.random() * 1.5)
        
        bubble.userData = {
            originalY: bubble.position.y,
            floatSpeed: 0.5 + Math.random() * 1,
            floatAmplitude: 0.3 + Math.random() * 0.5,
            rotationSpeed: (Math.random() - 0.5) * 0.02
        }
        
        bubbleGroup.add(bubble)
    }
    
    window.bubbleGroup = bubbleGroup
}

tryLoadFont()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 3)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()


    sphereGroup.rotation.y = elapsedTime * 0.05
    sphereGroup.children.forEach((sphere, index) => {
        const data = sphere.userData
        sphere.rotation.x += data.rotationSpeedX
        sphere.rotation.y += data.rotationSpeedY
        sphere.rotation.z += data.rotationSpeedZ
        sphere.position.y = data.originalY + Math.sin(elapsedTime * data.floatSpeed + index) * data.floatAmplitude
        sphere.position.x = data.originalX + Math.sin(elapsedTime * 0.01 + index) * 0.5
        sphere.position.z = data.originalZ + Math.cos(elapsedTime * 0.01 + index) * 0.5
    })


    if (window.textMesh) {
        window.textMesh.rotation.x = elapsedTime * 0.3
        window.textMesh.position.y = Math.sin(elapsedTime * 1.2) * 0.5
        window.textMesh.scale.setScalar(3 + Math.sin(elapsedTime * 0.5) * 0.2)
    }


    if (window.bubbleGroup) {
        window.bubbleGroup.children.forEach((bubble, index) => {
            bubble.position.y = bubble.userData.originalY + 
                Math.sin(elapsedTime * bubble.userData.floatSpeed + index) * bubble.userData.floatAmplitude
            bubble.rotation.x += bubble.userData.rotationSpeed
            bubble.rotation.y += bubble.userData.rotationSpeed * 0.7
            bubble.rotation.z += bubble.userData.rotationSpeed * 0.3
        })
    }

    pointLight1.position.x = -5 + Math.sin(elapsedTime * 0.4) * 2
    pointLight1.position.z = 5 + Math.cos(elapsedTime * 0.4) * 2

    pointLight2.position.x = 5 + Math.sin(elapsedTime * 0.3) * 1.5
    pointLight2.position.z = -5 + Math.cos(elapsedTime * 0.3) * 1.5

    pointLight3.position.y = 5 + Math.sin(elapsedTime * 0.6) * 1

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
