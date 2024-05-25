// JavaScript
let text = "";
let index = 0;
const speed = 30; // Speed of the typing

function typeWriter() {
    if (index < text.length) {
        const newText = document.getElementById("typewriter-text").innerHTML.substring(0, index + 1) + text[index];
        document.getElementById("typewriter-text").innerHTML = newText + '<span class="cursor">|</span>';
        index++;
        const newSourceText = document.getElementById("typewriter-source").innerHTML.substring(1);
        document.getElementById("typewriter-source").innerHTML = newSourceText;
        setTimeout(typeWriter, speed);
    }
}

function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('clock').innerText = `${hours}:${minutes}:${seconds}`;
}

async function getFileSize(owner, repo, path, branch = 'main') {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`);
    const data = await response.json();
    const size = data.size;
    return size;
}

async function updateFilesize() {
    const files = ['index.html', 'style.css', 'script.js'];

    const owner = 'micr0-dev';
    const repo = 'micr0.dev';

    let totalSize = 0;

    for (const file of files) {
        const size = await getFileSize(owner, repo, file);
        totalSize += size;
    }

    document.getElementById('filesize').innerText = `Source Filesize: ${(totalSize / 1024).toFixed(2)} KB`;
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const image = new Image();

// Set the source of the image
image.crossOrigin = "Anonymous"; // Enable cross-origin requests
image.src = 'https://avatars.githubusercontent.com/u/26364458?v=4';


// When the image is loaded, draw it on the canvas
image.onload = function () {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Get the image data from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Calculate the average color of the image
    let totalR = 0, totalG = 0, totalB = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
        totalR += imageData.data[i];
        totalG += imageData.data[i + 1];
        totalB += imageData.data[i + 2];
    }
    const avgR = Math.round(totalR / (imageData.data.length / 4));
    const avgG = Math.round(totalG / (imageData.data.length / 4));
    const avgB = Math.round(totalB / (imageData.data.length / 4));

    // Set the glow color based on the average color of the image
    const glowColor = `rgba(${avgR}, ${avgG}, ${avgB}, 0.4)`;

    // Apply the glow effect to the profile picture
    const profilePicture = document.getElementById('avatar');
    profilePicture.style.filter = `drop-shadow(0 0 20px ${glowColor})`;
};


document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 1000);

    updateFilesize();

    text = document.getElementById("typewriter-source").innerHTML
    typeWriter();
});