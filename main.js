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
document.body.appendChild(renderer.domElement);
RectAreaLightUniformsLib.init();

const rectangle = new THREE.RectAreaLight(0xffffff, 5, 15, 15);

rectangle.position.set(0, 15, 0);
rectangle.lookAt(0, 0, 0);
scene.add(rectangle);
const fill = new THREE.AmbientLight(0xffffff, 0.2);
const hdri = new RGBELoader();
hdri.load('./HDR_041_Path_Env.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
   
});
const fllr = new THREE.PlaneGeometry(50,50);
const fllrMaterial = new THREE.MeshStandardMaterial({color: 0x111111, roughness: 0.5, metalness: 0.2});
const fllrMesh = new THREE.Mesh(fllr, fllrMaterial);
fllrMesh.rotation.x = -Math.PI / 2;
fllrMesh.position.y = -0.01;
scene.add(fllrMesh);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 


const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);


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
    if(bonnet){
        bonnet.traverse((child) => {
            if(child.isMesh && child.material && child.material.color){
                fllrMesh.material.color.copy(child.material.color);
                fllrMesh.material.color.multiplyScalar(0.5);
            }
        });
    }
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