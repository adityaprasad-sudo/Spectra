import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {PMREMGenerator}from 'three';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { GroundProjectedSkybox } from 'three/addons/objects/GroundProjectedSkybox.js';
import { updateraycaster } from './raycast.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import { aston } from './Am.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 200);
camera.position.set(4, 2, 5); 
const dome = new THREE.PointLight(0xffffff, 0);
dome.distance = 2;
camera.add(dome);
scene.add(camera);
const btnmenu = document.getElementById('btnmenu');
const modeldrawer = document.getElementById('modeldrawer');
const loading = document.getElementById('loadingscreen');
const progressbar = document.getElementById('progbar')
const manager = new THREE.LoadingManager();
manager.onProgress = function (url, loaded, total) {
    const progress = (loaded / total) * 100;
    progressbar.style.width = progress + '%';
}
manager.onLoad = function () {
    setTimeout(() => {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 800)
    }, 500)
}
const draloader = new DRACOLoader(manager);
draloader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
const loader = new GLTFLoader(manager);
loader.setDRACOLoader(draloader);
const oaderchig= new EXRLoader(manager);
oaderchig.load('./1234.exr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.environmentIntensity = 1.2;
})
btnmenu.addEventListener('click', () => {
    modeldrawer.classList.toggle('open');
})


let isintview = false

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

let lightmode = 0;
let lbmesh = [];
let rbmesh = [];
let hbmesh = [];
let tlmesh = [];
const leftbeam = new THREE.SpotLight(0xffffff,0)
const rightbeam = new THREE.SpotLight(0xffffff,0)
const leftbeam2 = new THREE.SpotLight(0xffffff,0)
const rightbeam2 = new THREE.SpotLight(0xffffff,0)
const groundlightl = new THREE.PointLight(0xffffff, 0, 5)
const groundlightr = new THREE.PointLight(0xffffff, 0, 5)
const groundtail = new THREE.PointLight(0xffffff, 0, 5)
groundlightl.castShadow = false
groundlightr.castShadow = false
groundtail.castShadow = false
leftbeam.castShadow = false;
rightbeam.castShadow = false
leftbeam2.castShadow = false
rightbeam2.castShadow = false
leftbeam.penumbra = 0.5;
rightbeam.penumbra = 0.5
leftbeam2.penumbra = 0.5
rightbeam2.penumbra = 0.5;
let leftdrlmesh = []
let rightdrlmesh = [];
let drlstripmesh = []

renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.7
const bg = new THREE.Color('#1b1b1b')
scene.background = bg
scene.fog = new THREE.Fog(bg, 1, 30);
const geo = new THREE.PlaneGeometry(100, 100);
const mat = new THREE.MeshLambertMaterial({ color: bg})
const floor = new THREE.Mesh(geo, mat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);
const ambientLight = new THREE.AmbientLight(0xffffff, 1); 

let ectasy = null;
let covermesh = null;
let ectasyup = false;
const listen = new THREE.AudioListener();
camera.add(listen);
const enginesound = new THREE.PositionalAudio(listen);
const audioloader = new THREE.AudioLoader();
audioloader.load('./engine.mp3', (buffer) => {
    enginesound.setBuffer(buffer);
    enginesound.setRefDistance(3);
    enginesound.setVolume(0.6);
})
const renderScene = new RenderPass(scene, camera);


const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), 
    0.2,
    0.8, 
    0.8
);

const outputPass = new OutputPass();
const rendertar = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight,{
    samples: 4,
    type: THREE.HalfFloatType
});
const composer = new EffectComposer(renderer, rendertar);
composer.addPass(renderScene);
composer.addPass(bloomPass);
composer.addPass(outputPass);


document.body.appendChild(renderer.domElement);
const sceneren = new RenderPass(scene, camera);


let screencover = null
let screenopen = false
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true
controls.enableZoom = false;
controls.dampingFactor = 0.1
controls.enablePan = false
controls.maxPolarAngle = Math.PI / 2 - 0.05;
let isheadon = false;
let ishazaon = false;
let leftblink = false;
let rightblink = false;

