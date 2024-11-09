import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";

// initialize pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

// add textureLoader

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath('/textures/cubeMap/')


// add textures

const sunTexture = textureLoader.load('/textures/2k_sun.jpg')
const mercuryTexture = textureLoader.load('/textures/2k_mercury.jpg');
const venusTexture = textureLoader.load('/textures/2k_venus_surface.jpg');
const earthTexture = textureLoader.load('/textures/2k_earth_daymap.jpg');
const marsTexture = textureLoader.load('/textures/2k_mars.jpg');
const moonTexture = textureLoader.load('/textures/2k_moon.jpg');

const backgroundCubeMape = cubeTextureLoader.load( [
				'px.png',
				'nx.png',
				'py.png',
				'ny.png',
				'pz.png',
				'nz.png'
			] )

      scene.background = backgroundCubeMape

// add Materials 
const mercuryMaterial = new THREE.MeshStandardMaterial( { map: mercuryTexture } ); 
const venusMaterial = new THREE.MeshBasicMaterial( { map: venusTexture } ); 
const earthMaterial = new THREE.MeshBasicMaterial( { map: earthTexture } ); 
const marsMaterial = new THREE.MeshBasicMaterial( { map: marsTexture } ); 
const moonMaterial = new THREE.MeshBasicMaterial( { map: moonTexture } ); 


const sphereGeometry = new THREE.SphereGeometry(1, 32 ,32);

const sunMaterial = new THREE.MeshBasicMaterial( { map: sunTexture } ); 
const sun = new THREE.Mesh( sphereGeometry, sunMaterial ); 

sun.scale.setScalar(7)

scene.add( sun );

const planets = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 20,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: "Venus",
    radius: 1,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [],
  },
  {
    name: "Earth",
    radius: 3,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [
      {
        name: "Moon",
        radius: 0.4,
        distance: 3,
        speed: 0.015,
      },
    ],
  },
  {
    name: "Mars",
    radius: 1,
    distance: 25,
    speed: 0.003,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.4,
        distance: 2,
        speed: 0.02,
      },
      {
        name: "Deimos",
        radius: 0.6,
        distance: 3,
        speed: 0.015,
        color: 0xffffff,
      },
    ],
  },
  {
    name: "ThiziriBouaziz",
    radius: 1.5,
    distance: 25,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
];

const planetMeshes = planets.map((planet) =>{
   // create the Mesh
     const planetMesh = new THREE.Mesh( sphereGeometry, planet.material )
     planetMesh.scale.setScalar(planet.radius)
     planetMesh.position.x = planet.distance
  //  add the Mesh to the scene
      scene.add(planetMesh)
  //  Loop through each moon and create the moon 
      planet.moons.forEach((moon) => {
        const moonMesh = new THREE.Mesh( sphereGeometry, moonMaterial)
        moonMesh.scale.setScalar(moon.radius)
        moonMesh.position.x = moon.distance 
        planetMesh.add(moonMesh)
      });
       return planetMesh
});

// add the light
  const ambientLight = new THREE.AmbientLight( 0xffffff, 0.001);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.001)
  scene.add(pointLight)


// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);
camera.position.z = 100;
camera.position.y = 5;

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 200;
controls.minDistance = 20

// add resize listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// render loop
const renderloop = () => {
  // add animation 
    planetMeshes.forEach((planet, planetIndex) =>{
    planet.rotation.y += planets[planetIndex].speed
    planet.position.x = Math.sin(planet.rotation.y) * planets[planetIndex].distance
    planet.position.z = Math.cos(planet.rotation.y) * planets[planetIndex].distance
    planet.children.forEach((moon, moonIndex) =>{
    moon.rotation.y += planets[planetIndex].moons[moonIndex].speed
    moon.position.x = Math.sin( moon.rotation.y) * planets[planetIndex].moons[moonIndex].distance
    moon.position.z = Math.cos( moon.rotation.y) * planets[planetIndex].moons[moonIndex].distance
    })
   });




  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};


renderloop();
