/*

    ADD COMMENTS TO OUTLINE FOR PRESENTATION

*/
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
};
function success(pos) {
    document.getElementById("geolocation").src = `https://www.openstreetmap.org/export/embed.html?bbox
=${pos.coords.longitude-0.01},${pos.coords.latitude-0.01},${pos.coords.longitude+0.01},${pos.coords.latitude+0.01}&layer=mapnik&marker=${pos.coords.latitude},${pos.coords.longitude}`;
}

function error(err) {
    console.warn(`Error (${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);
