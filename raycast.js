import * as THREE from 'three';
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let currentcamera = null;
    let currentcarparts = [];
    let listener = false;
    export function updateraycaster(camera,carparts){
        currentcamera = camera;
        currentcarparts = carparts;
        if(!listener){
            window.addEventListener('mousedown', onMouseClick)
            listener = true
        }
    }

    function onMouseClick(event) {
        if(!currentcamera || currentcarparts.length == 0) return;
        if(event.target.tagName !== 'CANVAS') return;
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, currentcamera);
        const intersects = raycaster.intersectObjects(currentcarparts,true);
        if (intersects.length > 0) {
            let selectmesh = intersects[0].object;
            let target = null;
            selectmesh.traverseAncestors((ancestor) => {
                if(currentcarparts.includes(ancestor)) target = ancestor;
            });
            if (currentcarparts.includes(selectmesh)) target = selectmesh;
            if(target){
                target.userData.isOpen = !target.userData.isOpen
                if(target.userData.axis !== 'swan'){
                    target.userData.targetRotation = target.userData.isOpen ? (Math.PI / 3) : 0;
                }
            }
        }
    }