function emissive(mesh, clorhex, arraystore){
    if(mesh){
        mesh.traverse((child) => {
            if(child.isMesh){
                child.material =    child.material.clone()
                child.userData.orginalColor = child.material.emissive.getHex();
                child.userData.originalIntensity = child.material.emissiveIntensity
                child.material.emissive = new THREE.Color(clorhex);
                if(arraystore !== leftdrlmesh && arraystore !== rightdrlmesh ){
                  child.material.emissive = new THREE.Color(clorhex);
                  child.material.emissiveIntensity = 0
                }
                arraystore.push(child);
            }
            
        });
    }
}
let intcamerapos = new THREE.Vector3(-0.4, 1.2, -0.4)
let intcamtarget = new THREE.Vector3(-0.4, 1.1,-0.2)
document.getElementById('btnview').addEventListener('click' , () => {
    isintview = !isintview;
    
        if(isintview){
            camera.fov = 60
            camera.updateProjectionMatrix();
            controls.maxPolarAngle = Math.PI
            if(intcamerapos.equals(intcamtarget)){
                intcamtarget.z -= 0.1;
            }
            camera.rotation.y = Math.PI
            camera.position.copy(intcamerapos);
            controls.target.copy(intcamtarget);
            ambientLight.intensity = 2
            dome.intensity = 5
            
        }else{
            camera.fov = 45
            camera.updateProjectionMatrix();
            controls.maxPolarAngle = Math.PI / 2 - 0.05;
            camera.position.set(4, 2, 5)
            controls.target.set(0, 0, 0)
            ambientLight.intensity = 1
            dome.intensity = 0
        }
    });
document.getElementById('btnengine').addEventListener('click' , () => {
    ectasyup = !ectasyup
    screenopen = ectasyup
    if(ectasyup){
        if(!enginesound.isPlaying){
            enginesound.play()
        }
    }else {
        if (enginesound.isPlaying) {
                const time = enginesound.context.currentTime;
                enginesound.gain.gain.setTargetAtTime(0, time, 0.5);
                setTimeout(() => {
                    enginesound.stop();
                    enginesound.setVolume(0.6); 
                }, 1500);
            }
    }
})    
document.getElementById('btnleft').addEventListener('click' , () => {
        leftblink = !leftblink;
        rightblink = false;
        ishazaon = false;
    });
document.getElementById('btnright').addEventListener('click' , () => {
        rightblink = !rightblink;
        leftblink = false;
        ishazaon = false;
    });

document.getElementById('btnhazard').addEventListener('click' , () => {
        ishazaon = !ishazaon;
        leftblink = false;
        rightblink = false;
    });
document.getElementById('btnlights').addEventListener('click' , () => {
        lightmode++;
        if(lightmode > 2) lightmode = 0;
        isheadon = (lightmode >0);
    });

let carparts = []; 
function glowtex (colorhex) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    const color = new THREE.Color(colorhex);
   gradient.addColorStop(0.2, `rgba(${color.r*255}, ${Math.floor(color.g*255)}, ${Math.floor(color.b*255)}, 0.8)`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    return new THREE.CanvasTexture(canvas);
}
const gloxtexb = glowtex(0xffaa00);
const glowmaterial = new THREE.SpriteMaterial({
    map: gloxtexb,
    color: 0xFF5533,
    transparent: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
})
    let leftindiglow = new THREE.Sprite(glowmaterial);
