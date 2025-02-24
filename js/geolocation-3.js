function error(error) {
    console.error(error);
}

const options = {
    maxAge: 0,
    timeout: Infinity,
    enableHighAccuracy: true
}

function getLocation() {
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(function(pos) {
            resolve(pos);
        }, error, options);
    });
}

function makeFetch(query) {
    return new Promise((resolve) => {
       fetch('https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query))
           .then(response => resolve(response.json()))
           .catch(error => console.error(error));
    });
}

let dataStruct = {
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


async function run() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
    let result = await getLocation();

    //
    let lat = result.coords.latitude;
    let lon = result.coords.longitude;
    dataStruct.targetLat = dataStruct.startLat + 0.0054;
    dataStruct.targetLon = dataStruct.startLon + 0.0054;




    if (result) {

        // returns nearest streets node id and nodes
        let query = await makeFetch(`[out:json]; way(around:50, ${lat}, ${lon})["highway"]; out body;`);
        console.log(query);

        let qe = query.elements;
        for (const i in qe) {
            let l = qe[i];

            // returns about 1-5 lat/lon for each node.
            let q = await makeFetch(`[out:json]; node(id: ${l.id}, ${l.nodes}); out body;`);

            let qe2 = q.elements;
            for (const e in qe2) {
                let p = qe2[e];

                // checking for lowest

                let newLat = Math.abs(lat - p.lat);
                let newLon = Math.abs(lon - p.lon);
                let dataClosest = dataStruct.closest;


                if (newLat < dataClosest.latVal && newLon < dataClosest.lonVal) {
                    dataClosest.latitude = p.lat;
                    dataClosest.longitude = p.lon;
                    dataClosest.latVal = newLat;
                    dataClosest.lonVal = newLon;
                }


            }

            console.log(q);
        }



        // make query for surrounding street.
        // `[out:json]; way(around:50, ${result.coords.latitude}, ${result.coords.longitude})["highway"]; out body;`
        // `[out:json]; node(id: ${l[i].id}, ${l[i].nodes}); out body;`

        // find actual lat (this is the waste of time of this app)

        // find the closest intersection
            // continue one way in direction of target
                // whether this is x or y will be two cases?
                // or we could have variable acting as both.

    }
    return result;
}


// add app.
run()
    .then(() => {
        console.log(dataStruct);




    })
    .catch(error => console.error(error));
