import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

function createShareIconSVG() {
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('viewBox', '0 0 24 24');
    svgElement.innerHTML = `<path d="M20,21H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8A1,1,0,0,1,8,6H4V19H20V13a1,1,0,0,1,2,0v6A2,2,0,0,1,20,21Z"/><path xmlns="http://www.w3.org/2000/svg" d="M21.62,6.22l-5-4a1,1,0,0,0-1.05-.12A1,1,0,0,0,15,3V4.19a9.79,9.79,0,0,0-7,7.65,1,1,0,0,0,.62,1.09A1,1,0,0,0,9,13a1,1,0,0,0,.83-.45C11,10.78,13.58,10.24,15,10.07V11a1,1,0,0,0,.57.9,1,1,0,0,0,1.05-.12l5-4a1,1,0,0,0,0-1.56Z"/>`;
    return svgElement;
}

function createDeleteIconSVG() {
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('viewBox', '0 0 24 24');
    svgElement.innerHTML = `<path d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z" />`
    return svgElement;
}

function createEditIconSVG() {
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('viewBox', '0 0 24 24');
    svgElement.innerHTML = `<g id="style=fill">
    <g id="edit">
        <path id="Subtract" fill-rule="evenodd" clip-rule="evenodd"
            d="M18.9405 3.12087L21.0618 5.24219C22.2334 6.41376 22.2334 8.31326 21.0618 9.48483L19.2586 11.288L12.8947 4.92403L14.6978 3.12087C15.8694 1.94929 17.7689 1.94929 18.9405 3.12087ZM11.834 5.98469L3.70656 14.1121C3.22329 14.5954 2.91952 15.2292 2.84552 15.9086L2.45151 19.5264C2.31313 20.7969 3.38571 21.8695 4.65629 21.7311L8.27401 21.3371C8.95345 21.2631 9.58725 20.9594 10.0705 20.4761L18.1979 12.3486L11.834 5.98469Z"/>
    </g>
</g>`;
    return svgElement;
}

function buildImagePost(post) {
    const postContainer = document.createElement('div');
    postContainer.classList.add('post', 'image-post');

    const imageElement = document.createElement('img');
    imageElement.src = post.thumbnail;
    imageElement.alt = post.title;

    const titleElement = document.createElement('h1');
    titleElement.textContent = post.title;

    postContainer.appendChild(titleElement);
    postContainer.appendChild(imageElement);

    const interactionContainer = document.createElement('div');
    interactionContainer.classList.add('interaction-container');
    postContainer.appendChild(interactionContainer);

    return postContainer;
}

function buildArticlePost(post) {
    const postContainer = document.createElement('div');
    postContainer.classList.add('post', 'article-post');

    const titleElement = document.createElement('h1');
    titleElement.textContent = post.title;

    const lineBreak = document.createElement('hr');
    postContainer.appendChild(lineBreak);

    const contentElement = document.createElement('div');
    contentElement.innerHTML = marked(post.content);

    postContainer.appendChild(titleElement);
    if (post.thumbnail) {
        const imageElement = document.createElement('img');
        imageElement.src = post.thumbnail;
        imageElement.alt = post.title;
        postContainer.appendChild(imageElement);
    }
    if (post.description) {
        const descriptionElement = document.createElement('h2');
        descriptionElement.textContent = post.description;
        postContainer.appendChild(descriptionElement);
    }
    postContainer.appendChild(lineBreak);
    postContainer.appendChild(contentElement);

    const interactionContainer = document.createElement('div');
    interactionContainer.classList.add('interaction-container');

    const readingTime = estimateReadingTime(post.content);
    const readingTimeElement = document.createElement('span');
    readingTimeElement.classList.add('reading-time');
    readingTimeElement.textContent = `estimated reading time: ${readingTime} min`;
    interactionContainer.appendChild(readingTimeElement);

    postContainer.appendChild(interactionContainer);

    return postContainer;
}

function buildMicroblogPost(post) {
    const postContainer = document.createElement('div');
    postContainer.classList.add('post', 'microblog-post');

    const contentElement = document.createElement('div');
    contentElement.innerHTML = marked(post.content);

    postContainer.appendChild(contentElement);

    const interactionContainer = document.createElement('div');
    interactionContainer.classList.add('interaction-container');
    postContainer.appendChild(interactionContainer);

    return postContainer;
}

function estimateReadingTime(content) {
    const wordsPerMinute = 200;
    const textLength = content.split(' ').length;
    return Math.ceil(textLength / wordsPerMinute);
}

function addRating(post) {
    const ratingContainer = document.createElement('div');
    ratingContainer.classList.add('rating-container');

    const ratingButton = document.createElement('button');
    ratingButton.classList.add('rating-button');
    ratingButton.textContent = "+" + post.rating;

    ratingButton.addEventListener('click', async (event) => {
        try {
            const response = await fetch(`/api/posts/${post.id}/rate`, {
                method: 'POST',
            });
            const data = await response.json();
            if (data.message.includes('successfully')) {
                ratingButton.textContent = "+" + (parseInt(ratingButton.textContent.substring(1)) + 1);
            } else {
                console.error('Error rating post:', data);
            }
        } catch (error) {
            console.error('Error rating post:', error);
        }

        ratingButton.disabled = true;
    });

    ratingContainer.appendChild(ratingButton);

    return ratingContainer;
}

