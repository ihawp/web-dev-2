/* ihawp.com 2025 */

const dataStruct = {
    startLat: 0,
    startLon: 0,
    closest: {
        latitude: 0,
        latVal: 100,
        longitude: 0,
        lonVal: 100
    },
    currentLat: 0,
    currentLon: 0,
    targetLat: 0,
    targetLon: 0,
}

function getLocation() {
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(function(pos) {
            resolve(pos);
        }, error, options);
    });
}
function error(error) {
    console.error(error);
}
const options = {
    maxAge: 0,
    timeout: Infinity,
    enableHighAccuracy: true
}


function makeFetch(query) {
    return new Promise((resolve) => {
       fetch('https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query))
           .then(response => resolve(response.json()))
           .catch(error => console.error(error));
    });
}

function findNodeValue(id, nodes) {
    // returns about 1-5 lat/lon for each node.
    return makeFetch(`[out:json]; node(id: ${id}, ${nodes}); out body;`);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
// returns nearest streets node id and nodes
function findStreets(lat, lon) {
    return makeFetch(`[out:json]; way(around:50, ${lat}, ${lon})["highway"]; out body;`);
}



let map = L.map('map').setView([0, 0], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const addMarker = (lat, lon, label) => {
    L.marker([lat, lon]).addTo(map)
        .bindPopup(label)
        .openPopup();
}

// need to add function for finding intersection (in correct direction for a given street),
// will check documentation what I should be saving for that search
function findIntersection(lat, lon) {
    // intersection fetch (with on street (found street) coordinates)
    return makeFetch(``);
}

let largeCount = 0;

function searchForRoute(lat, lon) {

    // below is the logic for finding street and then proper lowest (closest) lat/lon value (where the user should go) (all in relation to having to use the OverpassAPI),
    // possible if you have any position (but it's likely you would want to use the users location).

    return new Promise(async (resolve) => {
        let l = await findStreets(lat, lon);
        if (l) {

            let p = l.elements;

            for (const q in p) {

                let c = p[q];

                let d = await findNodeValue(c.id, c.nodes);
                let o = d.elements;

                for (const g in o) {

                    console.log('wow');

                    let k = o[g];
                    let newLat = Math.abs(dataStruct.startLat - k.lat);
                    let newLon = Math.abs(dataStruct.startLon - k.lon);
                    let dataStructClosest = dataStruct.closest;

                    if (newLat < dataStructClosest.latVal && newLon < dataStructClosest.lonVal) {

                        dataStructClosest.latitude = k.lat;
                        dataStructClosest.longitude = k.lon;

                        dataStructClosest.latVal = newLat;
                        dataStructClosest.lonVal = newLon;


                        /*

                            if (condition === true) {

                                resolve(true);

                            } else {

                                ..recurse..

                            }

                        */
                        // testing below


                        if (largeCount === 10) {
                            resolve(false);
                        }

                        // if closest is within 50 metres of target?
                        if (dataStruct.targetLat <= dataStructClosest.latitude + 0.0002 && dataStruct.targetLat >= dataStructClosest.latitude - 0.0002 && dataStruct.targetLon <= dataStructClosest.longitude + 0.0002 && dataStruct.targetLon >= dataStructClosest.longitude - 0.0002) {
                            console.log('complete route found');

                            // push target to route array in here.
                            resolve(true);


                        } else {
                            console.log(largeCount, 'still calculating streets');
                            largeCount++;
                        }

                        resolve(searchForRoute());

                    }

                }
            }
        }
    })

}

const userLat = document.getElementById('user-latitude');
const userLon = document.getElementById('user-longitude');

async function start() {



    // get and set user location (set to 'dataStruct' object properties)
    // add a marker to the map showing the user where they are.

    let userLocation = await getLocation();

    userLat.value = dataStruct.startLat = userLocation.coords.latitude;
    userLon.value = dataStruct.startLon = userLocation.coords.longitude;
    dataStruct.targetLat = userLat.value;
    dataStruct.targetLon = userLon.value;

    addMarker(dataStruct.startLat, dataStruct.startLon, 'Your Location');

    // input this data into the 'user location'/'your location' section of the form


    // figure out quadrant that target is located in (in) relation to the start location.
    // might help in determining if we are going the right direction.
    /*
            target(-, +)  |     target(+, +)
                          |
            ------------start-------------
                          |
            target(-, -)  |     target(+, -)
     */

    // move this func call to outside in event listener for submit button.
    if (userLocation) {
        let routeFound = await searchForRoute();

        if (routeFound) {

            console.log(routeFound);

            // print the route line (polyline)
            let polyline = L.polyline([[dataStruct.startLat, dataStruct.startLon]], {color: 'red'}).addTo(map);
            map.fitBounds(polyline.getBounds());

        } else {
            console.error('error finding route');
        }

    }
}

start()
    .then(response => console.log(response))
    .catch(error => console.error('Route Not Found: ', error));