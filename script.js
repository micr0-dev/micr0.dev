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
    if (!response.ok) {
        throw new Error(`Failed to fetch file size: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const size = data.size;
    return size;
}

async function updateFilesize() {
    const files = ['index.html', 'style.css', 'script.js', 'background.js']; // Files to get the size of

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
    // handle errors
    if (!response.ok) {
        throw new Error(`Failed to fetch repositories: ${response.status} ${response.statusText}`);
    }
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
    // display error if fetch fails
    if (!repos) {
        const error = document.createElement('div');
        error.classList.add('project-card');
        error.innerText = 'Failed to fetch projects';
        document.getElementById('projects-container').appendChild(error);
        return;
    }

    createProjectCards(repos);
}

document.addEventListener('DOMContentLoaded', () => {
    // Enable dark mode


    updateTime();
    setInterval(updateTime, 1000);

    updateFilesize();

    text = document.getElementById("typewriter-source").innerHTML
    typeWriter();
});

document.addEventListener('DOMContentLoaded', githubProjects);

document.addEventListener('DOMContentLoaded', function () {
    let clickCount = 990;
    let isCompleted = false;
    const avatar = document.getElementById('avatar');
    const counter = document.getElementById('counter');
    const avatarContainer = document.getElementById('avatar-container');
    const purchaseContainer = document.getElementById('purchase-container');
    const buyCursor1Btn = document.getElementById('buy-cursor-1');
    const buyCursor2Btn = document.getElementById('buy-cursor-2');
    const buyCursor3Btn = document.getElementById('buy-cursor-3');
    const buyCursor4Btn = document.getElementById('buy-cursor-4');
    const messageBox = document.getElementById('message-box');

    const cursors = [
        { count: 0, strength: 1, cost: 10, speed: 1, interval: null },
        { count: 0, strength: 7, cost: 50, speed: 2, interval: null },
        { count: 0, strength: 30, cost: 100, speed: 4, interval: null },
        { count: 0, strength: 1000, cost: 1000, speed: 16, interval: null },
    ];

    function updateButtonStates() {
        buyCursor1Btn.disabled = clickCount < 10;
        buyCursor2Btn.disabled = clickCount < 50;
        buyCursor3Btn.disabled = clickCount < 100;
        buyCursor4Btn.disabled = clickCount < 1000;
    }


    function generateParticle(clickValue) {
        const particle = document.createElement('span');
        particle.innerText = `+${clickValue}`;
        particle.classList.add('particle');

        const rect = avatar.getBoundingClientRect();
        const positionX = rect.width * Math.random() + rect.left;
        particle.style.left = `${positionX}px`;
        particle.style.top = `${rect.top}px`;

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }

    function startAutoClick(cursor) {
        if (cursor.interval) {
            clearInterval(cursor.interval);
        }
        cursor.interval = setInterval(() => {
            clickCount += cursor.strength;
            counter.innerText = `Clicks: ${clickCount}`;
            generateParticle(cursor.strength);
            updateButtonStates();

        }, (1000 * cursor.speed) / cursor.count);
    }

    avatar.addEventListener('click', function () {
        clickCount++;
        counter.innerText = `Clicks: ${clickCount}`;
        updateButtonStates();

        avatarContainer.classList.add('shake');
        setTimeout(() => {
            avatarContainer.classList.remove('shake');
        }, 101);

        generateParticle(1);

        if (clickCount === 1) {
            counter.classList.remove('invisible');
        }

        if (clickCount >= 10) {
            purchaseContainer.classList.remove('invisible');
            purchaseContainer.classList.add('visible');
        }
    });

    buyCursor1Btn.addEventListener('click', function () {
        const cursor = cursors[0];

        if (clickCount >= cursor.cost) {
            clickCount -= cursor.cost;
            cursor.count++;
            counter.innerText = `Clicks: ${clickCount}`;
            updateButtonStates();
            startAutoClick(cursor);
        }
    });

    buyCursor2Btn.addEventListener('click', function () {
        const cursor = cursors[1];

        if (clickCount >= cursor.cost) {
            clickCount -= cursor.cost;
            cursor.count++;
            counter.innerText = `Clicks: ${clickCount}`;
            updateButtonStates();
            startAutoClick(cursor);
        }
    });

    buyCursor3Btn.addEventListener('click', function () {
        const cursor = cursors[2];

        if (clickCount >= cursor.cost) {
            clickCount -= cursor.cost;
            cursor.count++;
            counter.innerText = `Clicks: ${clickCount}`;
            updateButtonStates();
            startAutoClick(cursor);
        }
    });

    buyCursor4Btn.addEventListener('click', function () {
        const cursor = cursors[3];

        if (!isCompleted) {
            isCompleted = true;
            messageBox.classList.remove('invisible');
            messageBox.classList.add('visible');
            setTimeout(() => {
                messageBox.classList.add('gone');
            }, 6000);
        }

        if (clickCount >= cursor.cost) {
            clickCount -= cursor.cost;
            cursor.count++;
            counter.innerText = `Clicks: ${clickCount}`;
            updateButtonStates();
            startAutoClick(cursor);
        }
    });

    updateButtonStates();

});