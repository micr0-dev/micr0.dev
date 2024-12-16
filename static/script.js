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

document.addEventListener('DOMContentLoaded', () => {
    const sslIndicator = document.getElementById('ssl-indicator');
    const sslIcon = document.getElementById('ssl-icon');
    const sslText = document.getElementById('ssl-text');

    if (window.location.protocol === 'https:') {
        sslText.textContent = 'Secure';
        sslIndicator.classList.add('ssl-secure');
        sslIcon.innerHTML = '<svg><use href="#lock-icon"></use></svg>';
    } else {
        sslText.textContent = 'Insecure';
        sslIndicator.classList.add('ssl-insecure');
        sslIcon.innerHTML = '<svg><use href="#unlock-icon"></use></svg>';
    }
});

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const image = new Image();

image.crossOrigin = "Anonymous";
image.src = 'd8fa3f2c4b09d430.png';

image.onload = function () {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const colorCount = {};
    let maxCount = 0;
    let accentColor = '';

    let totalR = 0, totalG = 0, totalB = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
        totalR += imageData.data[i];
        totalG += imageData.data[i + 1];
        totalB += imageData.data[i + 2];
    }
    const avgR = Math.round(totalR / (imageData.data.length / 4));
    const avgG = Math.round(totalG / (imageData.data.length / 4));
    const avgB = Math.round(totalB / (imageData.data.length / 4));

    const glowColor = `rgba(${avgR}, ${avgG}, ${avgB}, 0.4)`;

    const profilePicture = document.getElementById('avatar');
    profilePicture.style.filter = `drop-shadow(0 0 20px ${glowColor})`;

    // Iterate over each pixel to count color frequencies
    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const color = `rgb(${r},${g},${b})`;

        if (!colorCount[color]) {
            colorCount[color] = 0;
        }
        colorCount[color]++;

        if (colorCount[color] > maxCount) {
            maxCount = colorCount[color];
            accentColor = color;
        }
    }

    // Convert RGB to HSL
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h, s, l];
    }

    // Convert HSL to RGB
    function hslToRgb(h, s, l) {
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    // Adjust color brightness for light and dark modes
    const [r, g, b] = accentColor.match(/\d+/g).map(Number);
    const [h, s, l] = rgbToHsl(r, g, b);

    // Create a style element
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';

    // Check for dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Lighten the color for dark mode
        const [lr, lg, lb] = hslToRgb(h, s * 1.3, l * 1.9);
        const lightAccentColor = `rgb(${lr},${lg},${lb})`;

        // Set CSS variables for dark mode
        document.documentElement.style.setProperty('--primary-color', lightAccentColor);
        document.documentElement.style.setProperty('--highlighted-primary', lightAccentColor);

        styleElement.innerHTML = `
            .container, .textbox, .project - card, #purchase - container, .ssl - secure, .post {
            border: 2px solid ${lightAccentColor};
    }
        .project - card: hover, .post hr {
        border: 2px solid ${lightAccentColor};
    }
        .rating - container button:hover {
        box - shadow: 0 0px 8px ${lightAccentColor} AA;
    }
        .rating - container button:active {
        box - shadow: 0 0px 8px ${lightAccentColor} BB;
    }
        .rating - container button:disabled {
        box - shadow: 0 0px 8px ${lightAccentColor} AA;
    }
    `;
    } else {
        // Darken the color for light mode
        const [dr, dg, db] = hslToRgb(h, s, l * 1.8);
        const darkAccentColor = `rgb(${dr}, ${dg}, ${db})`;

        // Set CSS variables for light mode
        document.documentElement.style.setProperty('--primary-color', darkAccentColor);

        styleElement.innerHTML = `
        .container, .textbox, .project - card, #purchase - container, .ssl - secure, .post {
        border: 2px solid ${darkAccentColor};
}
    .project - card: hover, .post hr {
    border: 2px solid ${darkAccentColor};
}
        .rating - container button:hover {
    box - shadow: 0 0px 8px ${darkAccentColor} AA;
}
        .rating - container button:active {
    box - shadow: 0 0px 8px ${darkAccentColor} BB;
}
        .rating - container button:disabled {
    box - shadow: 0 0px 8px ${darkAccentColor} AA;
}


`;
    }

    // Append the style element to the head
    document.head.appendChild(styleElement);
};


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
    const files = ['static/index.html', 'static/style.css', 'static/script.js', 'static/background.js', 'static/404.html', 'static/posts.js', 'static/admin.html', 'static/article.html', 'backend/main.go', 'backend/models/post.go', 'backend/handlers/posts.go']; // Files to get the size of

    const repo = 'micr0.dev';

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

async function fetchMostStarredRepos() {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=50`);
    if (!response.ok) {
        throw new Error(`Failed to fetch repositories: ${response.status} ${response.statusText}`);
    }
    const repos = await response.json();
    return repos;
}

function createProjectCards(repos) {
    const projectsContainer = document.getElementById('projects-container');
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    repos = repos.filter(repo => repo.description !== null);

    repos = repos.slice(0, 5);
    repos.forEach(repo => {
        const card = document.createElement('div');
        card.classList.add('project-card');
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

async function githubProjects() {
    const repos = await fetchMostStarredRepos();
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
    updateTime();
    setInterval(updateTime, 1000);

    updateFilesize();

    text = document.getElementById("typewriter-source").innerHTML
    typeWriter();
});

document.addEventListener('DOMContentLoaded', githubProjects);

document.addEventListener('DOMContentLoaded', function () {
    let clickCount = 0;
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
            counter.classList.add('visible');
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
