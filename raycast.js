import * as THREE from 'three';
export function raycast(camera, carparts) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    window.addEventListener('mousedown', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 -1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 +1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(carparts, true);
        if(intersects.length > 0){
            let selectmesh = intersects[0].object;
            let target = null;
            selectmesh.traverseAncestors((ancestor)=> {
                if(carparts.includes(ancestor)) target = ancestor;
            });
            if(carparts.includes(selectmesh)) target = selectmesh;
            if(target){
                target.userData.isOpen = !target.userData.isOpen;
                target.userData.targetRotation = target.userData.isOpen ? (Math.PI / 3) : 0;
                console.log(`${target.name} clicked! Target rotation:`, target.userData.targetRotation);
            }
        }

    });

}