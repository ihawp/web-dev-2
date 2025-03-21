// navigator.geolocation.getCurrentPosition(success, error);

let options = {
    timeout: Infinity,
    maximumAge: 0,
    enableHighAccuracy: true
}


let id = navigator.geolocation.watchPosition(success, error, options);

setTimeout(() => {
    navigator.geolocation.clearWatch(id);
    console.log('--- end ---');
}, 10000)

function success(position) {
    console.log(position)
}
function error(error) {
    console.error(error);
}