export function aston(carModel, carparts){
    const doorl = carModel.getObjectByName('Object_511');
    const doorr = carModel.getObjectByName('Object_602');
    const uptilt = 12 * (Math.PI/180)
    const swingout = Math.PI/3
    if(doorl){
        doorl.userData = {
            isOpen: false,
            axis : 'swan',
            closedY : doorl.rotation.x,
            closedZ : doorl.rotation.z,
            openY : doorl.rotation.y - swingout,    
            openZ : doorl.rotation.z + uptilt,
        }
        carparts.push(doorl);
    }
    if(doorr){
        doorr.userData = {
            isOpen: false,
            axis : 'swan',
            closedY : doorr.rotation.y,
            closedZ : doorr.rotation.z,
            openY : doorr.rotation.y + swingout,    
            openZ : doorr.rotation.z - uptilt,
        }
        carparts.push(doorr);
    }
}