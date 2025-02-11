const pageObjects = [];

async function getData(page) {
  const url = `https://api.harvardartmuseums.org/object?apikey=7cad05e6-2d24-47b5-b848-2726dc6b19e9&page=${page}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const artRecords = (await response.json()).records;

    artRecords.forEach(element => {
        if (element.images.length > 0) {
            console.log(element);
        } else {
            console.log(element.images);
        }
    });

  } catch (error) {
    console.error(error.message);
  }
}

getData(300);