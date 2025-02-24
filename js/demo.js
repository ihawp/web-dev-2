const content = document.getElementById('content');

async function getDogImage() {
    try {
      const response = await fetch('https://random.dog/woof.json');
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const dog = await response.json();
      content.innerHTML = `<img src="${dog.url}">`
    } catch (error) {
      console.error(error.message);
    }
}

getDogImage();

