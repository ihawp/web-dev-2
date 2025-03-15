let currentPresentation = 0;
let currentSlide;
const presentationContainer = document.getElementById('presentation-container');
const selection = document.getElementById('selection');
const view = document.getElementById('view');
const presentation = document.getElementById("presentation");
const presentationData = {
    0: {
        0: {
            title: "Geolocation API",
            content: {
                0: {
                    title: "What is the Geolocation API?",
                    content: [
                        "Imagine you can find out where a user is in the world with just a click of a button.",
                        "The Geolocation API allows web applications to access the user's geographical location, enabling location-based services.",
                        "It’s powerful for providing personalized content, navigation, weather updates, and so much more!"
                    ]
                },
                1: {
                    title: "What can it do?",
                    content: [
                        "With the Geolocation API, apps can fetch the user's coordinates (latitude and longitude),",
                        "or even determine the user's location using methods like GPS or IP address.",
                        "This helps to make apps more dynamic and contextually aware of the user's environment."
                    ]
                },
            },
            image: "geo-1.png",
            video: ""
        },
        1: {
            title: "Geolocation API: getCurrentPosition",
            content: {
                0: {
                    title: "getCurrentPosition",
                    content: [
                        "The getCurrentPosition() function is the most common way to get a user's current position.",
                        "It returns the latitude and longitude, as well as other details such as accuracy and altitude.",
                        "It requires user consent to access location data."
                    ]
                },
                1: {
                    title: "Example Usage",
                    content: [
                        "navigator.geolocation.getCurrentPosition(success, error, options)",
                    ]
                }
            },
            image: "geo-4.png",
            video: ""
        },
        2: {
            title: "Geolocation API: watchPosition / clearWatch",
            content: {
                0: {
                    title: "watchPosition",
                    content: [
                        "The watchPosition() function allows you to track the user's position over time.",
                        "It continuously provides updated position data, perfect for apps that need real-time location tracking.",
                        "It’s useful for navigation, fitness apps, or anything that requires constant location updates."
                    ]
                },
                1: {
                    title: "clearWatch",
                    content: [
                        "Once you're done tracking the user’s position, clearWatch() can stop the position updates from watchPosition().",
                        "You pass the watch ID to clearWatch() to stop receiving location updates, helping manage resources and prevent unnecessary data collection."
                    ]
                },
                2: {
                    title: "Example Usage",
                    content: [
                        "const id = navigator.geolocation.watchPosition(success, error, options)",
                        "navigator.geolocation.clearWatch(id)"
                    ]
                }
            },
            image: "geo-3.jpg",
            video: ""
        },
        3: {
            title: "Geolocation API: Options",
            content: {
                0: {
                    title: "Using Options with Geolocation Methods",
                    content: [
                        "The Geolocation API allows you to pass an optional options object when using methods like getCurrentPosition() and watchPosition(). This object helps you customize how the geolocation request behaves.",
                        "You can set the following options: enableHighAccuracy, timeout, and maximumAge."
                    ]
                },
                1: {
                    title: "Options Breakdown",
                    content: [
                        "enableHighAccuracy: When set to true, the API gives preference to more precise methods such as GPS, Wi-Fi, and Bluetooth to determine your location. If set to false, it prioritizes faster, less accurate methods like IP address geolocation or cell tower triangulation.",
                        "timeout: Specifies the maximum time (in milliseconds) to wait for the location before an error is triggered.",
                        "maximumAge: Specifies the maximum age (in milliseconds) of a cached location that is acceptable."
                    ]
                },
                2: {
                    title: "Example Usage",
                    content: [
                        "const options = {",
                        "   enableHighAccuracy: true,",
                        "   timeout: 5000,",
                        "   maximumAge: 0",
                        "}",
                        "navigator.geolocation.getCurrentPosition(success, error, options)",
                    ]
                }
            },
            image: "geo-2.avif",
            video: ""
        }
    },
    1: {
        0: {
            title: "APIs",
            content: {
                0: {
                    title: "What is an API?",
                    content: ["Application Programming Interface", "Allows easy communication between applications", "Many uses, but we will go over only a couple of them"]
                }
            },
            image: "confused.jpg",
            video: ""
        },
        1: {
            title: "API Fetch",
            content: {
                0: {
                    title: "What is Fetch?",
                    content: ["Retrieve data using API", "Returns data in JSON format", "An easy way to access information from an API"]
                }
            },
            image: "json.png",
            video: ""
        },
        2: {
            title: "API Fetch",
            content: {
                0: {
                    title: "Public APIs to use",
                    content: ["https://github.com/public-apis/public-apis", "Detailed documentation and how to use instructions", "API Keys", "HTTPS and CORS", "JSON Formatter Extention"]
                }
            },
            image: "server.jpg",
            video: ""
        },
        3: {
            title: "API Fetch",
            content: {
                0: {
                    title: "Code Along and Demo!",
                    content: ["https://api.nasa.gov/EPIC/archive/natural/2019/05/30/png/epic_1b_20190530011359.png?api_key=DEMO_KEY", "Feel free to follow allong or just watch", "Using API Fetch to grab an image of the earth"]
                }
            },
            image: "earth.png",
            video: ""
        },
    }
}

view.addEventListener('click', submitPresentation);
document.addEventListener('keydown', keyDown);

function submitPresentation(event) {
    event.preventDefault();
    currentSlide = 0;
    currentPresentation = selection.value;
    if (presentationData[currentPresentation] !== undefined) {
        present(currentSlide);
        presentationContainer.requestFullscreen()
            .then(response => response)
            .catch(error => console.error(error));
    }
}

function keyDown(event) {
    switch (event.key) {
        case ("ArrowRight"): nextSlideClick(); break;
        case ("ArrowLeft"): lastSlideClick(); break;
    }
}

function present(value) {
    let slide = presentationData[currentPresentation][value];

    presentation.innerHTML = `
        <h1>${slide.title}</h1>
        <div class="flex w-full flex-row-sm items-center justify-between"><div></div></div>
    `;
    let g = presentation.lastElementChild;

    // add all content (with more specific titling) paragraph
    for (const i in slide.content) {
        let lContent = slide.content[i];
        let q = presentation.lastElementChild.firstElementChild;

        q.innerHTML += `<h2>${lContent.title}</h2>`;

        for (const p in lContent.content) q.innerHTML += `<p>${lContent.content[p]}</p>`;
    }
    if (slide.image.length > 0) g.innerHTML += `<img alt="Presentation Image" src="images/${slide.image}">`;
    if (slide.video.length > 0) g.innerHTML += `<video src="videos/${slide.video}"></video>`;
}

function nextSlideClick() {
    if (presentationData[currentPresentation][currentSlide + 1] !== undefined) present(currentSlide += 1);
}
function lastSlideClick() {
    if (presentationData[currentPresentation][currentSlide - 1] !== undefined) present(currentSlide -= 1);
}