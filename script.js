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

// JavaScript
async function getFileSize(owner, repo, path, branch = 'main') {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`);
    const data = await response.json();
    const size = data.size;
    console.log(`Filesize for ${path}: ${size} bytes`);
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

document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 1000);

    updateFilesize();

    text = document.getElementById("typewriter-source").innerHTML
    typeWriter();
});