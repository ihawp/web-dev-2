const display = document.getElementById("artworks");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("search");

async function getData(search) {
  loading.style.display = "block";
  let page = 1;
  let pageObjects = [];
  display.innerHTML = "<h2>Harvard Art Museum</h2>";
  while (pageObjects.length < 10) {
    let url = `https://api.harvardartmuseums.org/object?hasImage=1&apikey=7cad05e6-2d24-47b5-b848-2726dc6b19e9&page=${page}&keyword=${search}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const artRecords = (await response.json()).records;
      artRecords.forEach((artwork) => {
        if (artwork.description && artwork.primaryimageurl) {
          pageObjects.push(artwork);
          // display.innerHTML += `<article class='item'>
          //                       <h3>${artwork.title}</h3>
          //                       <img class="item-image" src="${
          //                         artwork.primaryimageurl
          //                       }" alt="${artwork.division}"></img>
          //                       <a href='${artwork.url}'>Link to Page</a>
          //                       <p>Artist/Related Persons: ${
          //                         artwork.people
          //                           ? artwork.people[0].displayname
          //                           : "no people listed"
          //                       } (${artwork.people 
          //                         ? artwork.people[0].role 
          //                         : "NA"})</p>
          //                       </article>`;
        }
      });
    } catch (error) {
      console.error(error.message);
    }
    page++;
  }
  pageObjects.forEach(function(artwork) {
    display.innerHTML += `<article class='item'>
    <h3>${artwork.title}</h3>
    <img class="item-image" src="${
      artwork.primaryimageurl
    }" alt="${artwork.division}"></img>
    <a href='${artwork.url}'>Link to Page</a>
    <p>Artist/Related Persons: ${
      artwork.people
        ? artwork.people[0].displayname
        : "no people listed"
    } (${artwork.people 
      ? artwork.people[0].role 
      : "NA"})</p>
    </article>`;
  })

  loading.style.display = "none";
}

searchInput.addEventListener("keydown", function (event) {
  if (event.key == "Backspace") {
    getData(searchInput.value.substring(0, searchInput.value.length - 1));
  } else {
    getData(searchInput.value + event.key);
  }
});

getData("");