let rightindiglow = new THREE.Sprite(glowmaterial);
let currentmodel = null
function loadmodel(modelpath){
    if(currentmodel){
        scene.remove(currentmodel);
        carparts = [];
        lbmesh = []; hbmesh = []; tlmesh = [];
        leftdrlmesh = []; rightdrlmesh = [];
        ectasy = null; covermesh = null; screencover = null;
    }
    loading.style.display = 'flex';
    setTimeout(() => {
        loading.style.opacity = '1';
    }, 10)
    progressbar.style.width = '0%';

loader.load(modelpath, (gltf) => {
    const carModel = gltf.scene;
    currentmodel = carModel;
    if(modelpath.includes('aston') || modelpath.includes('modelDraco8')){ aston(carModel, carparts);
        intcamerapos.set(0.27, 0.69, -0.3);
        intcamtarget.set(0.27, 0.68, -0.29);
        const astonbg = new THREE.Color('#b9afae')
        scene.background = astonbg
        scene.fog.color = astonbg
        floor.material.color = new THREE.Color('#1a1a1a')
        leftbeam.position.set(1, 1, 1); 
        leftbeam.target.position.set(-0.8, 0.4, 10);
        leftbeam2.position.set(1, 1, 1);
        leftbeam2.target.position.set(-0.8, 0.4, 10);
        
        rightbeam.position.set(-0.5, 1, 1);
        rightbeam.target.position.set(-1.2, 0.4, 10);
        rightbeam2.position.set(-0.5, 1, 1);
        rightbeam2.target.position.set(-1.2, 0.4, 10);
        const blinkright = carModel.getObjectByName('Object_767');
    const blinkleft = carModel.getObjectByName('Object_183');
    
    const lowlb = carModel.getObjectByName('Object_253');
    const highlb = carModel.getObjectByName('Object_249');
    const lowrb = carModel.getObjectByName('Object_175.021');
    const highrb = carModel.getObjectByName('Object_256');
    const taillight = carModel.getObjectByName('Object_460');

        emissive(blinkleft, 0xffaa00, leftdrlmesh);
        emissive(blinkright, 0xffaa00, rightdrlmesh);
        emissive(lowrb, 0xffffff, lbmesh);
        emissive(highlb, 0xffffff, hbmesh);
        emissive(taillight, 0xff0000, tlmesh);
        groundlightl.position.set(0.4,0.5,-1.2)
        groundlightr.position.set(-0.5,0.5,-1.2)
       
        
    }else{
            intcamerapos.set(-0.4, 1.2, -0.4);
            intcamtarget.set(-0.4, 1.1, -0.2);
            const enginecover = carModel.getObjectByName('Object_306');
            const rrbg = new THREE.Color('#1b1b1b')
            scene.background = rrbg
            scene.fog.color = rrbg
            floor.material.color = rrbg
            


 const stripright = carModel.getObjectByName('Object_767');
    const stripleft = carModel.getObjectByName('Object_183');
    const doorRight = carModel.getObjectByName('doorrf');
    const doorLeft = carModel.getObjectByName('doorlb');
    const bonnet = carModel.getObjectByName('Object_302');
    const trunk = carModel.getObjectByName('Object_230');
    const doorbackright = carModel.getObjectByName('doorrb');
    const doorfrontleft = carModel.getObjectByName('doorlf');
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
    leftbeam.position.set(0.3, 0.5, 2);
        leftbeam.target.position.set(0.3, 0.1, 10);
         
        
        leftbeam2.position.set(0.3, 0.5, 2);
        leftbeam2.target.position.set(0.3, 0.1, 10);
        
        rightbeam.position.set(-1, 0.5,1.8);
        rightbeam.target.position.set(-2, 0.1, 10);
        rightbeam2.position.set(-1, 0.5, 1.8);
        rightbeam2.target.position.set(-2, 0.1, 10);
        groundlightl.position.set(1.4,1,-3)
        groundlightr.position.set(-0.2,1,-3)
        emissive(stripright, 0xffffff, rightdrlmesh)
        emissive(stripleft, 0xffffff, leftdrlmesh)


}

    
    
    const lowlb = carModel.getObjectByName('Object_253');
    const highlb = carModel.getObjectByName('Object_249');
    const lowrb = carModel.getObjectByName('Object_175.021');
    const highrb = carModel.getObjectByName('Object_256');
    const taillight = carModel.getObjectByName('Object_460');
    screencover = carModel.getObjectByName('covermeshscreen');
     ectasy = carModel.getObjectByName('ectasy');
     covermesh = carModel.getObjectByName('covermesh');
    if(ectasy){
        ectasy.userData.downZ = ectasy.position.z
        ectasy.userData.upZ = ectasy.position.z + 0.09
        ectasy.add(enginesound)
    }
    if(covermesh){
        covermesh.userData.closedX = covermesh.position.x
        covermesh.userData.openX = covermesh.position.x + 0.08
        covermesh.userData.upY = covermesh.position.y;
        covermesh.userData.downY = covermesh.position.y + 0.02
    }
    if(screencover){
        screencover.userData.closedrotx = screencover.rotation.x
        screencover.userData.openrotx = screencover.rotation.x + (Math.PI/4)
        screencover.userData.closedy = screencover.position.y
        screencover.userData.openy = screencover.position.y - 0.2
    } 
    carModel.traverse((child) => {
       if(child.isMesh){
        child.castShadow = true;
        child.receiveShadow = true;
        if(child.material){
            child.material.envMapIntensity = 0.3
            child.material.needsUpdate = true
        }
       } 
    });
    scene.add(carModel);
    setTimeout(() => {
        console.log(scene.background)
    },3000)
    
    emissive(lowlb, 0xffffff, lbmesh)
    emissive(highlb, 0xffffff, hbmesh)
    emissive(lowrb, 0xffffff, rbmesh)
    emissive(highrb, 0xffffff, rbmesh)
    emissive(taillight, 0xff0000, tlmesh)
    
    carModel.add(leftbeam);
    carModel.add(leftbeam.target);
    carModel.add(leftbeam2);
    carModel.add(leftbeam2.target);
    carModel.add(groundlightl);
    carModel.add(groundlightr);
    carModel.add(groundtail)
    carModel.add(rightbeam);
    carModel.add(rightbeam.target);
    carModel.add(rightbeam2);
    carModel.add(rightbeam2.target);
    updateraycaster(camera, carparts);

}, undefined, (error) => console.error(error));}
loadmodel('./modelDraco6.glb')
document.querySelectorAll('.carcard').forEach(card => {
    card.addEventListener('click', () => {
    const modelpath = card.getAttribute('data-model');
    modeldrawer.classList.remove('open');
    loadmodel(modelpath);
    })
})

