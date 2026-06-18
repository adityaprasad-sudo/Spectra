import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {PMREMGenerator}from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { GroundProjectedSkybox } from 'three/addons/objects/GroundProjectedSkybox.js';
import { updateraycaster } from './Additionalscripts/raycast.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import { aston } from './Additionalscripts/Am.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 200);
camera.position.set(4, 2, 5); 
const dome = new THREE.PointLight(0xffffff, 0);
dome.distance = 2;
camera.add(dome);
scene.add(camera);
let editmode = false
let drop = false
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



let isintview = false

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight)

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const gen = new PMREMGenerator(renderer);
gen.compileEquirectangularShader();
const oaderchig= new RGBELoader(manager);
let skybox;
oaderchig.load('./hdris/hrdi.hdr', (texture) => {
    const envmap = gen.fromEquirectangular(texture).texture;
    scene.environment = envmap;
    scene.environmentIntensity = 1.2;
    skybox = new GroundProjectedSkybox(texture);
    skybox.scale.setScalar(100)
    skybox.radius = 70
    skybox.height = 10
    scene.add(skybox);
    texture.dispose();
})

let lightmode = 0;
let lbmesh = [];
let rbmesh = [];
let hbmesh = [];
let tlmesh = [];
const leftbeam = new THREE.SpotLight(0xffffff,0)
const rightbeam = new THREE.SpotLight(0xffffff,0)
const leftbeam2 = new THREE.SpotLight(0xffffff,0)
const rightbeam2 = new THREE.SpotLight(0xffffff,0)
const spot  = new THREE.PointLight(0xffffff,0,10,0.2)
const groundlightl = new THREE.PointLight(0xffffff, 0, 5)
const groundlightr = new THREE.PointLight(0xffffff, 0, 5)
const groundtail = new THREE.PointLight(0xffffff, 0, 5)
spot.castShadow = false
spot.position.set(0,3,0)
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
scene.add(spot)
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1

const ambientLight = new THREE.AmbientLight(0xffffff, 1); 

