document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("searchBtn");

    searchBtn.addEventListener("click", () => {
        const username = document.getElementById("username").value.trim();
        if (!username) {
            alert("Please enter a GitHub username");
            return;
        }
        fetchFollowers(username, 1, true);
    });
});

async function fetchFollowers(username, page = 1, clearPrevious = false) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/followers?per_page=100&page=${page}`);
        
        if (!response.ok) {
            throw new Error("User not found or rate limited");
        }

        const followers = await response.json();
        displayFollowers(followers, username, page, clearPrevious);

    } catch (error) {
        alert(error.message);
    }
}

function displayFollowers(followers, username, page, clearPrevious) {
    const followersContainer = document.getElementById("followers");

    if (clearPrevious) {
        followersContainer.innerHTML = "";
    }

    if (followers.length === 0 && page === 1) {
        followersContainer.innerHTML = "<p>No followers found</p>";
        return;
    }

    followers.forEach(follower => {
        const followerCard = document.createElement("div");
        followerCard.classList.add("follower");
        followerCard.innerHTML = `
            <a href="${follower.html_url}" target="_blank">
                <img src="${follower.avatar_url}" alt="${follower.login}">
                <p>${follower.login}</p>
            </a>
        `;
        followersContainer.appendChild(followerCard);
    });

    if (followers.length === 100) {
        loadMoreButton(username, page + 1);
    }
}

function loadMoreButton(username, nextPage) {
    const followersContainer = document.getElementById("followers");
    let loadMore = document.getElementById("loadMore");

    if (!loadMore) {
        loadMore = document.createElement("button");
        loadMore.id = "loadMore";
        loadMore.textContent = "Load More Followers";
        loadMore.classList.add("load-more-btn");
        followersContainer.appendChild(loadMore);
    }

    loadMore.onclick = () => {
        fetchFollowers(username, nextPage, false);
        loadMore.remove();
    };
}