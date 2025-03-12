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
    return makeFetch(`[out:json]; way(around:25, ${lat}, ${lon})["highway"]; out body;`);
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
                              node(w.w1)(w.w2);
                              out body;
    `);

    // make sure intersection is in direction of target as per graph below.
}


let run = 0;
async function searchForRoute(lat, lon) {

    console.log(`${run}, searching for route`);
    run++;

    // below is the logic for finding street and then proper lowest (closest) lat/lon value (where the user should go) (all in relation to having to use the OverpassAPI),
    // possible if you have any position (but it's likely you would want to use the users location).

    let b = await new Promise(async (resolve) => {
        let l = await findStreets(lat, lon);
        if (l) {

            console.log(l);

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

                    }

                    if (p[q] === p[p.length - 1] && o[g] === o[o.length - 1]) {

                        route.push([dataStructClosest.latitude, dataStructClosest.longitude]);
                        addMarker(dataStructClosest.latitude, dataStructClosest.longitude, 'Route Marker');


                        if (dataStruct.targetLat <= dataStructClosest.latitude + 0.0002 && dataStruct.targetLat >= dataStructClosest.latitude - 0.0002 && dataStruct.targetLon <= dataStructClosest.longitude + 0.0002 && dataStruct.targetLon >= dataStructClosest.longitude - 0.0002) {

                            route.push([dataStruct.targetLat, dataStruct.targetLon]);

                            resolve(true);

                        } else {
                            console.log('still calculating streets');
                            resolve(false);
                        }

                    }

                }
            }
        }
    });


    // check if full route found here
    // if most recent point found is within 10 metres then route is good to go
    // else keep looking for streets to get there.
    if (run === 3) {
        return b;
    } else {
        return await searchForRoute(dataStruct.closest.latitude, dataStruct.closest.longitude);
    }

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
    dataStruct.targetLat = parseInt(userLat.value) + 0.00025;
    dataStruct.targetLon = parseInt(userLon.value) - 0.00035;

    // Push user start location to route array (for later) and add marker at start location.
    route.push([dataStruct.startLat, dataStruct.startLon]);
    addMarker(dataStruct.startLat, dataStruct.startLon, 'Your Location');
    addMarker(dataStruct.targetLat, dataStruct.targetLon, 'Target Location');

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

            // Store route in local storage for 7 days.

            // Print the route line between the markers (polyline).
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



/*



Dijkstra's Algorithm:

Possible algorithm solution, but I don't know how beautifully it could work... perhaps I can construct a query
that can do the algorithm in the query (find a whole route to a target location)?

The algorithm requires a starting node, and node N, with a distance between the starting node and N.
Dijkstra's algorithm starts with infinite distances and tries to improve them step by step:

Create a set of all unvisited nodes: the unvisited set.

Assign to every node a distance from start value: for the starting node,
    it is zero, and for all other nodes, it is infinity, since initially no path
    is known to these nodes. During execution, the distance of a node N is the length
    of the shortest path discovered so far between the starting node and N.[18]

From the unvisited set, select the current node to be the one with the smallest
    (finite) distance; initially, this is the starting node (distance zero). If the unvisited
    set is empty, or contains only nodes with infinite distance (which are unreachable),
    then the algorithm terminates by skipping to step 6. If the only concern is the path to
    a target node, the algorithm terminates once the current node is the target node. Otherwise,
    the algorithm continues.

    Technically the "once the current node is the target node" can be an issue since we are unsure if they are looking for street or house or whatnot

    Query could be made regarding if there is a street or whatnot at the target coordinates.. but later!

For the current node, consider all of its unvisited neighbors and
    update their distances through the current node; compare the newly calculated distance
    to the one currently assigned to the neighbor and assign the smaller one to it. For example,
    if the current node A is marked with a distance of 6, and the edge connecting it with its neighbor
    B has length 2, then the distance to B through A is 6 + 2 = 8. If B was previously marked with a
    distance greater than 8, then update it to 8 (the path to B through A is shorter). Otherwise,
    keep its current distance (the path to B through A is not the shortest).

After considering all the current node's unvisited neighbors, the current node is removed from
    the unvisited set. Thus, a visited node is never rechecked, which is correct because the distance
    recorded on the current node is minimal (as ensured in step 3), and thus final. Repeat from step 3.

Once the loop exits (steps 3–5), every visited node contains its shortest distance from the starting node.

*/