let ectasy = null;
let covermesh = null;
let ectasyup = false;
const listen = new THREE.AudioListener();
camera.add(listen);
const enginesound = new THREE.PositionalAudio(listen);
const audioloader = new THREE.AudioLoader();
enginesound.setRefDistance(3)
enginesound.setVolume(0.6)
function enginesounddif(soundurl){
    if(enginesound.isPlaying){
        enginesound.stop()
    }
    ectasyup = false
    screenopen = false
    audioloader.load(soundurl, (buffer) => {
        enginesound.setBuffer(buffer);
        
    });
}
const renderScene = new RenderPass(scene, camera);
const poses = [
    { pos: new THREE.Vector3(-1.2,2.924,4.772), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(1.564,2.446,4.571), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(3.975,2.636,2.601), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(4.469,2.605,-1.650), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(2.681,2.668,-3.904), target: new THREE.Vector3(0,0.5,0), fov: 60 }
    ,{pos : new THREE.Vector3(2.462,2.462,-6.272), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(-0.729,2.292,-6.423), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    { pos: new THREE.Vector3(-3.452,2.668,-5.391), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(-5.594,2.799,-2.901), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(-6.1,2.757,1.640), target: new THREE.Vector3(0,0.5,0), fov:60 },
    {pos: new THREE.Vector3(-4.120,2.799,4.769), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(-2.671,2.006,3.996), target: new THREE.Vector3(0,0.5,0), fov:60 }
    ,
    {pos: new THREE.Vector3(0.324,1.071,3.650), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    { pos: new THREE.Vector3(-1.909,1.022,3.126), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(-0.039,1.097,-5.174), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(2.060,1.097,-4.746), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(0.915,0.650,2.853), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(-1.675,1.990,-1.993), target: new THREE.Vector3(0,0.5,0), fov: 60 }
    ,{pos : new THREE.Vector3(2.455,1.884,-1.029), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(0.324,1.071,3.650), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    { pos: new THREE.Vector3(-1.909,1.022,3.126), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(-0.039,1.097,-5.174), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(2.060,1.097,-4.746), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(0.915,0.650,2.853), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(-1.675,1.990,-1.993), target: new THREE.Vector3(0,0.5,0), fov: 60 }
    ,{pos : new THREE.Vector3(2.455,1.884,-1.029), target: new THREE.Vector3(0,0.5,0), fov: 60 },
]
const posesam = [
    { pos: new THREE.Vector3(-1.101,0.650,2.787), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(1.121, 0.650, 2.779), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(3.975,2.636,2.601), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(4.469,2.605,-1.650), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(2.681,2.668,-3.904), target: new THREE.Vector3(0,0.5,0), fov: 60 }
    ,{pos : new THREE.Vector3(2.462,2.462,-6.272), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(-0.729,2.292,-6.423), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    { pos: new THREE.Vector3(-3.452,2.668,-5.391), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(-5.594,2.799,-2.901), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(-6.1,2.757,1.640), target: new THREE.Vector3(0,0.5,0), fov:60 },
    {pos: new THREE.Vector3(-4.120,2.799,4.769), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(-2.671,2.006,3.996), target: new THREE.Vector3(0,0.5,0), fov:60 }
    ,
    {pos: new THREE.Vector3(0.324,1.071,3.650), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    { pos: new THREE.Vector3(-1.909,1.022,3.126), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(-0.039,1.097,-5.174), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(2.060,1.097,-4.746), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(0.915,0.650,2.853), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(-1.675,1.990,-1.993), target: new THREE.Vector3(0,0.5,0), fov: 60 }
    ,{pos : new THREE.Vector3(2.455,1.884,-1.029), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(0.324,1.071,3.650), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    { pos: new THREE.Vector3(-1.536,0.600,-1.277), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(-0.811,0.600,1.825), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(0.972,0.6,1.745), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(0.015,0.600,-1.997), target: new THREE.Vector3(0,0.5,0), fov: 60 },
    {pos: new THREE.Vector3(0.668,0.6,-1.883), target: new THREE.Vector3(0,0.5,0), fov: 60 }
    ,{pos : new THREE.Vector3(-0.652,0.6,-1.888), target: new THREE.Vector3(0,0.5,0), fov: 60 },
]
const posesfe = [
    { pos: new THREE.Vector3(-3.17,2.026,7.295), target: new THREE.Vector3(0,0.5,0), fov: 90 },
    {pos: new THREE.Vector3(2.237,22.237,7.419), target: new THREE.Vector3(0,0.5,0), fov: 90 },
    {pos: new THREE.Vector3(-0.032,2.771,9.384), target: new THREE.Vector3(0,0.5,0), fov: 80 },
    {pos: new THREE.Vector3(2.062,1.004,-3.850), target: new THREE.Vector3(0,0.5,0), fov: 85 },
    {pos: new THREE.Vector3(3.888,2.926,3.511), target: new THREE.Vector3(0,0.5,0), fov: 95 }
    ,{pos : new THREE.Vector3(-4.098,2.750,3.412), target: new THREE.Vector3(0,0.5,0), fov: 95 },
    {pos: new THREE.Vector3(-2.566,2,-5.867), target: new THREE.Vector3(0,0.5,0), fov: 100 },
    {pos: new THREE.Vector3(2.582,2.140,-6.708), target: new THREE.Vector3(0,0.5,0), fov: 100 },
    {pos: new THREE.Vector3(0.076,3.13,-10.022), target: new THREE.Vector3(0,0.5,0), fov: 100 },
    {pos: new THREE.Vector3(0.037,3.532,-4.850), target: new THREE.Vector3(0,0.5,0), fov: 100 },
    {pos: new THREE.Vector3(-0.048,7.445,9.411), target: new THREE.Vector3(0,0.5,0), fov: 100 }
]

let currentpose = poses
let indexsho = 0
let beattime = 0
const beatcooldown = 200
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), 
    0.01,
    0.3,
    0.3
);

const outputPass = new OutputPass();
const rendertar = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight,{
    samples: 8,
    type: THREE.HalfFloatType,
    format: THREE.RGBAFormat,
    depthBuffer: true
});
const composer = new EffectComposer(renderer, rendertar);
composer.addPass(renderScene);
composer.addPass(bloomPass);
composer.addPass(outputPass);
const slidermsaa = document.getElementById('msaaSlider');
const msaareadout = document.getElementById('msaaReadout');
const level = [0,2,4,8,16]
if(slidermsaa && msaareadout){
    slidermsaa.addEventListener('input', (e) => {
        const levelin = parseInt(e.target.value)
        const samplesr = level[levelin]
        msaareadout.innerText = samplesr === 0 ? 'off' : samplesr + 'x'
        composer.renderTarget1.samples = samplesr;
        composer.renderTarget2.samples = samplesr;

        
        composer.renderTarget1.dispose();
        composer.renderTarget2.dispose();
    });
}
document.body.appendChild(renderer.domElement);
const sceneren = new RenderPass(scene, camera);

let campos = new THREE.Vector3(4, 2, 5);
let camlock = new THREE.Vector3(0, 0, 0);
let ambientlight = 1;
let fov = 60;
const song = new THREE.Audio(listen)
const drums = new THREE.Audio(listen)
const music = new THREE.Audio(listen)
const vocal = new THREE.Audio(listen)
let analyzedrum = null
let analyzevocal = null
let analyzepiano = null

audioloader.load('./music/song.mp3', (buffer) => {
    song.setBuffer(buffer);
    song.setVolume(0.5);
    
})
audioloader.load('./music/vocals.mp3', (buffer) => {
    vocal.setBuffer(buffer);
    vocal.setVolume(0.5);
    analyzevocal = new THREE.AudioAnalyser(vocal, 128)
})
audioloader.load('./music/drums.mp3', (buffer) => {
    drums.setBuffer(buffer);
    drums.setVolume(0.5);
    analyzedrum = new THREE.AudioAnalyser(drums, 128)
})
audioloader.load('./music/music.mp3', (buffer) => {
    music.setBuffer(buffer);
    music.setVolume(0.5);
    analyzepiano = new THREE.AudioAnalyser(music, 128)
})
const btnedit = document.getElementById('btnedit')
if(btnedit){
    btnedit.addEventListener('click', () => {
        editmode = !editmode    
        if(editmode){
            drop = true
            controls.enabled = false
            if(!enginesound.isPlaying){
                enginesound.play()
                ectasyup = true
                screenopen = true
            }
            if(!song.isPlaying){
                song.play()
                vocal.play()
                drums.play()
                music.play()
            }
            indexsho = 0
            campos.copy(currentpose[indexsho].pos)
            camlock.copy(curentpose[indexsho].target)
            fov = currentpose[indexsho].fov
            camera.position.copy(campos)
            controls.target.copy(camlock)
            ambientlight = 0.02
            
            
        }else{
            drop = false
            controls.enabled = true
            if(song.isPlaying){
                song.stop()
                vocal.stop()
                drums.stop()
                music.stop()
            }
            campos.set(4,2,5)
            camlock.set(0,0,0)
            ambientlight = 1
            fov = 60
            camera.fov = fov
            camera.updateProjectionMatrix();
            isheadon = false
            lightmode = 0
            carparts.forEach(part => {
                part.userData.isOpen = false
            })
        }
    })
}
const btnsett = document.getElementById('btnsettings')
const menugraph = document.getElementById('graphicsmenu')
btnsett.addEventListener('click', () => {
    menugraph.classList.toggle('open')
    modeldrawer.classList.remove('open')
})
btnmenu.addEventListener('click', () => {
    modeldrawer.classList.toggle('open')
    graphicsmenu.classList.remove('open')
})




const expo = document.getElementById('exposure')
const valexpo = document.getElementById('exposurevalue')
expo.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value)
    renderer.toneMappingExposure = val
    valexpo.innerText = val.toFixed(1)
})
const bloom = document.getElementById('bloom')
const valbloom = document.getElementById('inbloom')
bloom.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value)
    bloomPass.strength = val
    valbloom.innerText = val.toFixed(1)
})
const msaa = document.getElementById('antialaishing')
const valmsaa = document.getElementById('valmsaa')
const msaalevel = [0,2,4,8,16]
msaa.addEventListener('input', (e) => {
    const levelin = parseInt(e.target.value)
    const samplesr = msaalevel[levelin]
    if (samplesr === 0) {
    valmsaa.innerText = 'off';
    } else {
    valmsaa.innerText = samplesr + 'x'; 
    }
    composer.renderTarget1.samples = samplesr;
    composer.renderTarget2.samples = samplesr;
    composer.renderTarget1.dispose();
    composer.renderTarget2.dispose();
})
const selquality = document.getElementById('selquality')
selquality.addEventListener('change', (e) => {
    const quality = e.target.value
    if(quality === 'low'){
        renderer.setPixelRatio(0.3)
        bloomPass.enabled = false
    }
    else if (quality === 'medium'){
        renderer.setPixelRatio(1)
        bloomPass.enabled = true
    }
    else if (quality === 'high'){
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.VSMShadowMap
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    scene.traverse((child) => {
        if(child.isMesh && child.material){
            child.material.needsUpdate = true
        }
    });
});
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
function sweeper(mesh,clorhex, arraystore, rever = false){
    if(mesh){
        mesh.traverse((child) => {
            if(child.isMesh){
                child.geometry.computeBoundingBox();
                const box = child.geometry.boundingBox;
                const minx = box.min.x
                const width = box.max.x - minx
                const att = child.geometry.attributes.position
                const uvarray = new Float32Array(att.count *2)
                for(let i = 0; i < att.count; i++){
                    const x = att.getX(i)
                    uvarray[i * 2] = (x - minx) / width
                    uvarray[i * 2 + 1] = 0.5
                }
                child.geometry.setAttribute('uv', new THREE.BufferAttribute(uvarray, 2))
                child.material =    child.material.clone()
                child.userData.orginalColor = child.material.emissive.getHex();
                child.material.emissive = new THREE.Color(clorhex);
                child.material.emissiveIntensity = 0
                child.material.defines = child.material.defines || {}
                child.material.defines.USE_UV = ''
                child.material.customProgramCacheKey = () => 'sweeper_' + rever;
                child.userData.sweepuni = {value: 0}
                child.material.onBeforeCompile = (shader) => {
                    shader.uniforms.usweep = child.userData.sweepuni
                    shader.fragmentShader = `uniform float usweep;\n` + shader.fragmentShader;
                    const sweeplogic = rever
                    ? `float mask = step(1.0 - usweep, vUv.x);`
                    : `float mask = step(vUv.x, usweep);`;
                    shader.fragmentShader = shader.fragmentShader.replace(
                        `#include <emissivemap_fragment>`,
                        `#include <emissivemap_fragment>
                        ${sweeplogic}
                        totalEmissiveRadiance *= mask;
                        `
                    )
                    
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
            ambientLight.intensity = 0
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

let minzo = 3
let maxzo = 9;
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
    if(modelpath.includes('astonDraco')){ aston(carModel, carparts);
        currentpose = posesam
        indexsho = 0
        const texsha = new THREE.TextureLoader(manager).load('./shadowmaps/astonshadow.png');
            const geosha = new THREE.PlaneGeometry(6.5, 10);
            const matsha = new THREE.ShaderMaterial({
                transparent: true,
                depthWrite: false,
                uniforms:{
                    tDiffuse:{value:texsha},
                    shadowColor:{value: new THREE.Color(0x000000)}
                },
                vertexShader:`
                    varying vec2 vUv;
                    void main(){
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }`,
                fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform vec3 shadowColor;
                varying vec2 vUv;
                void main(){
                    vec4 tex = texture2D(tDiffuse, vUv);
                    float alpha = 1.0 - tex.r;
                    gl_FragColor = vec4(shadowColor, alpha*0.99);
                }`
            })
            const bakedplane = new THREE.Mesh(geosha, matsha);
           
            bakedplane.rotation.x = -Math.PI/2
            bakedplane.position.set(0,0.01,0)
            carModel.add(bakedplane)
        minzo = 2
        maxzo = 5

        enginesounddif('./carsounds/astonmartin.mp3')
        intcamerapos.set(0.27, 0.69, -0.3);
        intcamtarget.set(0.27, 0.68, -0.29);
        
        
        
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
    const bonnet = carModel.getObjectByName('Object_612');
    const trunk = carModel.getObjectByName('Object_29');
    if (bonnet) {
        bonnet.userData = { isOpen: false, targetRotation: 0, axis: 'x' }; 
        carparts.push(bonnet);
    }
    if (trunk) {
        trunk.userData = { isOpen: false, targetRotation: 0, axis: 'x'  };
        carparts.push(trunk);
    }

        emissive(blinkleft, 0xffaa00, leftdrlmesh);
        emissive(blinkright, 0xffaa00, rightdrlmesh);
        emissive(lowrb, 0xffffff, lbmesh);
        emissive(highlb, 0xffffff, hbmesh);
        emissive(taillight, 0xff0000, tlmesh);
        groundlightl.position.set(0.4,0.3,-1.2)
        groundlightr.position.set(-0.5,0.3,-1.1)
        spot.intensity = 4
        
    }else if(modelpath.includes('modelDraco10')){
        enginesounddif('./carsounds/Ferrariengine.mp3')
        intcamerapos.set(0.27, 0.69, -0.3);
        intcamtarget.set(0.27, 0.68, -0.29);
        const texsha = new THREE.TextureLoader(manager).load('./shadowmaps/ferrari.png');
            const geosha = new THREE.PlaneGeometry(14, 19);
            const matsha = new THREE.ShaderMaterial({
                transparent: true,
                depthWrite: false,
                uniforms:{
                    tDiffuse:{value:texsha},
                    shadowColor:{value: new THREE.Color(0x000000)}
                },
                vertexShader:`
                    varying vec2 vUv;
                    void main(){
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }`,
                fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform vec3 shadowColor;
                varying vec2 vUv;
                void main(){
                    vec4 tex = texture2D(tDiffuse, vUv);
                    float alpha = 1.0 - tex.r;
                    gl_FragColor = vec4(shadowColor, alpha*0.99);
                }`
            })
            const bakedplane = new THREE.Mesh(geosha, matsha);
            
            bakedplane.rotation.x = -Math.PI/2
            bakedplane.position.set(0,0.01,0)
            carModel.add(bakedplane)
        minzo = 6
        maxzo = 12
        currentpose = posesfe
        indexsho = 0
        intcamerapos.set(0.7, 2, -0.4);
        intcamtarget.set(0.7, 1.9, -0.2);
        const enginecover = carModel.getObjectByName('Object_306');
            const rrbg = new THREE.Color('#1b1b1b')
            
            
            
            spot.intensity = 0


 const stripright = carModel.getObjectByName('rightblinker');
    const stripleft = carModel.getObjectByName('leftblinker');
    const doorRight = carModel.getObjectByName('doorrf');
    const doorLeft = carModel.getObjectByName('doorlb');
    const bonnet = carModel.getObjectByName('Object_302');
    const trunk = carModel.getObjectByName('Object_230');
    if (doorRight) {
        doorRight.userData = { isOpen: false, targetRotation: 0, axis: 'y' };
        carparts.push(doorRight);
    }
    if (doorLeft) {
        doorLeft.userData = { isOpen: false, targetRotation: 0, axis: 'y', inverse: true  };
        carparts.push(doorLeft);
    }
    if (bonnet) {
        bonnet.userData = { isOpen: false, targetRotation: 0, axis: 'x', inverse: true }; 
        carparts.push(bonnet);
    }
    if (trunk) {
        trunk.userData = { isOpen: false, targetRotation: 0, axis: 'x', };
        carparts.push(trunk);
    }
    if (enginecover) {
        enginecover.userData = { isOpen: false, targetRotation: 0, axis: 'x', inverse: true };
        carparts.push(enginecover);
        
    }
    leftbeam.position.set(2, 2, 4);
        leftbeam.target.position.set(2, 0.1, 10);
         
        
        leftbeam2.position.set(2, 2, 4);
        leftbeam2.target.position.set(2, 0.1, 10);
        
        rightbeam.position.set(-2,2,4);
        rightbeam.target.position.set(-2, 0.1, 10);
        rightbeam2.position.set(-2,2, 4);
        rightbeam2.target.position.set(-2, 0.1, 10);
        groundlightl.position.set(1.4,1,-3)
        groundlightr.position.set(-0.2,1,-3)
        
        sweeper(stripleft, 0xffaa00, leftdrlmesh, false)
        sweeper(stripright, 0xffaa00, rightdrlmesh, true)



    }
    
    else{const texsha = new THREE.TextureLoader(manager).load('./shadowmaps/shadow.png');
            const geosha = new THREE.PlaneGeometry(6.5, 10);
            const matsha = new THREE.ShaderMaterial({
                transparent: true,
                depthWrite: false,
                uniforms:{
                    tDiffuse:{value:texsha},
                    shadowColor:{value: new THREE.Color(0x000000)}
                },
                vertexShader:`
                    varying vec2 vUv;
                    void main(){
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }`,
                fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform vec3 shadowColor;
                varying vec2 vUv;
                void main(){
                    vec4 tex = texture2D(tDiffuse, vUv);
                    float alpha = 1.0 - tex.r;
                    gl_FragColor = vec4(shadowColor, alpha*0.99);
                }`
            })
            const bakedplane = new THREE.Mesh(geosha, matsha);
            bakedplane.rotation.z = -Math.PI/16
            bakedplane.rotation.x = -Math.PI/2
            bakedplane.position.set(0,0.01,0)
            carModel.add(bakedplane)
               minzo = 3
               maxzo = 7
        currentpose = poses
        indexsho = 0
                    enginesounddif('./carsounds/RollsEngine.mp3')

            intcamerapos.set(-0.4, 1.2, -0.4);
            intcamtarget.set(-0.4, 1.1, -0.2);
            const enginecover = carModel.getObjectByName('Object_306');
            const rrbg = new THREE.Color('#1b1b1b')
            
            


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
            child.material.envMapIntensity = 1
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
    carModel.add(leftbeam2)
    carModel.add(enginesound)
    carModel.add(leftbeam2.target);
    carModel.add(groundlightl)
    carModel.add(groundlightr);
    carModel.add(groundtail)
    carModel.add(rightbeam)
    carModel.add(rightbeam.target);
    carModel.add(rightbeam2);
    carModel.add(rightbeam2.target)
    updateraycaster(camera, carparts);

}, undefined, (error) => console.error(error));}
loadmodel('./3D_Models/modelDraco6.glb')
document.querySelectorAll('.carcard').forEach(card => {
    card.addEventListener('click', () => {
    const modelpath = card.getAttribute('data-model');
    modeldrawer.classList.remove('open');
    loadmodel(modelpath);
    })
})

let zoom = camera.position.distanceTo(controls.target);

window.addEventListener('wheel', (event) => {
    const direction = Math.sign(event.deltaY);
    zoom += direction * 1.5
    zoom = THREE.MathUtils.clamp(zoom, minzo, maxzo);
})
let shake = 0;

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
    if(!isintview && !editmode ){
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
    ambientLight.intensity = THREE.MathUtils.lerp(ambientLight.intensity, ambientlight, 0.1)
    
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
        mesh.material.emissiveIntensity =   tail;
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
    if(editmode){
       
        if(analyzepiano && analyzedrum && analyzevocal){
            const drumvol  = analyzedrum.getAverageFrequency();
            const painofreq = analyzepiano.getFrequencyData();
            const vocalfrq = analyzevocal.getFrequencyData();
            const paipeak = painofreq[25]
            const vocalpeak = vocalfrq[29]
            
            console.log(drumvol, vocalpeak)
            const now = Date.now()
            if(camera.userData.fovOffset === undefined) camera.userData.fovOffset = 0;
            if(camera.userData.lightpulse === undefined) camera.userData.lightpulse = 0
            if((paipeak>40) && (now-beattime) > beatcooldown){
                
                beattime = now
                indexsho = (indexsho + 1) % currentpose.length;
                
                campos.copy(currentpose[indexsho].pos)
                camlock.copy(currentpose[indexsho].target)
                fov = currentpose[indexsho].fov
                camera.userData.fovOffset -= 30;
                shake = 0.8
                isheadon=true
                lightmode = 2
                ishazaon= true
                lbmesh.forEach(mesh => mesh.material.emissiveIntensity = 50);
                hbmesh.forEach(mesh => mesh.material.emissiveIntensity = 50);
                
            }
            if(drumvol > 20 && (now-beattime) > beatcooldown ){
                beattime = now
                camera.userData.lightpulse = 100
            }
            const sway = now * 0.001;
            const swayx = Math.cos(sway * 2) * 0.15
            const swayy = Math.sin(sway * 2) * 0.15
            const finalcam = new THREE.Vector3().copy(campos).add(new THREE.Vector3(swayx, swayy, 0))
            if(shake > 0){
                const shaku = shake * shake * 0.4;
                finalcam.x += (Math.random() - 0.5) * shaku;
                finalcam.y += (Math.random() - 0.5) * shaku;
                finalcam.z += (Math.random() - 0.5) * shaku;
                shake *= 0.85; 
                if(shake < 0.01) shake = 0;}
                camera.position.copy(finalcam);
            controls.target.copy(camlock);
            
            camera.userData.fovOffset *= 0.8; 
            camera.fov = fov + camera.userData.fovOffset; 
            camera.updateProjectionMatrix();
            const loudest = Math.max(paipeak, vocalpeak);
            const snap = Math.pow(loudest/255, 4);
            camera.userData.lightpulse *=0.85
            beaminten = camera.userData.lightpulse;
            leftbeam.intensity = beaminten; rightbeam.intensity = beaminten;
            leftbeam2.intensity = beaminten; rightbeam2.intensity = beaminten;
            console.log(snap)
            const glowLevel = camera.userData.lightpulse;
            lbmesh.forEach(mesh => mesh.material.emissiveIntensity = glowLevel);
            hbmesh.forEach(mesh => mesh.material.emissiveIntensity = glowLevel);
            tlmesh.forEach(mesh => mesh.material.emissiveIntensity = glowLevel * 0.5);
            }
            }

        

    
    
    function updatedrl(meshes, isblinking){
        meshes.forEach(mesh => {
            if(isblinking || ishazaon){
                mesh.material.emissive.setHex(0xffaa00)
                if(mesh.userData.sweepuni){
                    mesh.material.emissiveIntensity = 15;
                    mesh.userData.sweepuni.value = (Date.now() * 0.0025) % 2

                }else{
                    mesh.material.emissiveIntensity = flashinte;
                }
            }else {
                mesh.material.emissive.setHex(mesh.userData.orginalColor)
                if(mesh.userData.orginalColor === 0xffaa00){
                    mesh.material.emissiveIntensity = 0
                }else{
                    mesh.material.emissiveIntensity = isheadon ? 2:0;
                }

                if(mesh.userData.sweepuni){
                    mesh.userData.sweepuni.value = 1;
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
            let targetangle = part.userData.isOpen ? (Math.PI/3) : 0
            if(part.userData.inverse) targetangle = -targetangle;
            part.rotation[axis] = THREE.MathUtils.lerp(part.rotation[axis], targetangle, 0.08);
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
