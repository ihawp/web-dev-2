let currentPresentation = 0;
let currentSlide;
const presentationContainer = document.getElementById('presentation-container');
const selection = document.getElementById('selection');
const view = document.getElementById('view');
const presentation = document.getElementById("presentation");







view.addEventListener("click", submitPresentation);
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
    if (event.key === "ArrowRight") {
        nextSlideClick();
    } else if (event.key === "ArrowLeft") {
        lastSlideClick();
    }
}

const presentationData = {
    0: {
        0: {
            title: "Geolocation API",
            content: {
                0: {
                    title: "What is an API?",
                    content: ["Application Programming Interface.", "Essentially, "]
                },
                1: {
                    title: "Any practical uses?",
                    content: ["The Geolocation API allows any user (that is running JavaScript) to give the browser access to their current location allowing for more dynamic functionality of the given app."]
                }
            },
            image: "discord.jpg",
            video: ""
        },
        1: {
            title: "Any practical use cases?",
            content: {
                0: {
                    title: "",
                    content: ["this is some first instance content", "this is some content"]
                }
            },
            image: "discord.jpg",
            video: ""
        },
        2: {
            title: "The Geolocation API is awesome!",
            content: {
                0: {
                    title: "",
                    content: ["this is some first instance content", "this is some content"]
                }
            },
            image: "discord.jpg",
            video: ""
        }
    },
    1: {
        0: {
            title: "The Geolocation API is awesome!",
            content: {
                0: {
                    title: "This is the title for fetch!",
                    content: ["this is some first instance content", "this is some content"]
                }
            },
            image: "discord.jpg",
            video: ""
        },
        1: {
            title: "The Geolocation API is awesome!",
            content: {
                0: {
                    title: "",
                    content: ["this is some first instance content", "this is some content"]
                }
            },
            image: "discord.jpg",
            video: ""
        },
        2: {
            title: "The Geolocation API is awesome!",
            content: {
                0: {
                    title: "",
                    content: ["this is some first instance content", "this is some content"]
                }
            },
            image: "discord.jpg",
            video: ""
        }
    }
}

function present(value) {
    let l = presentationData[currentPresentation][value];

    presentation.innerHTML = `
        <h1>${l.title}</h1>
        <div class="flex w-full flex-row-sm items-center justify-between"><div></div></div>
    `;

    // add all content (with more specific titling) paragraph
    for (const i in l.content) {
        let lContent = l.content[i];
        presentation.lastElementChild.firstElementChild.innerHTML += `<h2>${lContent.title}</h2>`;
        for (const q in lContent.content) presentation.lastElementChild.firstElementChild.innerHTML += `<p>${lContent.content[q]}</p></br>`;
    }
    if (l.image.length > 0) {
        presentation.lastElementChild.innerHTML += `<img alt="Presentation Image" src="images/${presentationData[currentPresentation][value].image}">`;
    }
    if (l.video.length > 0) {
        presentation.lastElementChild.innerHTML += `
            <video src="videos/${l.video}"></video>
        `;
    }
}

function nextSlideClick() {
    if (presentationData[currentPresentation][currentSlide + 1] !== undefined) {
        present(currentSlide += 1);
    }
}
function lastSlideClick() {
    if (presentationData[currentPresentation][currentSlide - 1] !== undefined) {
        present(currentSlide -= 1);
    }
}