function addId(post) {
    const idElement = document.createElement('div');
    idElement.classList.add('post-id');
    const idText = document.createElement('span');
    idText.textContent = "#" + post.id;
    idElement.appendChild(idText);

    return idElement;
}

function addDateTimestamp(post) {
    const dateElement = document.createElement('div');
    dateElement.classList.add('post-date');
    const dateText = document.createElement('span');
    dateText.textContent = post.date;
    dateElement.appendChild(dateText);

    return dateElement;
}

function addShare(post) {
    const shareContainer = document.createElement('div');
    shareContainer.classList.add('share-container');

    const shareButton = document.createElement('button');
    shareButton.classList.add('share-button');


    const shareIcon = createShareIconSVG();
    shareButton.appendChild(shareIcon);

    shareButton.addEventListener('click', (event) => {
        window.location.href = `/article.html?id=${post.id}`;
    });

    shareContainer.appendChild(shareButton);

    return shareContainer;
}

function addDelete(post) {
    const deleteContainer = document.createElement('div');
    deleteContainer.classList.add('delete-container');

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');

    const deleteIcon = createDeleteIconSVG();
    deleteButton.appendChild(deleteIcon);

    deleteButton.addEventListener('click', async (event) => {
        // Ask for password before deleting post
        const password = prompt('Please enter your password to delete this post:');

        try {
            const response = await fetch(`/api/posts/${post.id}`, {
                method: 'DELETE',
                headers: {
                    'password': password
                },
            });
            const data = await response.json();
            if (data.message.includes('successfully')) {
                window.location.reload();
            } else {
                console.error('Error deleting post:', data);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }

        deleteButton.disabled = true;
    });

    deleteContainer.appendChild(deleteButton);

    return deleteContainer;
}

function addEdit(post) {
    const editContainer = document.createElement('div');
    editContainer.classList.add('edit-container');

    const editButton = document.createElement('button');
    editButton.classList.add('edit-button');

    const editIcon = createEditIconSVG();
    editButton.appendChild(editIcon);

    editButton.addEventListener('click', (event) => {
        window.location.href = `/edit.html?id=${post.id}`;
    }); // TODO: add edit page

    editContainer.appendChild(editButton);

    return editContainer;
}

async function fetchPosts() {
    let type = 'all';
    const feedContainer = document.getElementById('feed-container');

    if (feedContainer.classList.contains('image-feed')) {
        type = 'image';
    } else if (feedContainer.classList.contains('article-feed')) {
        type = 'article';
    } else if (feedContainer.classList.contains('microblog-feed')) {
        type = 'microblog';
    }

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    try {
        let posts;
        if (!postId) {
            const response = await fetch('/api/posts');
            posts = await response.json();
        } else {
            const response = await fetch(`/api/posts/${postId}`);
            const post = await response.json();
            posts = [post];
        }

        if (!posts || posts.length === 0) {
            feedContainer.classList.add('invisible');
            return;
        }

        posts.forEach(post => {
            let postContainer;
            if (post.type === 'image' && (type === 'all' || type === 'image')) {
                postContainer = buildImagePost(post);
            } else if (post.type === 'article' && (type === 'all' || type === 'article')) {
                postContainer = buildArticlePost(post);
            } else if (post.type === 'microblog' && (type === 'all' || type === 'microblog')) {
                postContainer = buildMicroblogPost(post);
            }

            if (postContainer) {
                const rating = addRating(post);
                postContainer.appendChild(rating);

                const idElement = addId(post);
                postContainer.appendChild(idElement);

                const dateElement = addDateTimestamp(post);
                postContainer.appendChild(dateElement);

                if (window.location.pathname.includes('admin.html')) {
                    const deleteButton = addDelete(post);
                    postContainer.querySelector('.interaction-container').appendChild(deleteButton);

                    const editButton = addEdit(post);
                    postContainer.querySelector('.interaction-container').appendChild(editButton);
                }

                const share = addShare(post);
                postContainer.querySelector('.interaction-container').appendChild(share);

                feedContainer.appendChild(postContainer);
            }
        });

    } catch (error) {
        feedContainer.classList.add('invisible');
        console.error('Error fetching posts:', error);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    fetchPosts();
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('new-post-form');
    if (form) {
        function previewPost(post) {
            let postContainer;
            if (post.type === 'image') {
                postContainer = buildImagePost(post);
            } else if (post.type === 'article') {
                postContainer = buildArticlePost(post);
            } else if (post.type === 'microblog') {
                postContainer = buildMicroblogPost(post);
            }

            if (postContainer) {
                const previewContainer = document.getElementById('preview-container');
                previewContainer.innerHTML = '';
                previewContainer.appendChild(postContainer);
            }
        }

        const form = document.getElementById('new-post-form');
        const postTypeSelector = document.getElementById('post-type');
        const titleInput = document.getElementById('title');
        const thumbnailInput = document.getElementById('thumbnail');
        const descriptionInput = document.getElementById('description');
        const contentInput = document.getElementById('content');

        form.addEventListener('input', (event) => {
            const postData = {
                type: postTypeSelector.value,
                title: titleInput.value,
                thumbnail: thumbnailInput.value,
                description: descriptionInput.value,
                content: contentInput.value
            };
            previewPost(postData);
        });
    }
});
