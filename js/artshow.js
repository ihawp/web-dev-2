// API Key for harvard art museum
const apiKey = "7cad05e6-2d24-47b5-b848-2726dc6b19e9";

// Grabbing elements from the page
const display = document.getElementById("artworks");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("search");

// Array containing and tracking art objects on the page
let pageObjects = [];

// Function that gets and parses json data from the harvard art museum API
async function getData(search) {
  loading.style.display = "block";
  let page = 1;
  pageObjects = [];
  display.innerHTML = "<h2>Harvard Art Museum</h2>";

  // While loop that will continue until the page has at least 10 art objects
  // with images.
  while (pageObjects.length < 10) {
    let url = `https://api.harvardartmuseums.org/object?hasImage=1&apikey=${apiKey}&page=${page}&keyword=${search}&size=100`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const artRecords = (await response.json()).records;
      artRecords.forEach((artwork) => {
        if (
          artwork.primaryimageurl &&
          !pageObjects.includes(artwork) &&
          pageObjects.length < 10
        ) {
          pageObjects.push(artwork);
          display.innerHTML += `<article class='item'>
                                <img class="item-image" loading="lazy" src="${
                                  artwork.primaryimageurl
                                }" alt="${artwork.division}"></img>
                                <div class="item-description">
                                  <h3>${artwork.title}</h3>
                                  <p>Artist/Related Persons: ${
                                    artwork.people
                                      ? artwork.people[0].displayname
                                      : "no people listed"
                                  } (${
                                    artwork.people 
                                      ? artwork.people[0].role 
                                      : "NA"
                                  })</p>
                                  <p>Classification: ${
                                    artwork.classification
                                  }</p>
                                  <p>Technique: ${
                                    artwork.technique
                                      ? artwork.technique
                                      : "Not recorded"
                                  }</p>
                                  <a href='${artwork.url}'>Link to Page</a>
                                </div>
                                </article>`;
        }
      });
    } catch (error) {
      console.error(error.message);
    }
    page++;
  }
  loading.style.display = "none";
}

// Searches as the user types on the search bar
searchInput.addEventListener("keyup", function (event) {
  getData(searchInput.value);
});

// Initial Search
getData("");

/* 

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
    image: "json.jpg",
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
            content: ["https://random.dog/woof.json", "Feel free to follow allong or just watch", "Using API Fetch to grab a dog image"]
        }
    },
    image: "random-dog.png",
    video: ""
},


*/
