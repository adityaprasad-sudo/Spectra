import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {PMREMGenerator}from 'three';
import {RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

import { raycast } from './raycast.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(4, 2, 5); 

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.01;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

document.body.appendChild(renderer.domElement);
const licolor = new THREE.Color('#100f0f');
scene.background = licolor;
scene.fog = new THREE.Fog(licolor, 10, 40);
const oaderchig = new RGBELoader();
oaderchig.load('./HDR_041_Path_Env.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
});
const geo = new THREE.PlaneGeometry(100, 100);
const geomat = new THREE.ShadowMaterial({ opacity: 0.3});
const floor = new THREE.Mesh(geo, geomat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);
const shalight = new THREE.DirectionalLight(0xffffff, 0.005);
shalight.position.set(0, 5, 0);
shalight.castShadow = true;
shalight.shadow.mapSize.set(1024, 1024);
shalight.shadow.bias = -0.001;
shalight.shadow.radius = 20;
shalight.shadow.blurSamples = 50;
scene.add(shalight);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 




let carparts = []; 

const loader = new GLTFLoader();
loader.load('./rollsroycefinal.glb', (gltf) => {
    const carModel = gltf.scene;
    
    const doorRight = carModel.getObjectByName('doorrf');
    const doorLeft = carModel.getObjectByName('doorlb');
    const bonnet = carModel.getObjectByName('Object_302');
    const doorbackright = carModel.getObjectByName('doorrb');
    const doorfrontleft = carModel.getObjectByName('doorlf');
    const trunk = carModel.getObjectByName('Object_230');
    const enginecover = carModel.getObjectByName('Object_306');


    if (doorRight) {
        doorRight.userData = { isOpen: false, targetRotation: 0, axis: 'z' };
        carparts.push(doorRight);
    }
    if (doorLeft) {
        doorLeft.userData = { isOpen: false, targetRotation: 0, axis: 'z',  };
        carparts.push(doorLeft);
    }
    if (bonnet) {
        bonnet.userData = { isOpen: false, targetRotation: 0, axis: 'x', inverse: true }; 
        carparts.push(bonnet);
    }
    if (doorbackright) {
        doorbackright.userData = { isOpen: false, targetRotation: 0, axis: 'z', inverse: true };
        carparts.push(doorbackright);
    }
    if (doorfrontleft) {
        doorfrontleft.userData = { isOpen: false, targetRotation: 0, axis: 'z', inverse: true };
        carparts.push(doorfrontleft);
    }
    if (trunk) {
        trunk.userData = { isOpen: false, targetRotation: 0, axis: 'x', };
        carparts.push(trunk);
    }
    if (enginecover) {
        enginecover.userData = { isOpen: false, targetRotation: 0, axis: 'x', inverse: true };
        carparts.push(enginecover);
        
    }
        
    carModel.traverse((child) => {
       if(child.isMesh){
        child.castShadow = true;
        child.receiveShadow = true;
       } 
    });
    scene.add(carModel);
    
    raycast(camera, carparts);

}, undefined, (error) => console.error(error));

function animate() {
    requestAnimationFrame(animate);
    controls.update(); 

    carparts.forEach(part => {
        const axis = part.userData.axis; 
        let target = part.userData.targetRotation;

        if (part.userData.inverse) target = -target; 

        part.rotation[axis] = THREE.MathUtils.lerp(part.rotation[axis], target, 0.08);
    });

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});