/* ihawp.com 2025 */

const dataStruct = {
    startLat: 0,
    startLon: 0,
    closest: {
        streetName: '',
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

const addMarker = (lat, lon, label) => {
    L.marker([lat, lon]).addTo(map)
        .bindPopup(label)
        .openPopup();
}

// need to add function for finding intersection (in correct direction for a given street),
// will check documentation what I should be saving for that search
function findIntersection(streetName) {
    // intersection fetch (with on street (found street) coordinates)
    return makeFetch(`
                              [out:json];
                              [bbox:{{bbox}}];
                              way[highway][name="${streetName}"]->.w1;
                              way[highway][name="West 23rd Street"]->.w2;
                              node(w.w1)(w.w2);
                              out body;
    `);

    // make sure intersection is in direction of target as per graph below.
}

function searchForRoute(lat, lon) {

    // below is the logic for finding street and then proper lowest (closest) lat/lon value (where the user should go) (all in relation to having to use the OverpassAPI),
    // possible if you have any position (but it's likely you would want to use the users location).

    return new Promise(async (resolve) => {
        let l = await findStreets(lat, lon);
        if (l) {

            let p = l.elements;

            for (const q in p) {

                let c = p[q];

                console.log(c);

                let d = await findNodeValue(c.id, c.nodes);
                let o = d.elements;

                for (const g in o) {

                    let k = o[g];

                    console.log(k);

                    let newLat = Math.abs(dataStruct.startLat - k.lat);
                    let newLon = Math.abs(dataStruct.startLon - k.lon);
                    let dataStructClosest = dataStruct.closest;

                    if (newLat < dataStructClosest.latVal && newLon < dataStructClosest.lonVal) {

                        dataStructClosest.latitude = k.lat;
                        dataStructClosest.longitude = k.lon;

                        dataStructClosest.latVal = newLat;
                        dataStructClosest.lonVal = newLon;

                        dataStructClosest.streetName = c.tags.name;
                        console.log('street name: ', c.tags.name);


                        /*

                            if (condition === true) {

                                resolve(true);

                            } else {

                                ..recurse..

                            }

                        */

                        // return await searchForRoute(dataStructClosest.latitude, dataStructClosest.longitude);

                    }

                    if (p[q] === p[p.length - 1] && o[g] === o[o.length - 1]) {

                        route.push([dataStructClosest.latitude, dataStructClosest.longitude]);
                        addMarker(dataStructClosest.latitude, dataStructClosest.longitude, 'Route Marker');


                        // TWO LINES BELOW ARE 'fake' DELETE THEM
                        dataStructClosest.latitude = dataStruct.targetLat + 0.0001;
                        dataStructClosest.longitude = dataStruct.targetLon + 0.0001;

                        if (dataStruct.targetLat <= dataStructClosest.latitude + 0.0002 && dataStruct.targetLat >= dataStructClosest.latitude - 0.0002 && dataStruct.targetLon <= dataStructClosest.longitude + 0.0002 && dataStruct.targetLon >= dataStructClosest.longitude - 0.0002) {

                            console.log('complete route found');

                            route.push([dataStruct.targetLat, dataStruct.targetLon]);
                            addMarker(dataStruct.targetLat, dataStruct.targetLon, 'Target Location');


                            resolve(true);

                            // push target to route array in here.

                        } else {
                            console.log('still calculating streets');

                            // recurse
                        }

                        // so we are here... sure! we have two points calculatable and a proper polyline between the two.
                        // what is the best way to repeat the action of looking before resolving to true.
                        // obvisouly I need to send something like this:
                        // return await searchForRoute(dataStructClosest.latitude, dataStructClosest.longitude);
                        // but that doesn't work on it's own.
                        // What if I made a new promise for calling just this function. Probably nothing would change and it still wouldn't work so darn.
                        // Honestly (unfortunately) I have just no clue how to complete this best.

                    }

                }
            }
        }
    })

}

const userLat = document.getElementById('user-latitude');
const userLon = document.getElementById('user-longitude');
const targetLat = document.getElementById('target-latitude');
const targetLon = document.getElementById('target-longitude');
let route = [];

let map = L.map('map');


async function start() {

    // Get user location.
    let userLocation = await getLocation();

    // Set user location to inputs and dataStruct object.
    userLat.value = dataStruct.startLat = userLocation.coords.latitude;
    userLon.value = dataStruct.startLon = userLocation.coords.longitude;

    map.setView([dataStruct.startLat, dataStruct.startLon], 18);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Set target location to inputs and dataStruct object
    // Would be removable (the adding to inputs since the user would input where they want to go)
    targetLat.value = dataStruct.targetLat = parseInt(userLat.value) + 0.005;
    targetLon.value = dataStruct.targetLon = parseInt(userLon.value) + 0.005;

    // Push user start location to route array (for later) and add marker at start location.
    route.push([dataStruct.startLat, dataStruct.startLon]);
    addMarker(dataStruct.startLat, dataStruct.startLon, 'Your Location');

    /*
            target(-, +)  |     target(+, +)
                          |
            ------------start-------------
                          |
            target(-, -)  |     target(+, -)
     */


    // Has the users start location been found?
    if (userLocation) {

        // Find route (this function should run the whole thing and recurse as required)
        let routeFound = await searchForRoute(dataStruct.startLat, dataStruct.startLon);

        // Has a full route been found?
        if (routeFound) {

            // Print the route line between the markers (polyline)
            let polyline = L.polyline(route, {color: 'red'}).addTo(map);
            map.fitBounds(polyline.getBounds());

        } else {
            console.error('There was an error when searching for a route.');
        }
    } else {
        console.error('Please allow access to your location.');
    }
}

start()
    .then(response => {
        console.log(response);
    })
    .catch(error => console.error('Route Not Found: ', error));