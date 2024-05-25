let text = "";
let index = 0;
let scrollArrowMaxHeight = 0;

const speed = 30; // Speed of the typing
const username = 'micr0-dev'; // GitHub username

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
    const files = ['index.html', 'style.css', 'script.js']; // Files to get the size of

    const repo = 'micr0.dev'; // Repository to get the files from

    let totalSize = 0;

    for (const file of files) {
        const size = await getFileSize(username, repo, file);
        totalSize += size;
    }

    const filesizeElement = document.createElement('span');
    filesizeElement.innerText = `Source Filesize: ${(totalSize / 1024).toFixed(2)} KB`;
    filesizeElement.style.opacity = '0';

    document.getElementById('filesize').appendChild(filesizeElement);

    setTimeout(() => {
        filesizeElement.style.transition = 'opacity 1s';
        filesizeElement.style.opacity = '1';
    }, 100);
}

// Use the canvas to get the average color of the avatar for glow effect ^^
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const image = new Image();

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

function toggleScrollArrow() {
    const scrollArrow = document.getElementById('scroll-arrow');
    const aboutContainer = document.getElementById('about-container');

    if (scrollArrowMaxHeight < scrollArrow.offsetHeight) {
        scrollArrowMaxHeight = scrollArrow.offsetHeight;
    }

    if ((window.innerHeight - 563) / 2 > scrollArrowMaxHeight + 40) { // this makes no sense i give up, just hardcoding it
        scrollArrow.style.display = 'block';
    } else {
        scrollArrow.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', toggleScrollArrow);
window.addEventListener('resize', toggleScrollArrow);


function scrollToContent() {
    document.querySelector('.additional-content').scrollIntoView({ behavior: 'smooth' });
}

// Fetch most starred repositories
async function fetchMostStarredRepos() {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=50`);
    const repos = await response.json();
    return repos;
}

// Create project cards
function createProjectCards(repos) {
    const projectsContainer = document.getElementById('projects-container');
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count); // Sort by stars
    repos = repos.filter(repo => repo.description !== null);

    repos = repos.slice(0, 5);
    repos.forEach(repo => {
        const card = document.createElement('div');
        card.classList.add('project-card');
        // make the card clickable
        card.addEventListener('click', () => {
            window.open(repo.html_url, '_blank');
        });

        card.innerHTML = `
            <h2>${repo.name}</h2>
            <p>${repo.description}</p>
            <p class="stars">&#9733; ${repo.stargazers_count}</p>
        `;
        projectsContainer.appendChild(card);
    });
}

// Initialize
async function githubProjects() {
    const repos = await fetchMostStarredRepos();
    createProjectCards(repos);
}

document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 1000);

    updateFilesize();

    text = document.getElementById("typewriter-source").innerHTML
    typeWriter();
});

document.addEventListener('DOMContentLoaded', githubProjects);