let zoom = camera.position.distanceTo(controls.target);
const minzo = 3
const maxzo = 9;
window.addEventListener('wheel', (event) => {
    const direction = Math.sign(event.deltaY);
    zoom += direction * 1.5
    zoom = THREE.MathUtils.clamp(zoom, minzo, maxzo);
})

function animate() {
    requestAnimationFrame(animate)
    if(ectasy && covermesh){
        if(ectasyup){
            covermesh.position.y = THREE.MathUtils.lerp(covermesh.position.y, covermesh.userData.downY, 0.2)
            if(Math.abs(covermesh.position.y - covermesh.userData.downY) < 0.005){
                covermesh.position.x = THREE.MathUtils.lerp(covermesh.position.x, covermesh.userData.openX, 0.1);
            }
            if(Math.abs(covermesh.position.x - covermesh.userData.openX) < 0.01){
                ectasy.position.z = THREE.MathUtils.lerp(ectasy.position.z, ectasy.userData.upZ, 0.1);
            }
        }else {
            ectasy.position.z = THREE.MathUtils.lerp(ectasy.position.z, ectasy.userData.downZ, 0.1);
            if(Math.abs(ectasy.position.z - ectasy.userData.downZ) < 0.01){
                covermesh.position.x = THREE.MathUtils.lerp(covermesh.position.x, covermesh.userData.closedX, 0.1);
            }
            if(Math.abs(covermesh.position.x - covermesh.userData.closedX) < 0.01){
                covermesh.position.y = THREE.MathUtils.lerp(covermesh.position.y, covermesh.userData.upY, 0.2);
            }
    }}
    if(screencover){
        if(screenopen){
            screencover.rotation.x = THREE.MathUtils.lerp(screencover.rotation.x, screencover.userData.openrotx, 0.1);
            if(Math.abs(screencover.rotation.x - screencover.userData.openrotx) < 0.01){screencover.position.y = THREE.MathUtils.lerp(screencover.position.y, screencover.userData.openy, 0.1)};
        } else {
            screencover.position.y = THREE.MathUtils.lerp(screencover.position.y, screencover.userData.closedy, 0.1);
            if(Math.abs(screencover.position.y - screencover.userData.closedy) < 0.01){screencover.rotation.x = THREE.MathUtils.lerp(screencover.rotation.x, screencover.userData.closedrotx, 0.1)} 
        }
    }
    if(!isintview){
    if(isNaN(camera.position.x) || isNaN(controls.target.x)){
        camera.position.set(4, 2, 5)
        controls.target.set(0, 0, 0)
    }
    const curdis = camera.position.distanceTo(controls.target)
    if(curdis > 0.01){
        const newdis = THREE.MathUtils.lerp(curdis, zoom, 0.1)
        const direc = new THREE.Vector3().subVectors(camera.position, controls.target).normalize()
        camera.position.copy(controls.target).add(direc.multiplyScalar(newdis));
    }}
    const time = Date.now() * 0.003;
    let wavelight = Math.pow(Math.sin(time), 4);
    const flashinte = wavelight*16
    let beaminten = 0;
    let low = 0;
    let high = 0;
    let tail = 0;
    if(lightmode === 1){
        beaminten = 200;
        low = 3;
        high = 0;
        tail = 1;
        leftbeam.distance = 15;
        leftbeam.angle = Math.PI/3
        rightbeam.distance = 15;
        rightbeam.angle = Math.PI/3
    } else if (lightmode === 2){
        beaminten = 600;
        low = 3;
        high = 6;
        tail = 1;
        leftbeam2.distance = 15;
        leftbeam2.angle = Math.PI/3
        rightbeam2.distance = 15;
        rightbeam2.angle = Math.PI/3
        leftbeam.distance = 120;
        leftbeam.angle = Math.PI/6
        rightbeam.distance = 60;
        rightbeam.angle = Math.PI/6
    }
    leftbeam.intensity = beaminten;
    rightbeam.intensity = beaminten;
    leftbeam2.intensity = beaminten;
    rightbeam2.intensity = beaminten;
    lbmesh.forEach(mesh => {
        mesh.material.emissiveIntensity = low;
    })
    hbmesh.forEach(mesh => {
        mesh.material.emissiveIntensity = high;
    })
    tlmesh.forEach(mesh => {
        mesh.material.emissiveIntensity = tail;
    })
    let tailgloe = tail > 0 ? 2:0;
    if(leftblink || ishazaon){
        groundlightl.color.setHex(0xffaa00);
        groundlightl.intensity = flashinte*0.4;
    }
    else{
        groundlightl.color.setHex(0xff0000);
        groundlightl.intensity = tailgloe;
    }
    if(rightblink || ishazaon){
        groundlightr.color.setHex(0xffaa00);
        groundlightr.intensity = flashinte * 0.4;
    }
    else{
        groundlightr.color.setHex(0xff0000);
        groundlightr.intensity = tailgloe;
    }
    function updatedrl(meshes, isblinking){
        meshes.forEach(mesh => {
            if(isblinking || ishazaon){
                mesh.material.emissive.setHex(0xffaa00);
                mesh.material.emissiveIntensity = flashinte;

            }else{
                mesh.material.emissive.setHex(mesh.userData.orginalColor);
                if(mesh.userData.originalColor === 0xffaa00){
                mesh.material.emissiveIntensity =0;}else{
                    mesh.material.emissiveIntensity = isheadon ? 2:0
                }

            }
        })
    }
    updatedrl(leftdrlmesh, leftblink);
    updatedrl(rightdrlmesh, rightblink);
    
    controls.update()

    

    carparts.forEach(part => {
        if(part.userData.axis === 'swan'){
            part.rotation.order = 'ZYX';
            
            const targetY = part.userData.isOpen ? part.userData.openY : part.userData.closedY;
            const targetZ = part.userData.isOpen ? part.userData.openZ : part.userData.closedZ;            part.rotation.y = THREE.MathUtils.lerp(part.rotation.y, targetY, 0.08);
            part.rotation.z = THREE.MathUtils.lerp(part.rotation.z, targetZ, 0.08);
            part.rotation.y = THREE.MathUtils.lerp(part.rotation.y, targetY, 0.08);
        } else {
            const axis = part.userData.axis
            let target = part.userData.targetRotation
            if(part.userData.inverse) target = -target;
            part.rotation[axis] = THREE.MathUtils.lerp(part.rotation[axis], target, 0.08);
        }
    });

    composer.render();
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});
