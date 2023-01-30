const url = "https://travela.magnuspladsen.no/wp-json/wp/v2/posts?_embed";

const postsContainer = document.querySelector(".posts-container");

function dateFormatter(string) {
    return string.substring(0, 10);
}


// set up loading message in case of slow connection
postsContainer.innerHTML = "Loading...";

async function getPosts() {
  try {
    const response = await fetch(url);
    const posts = await response.json();
    sessionStorage.setItem("posts", JSON.stringify(posts));
    displayPosts(posts);
  } catch (error) {
    console.log(error);
    postsContainer.innerHTML = "Error, please reload the page.";
  }
}

function displayPosts(posts) {
  // remove loading message
  postsContainer.innerHTML = "";

  for (let i = 0; i < 4; i++) {
    const post = posts[i];
    postsContainer.innerHTML += `
          <div class="post-container">
          <h2 class="post-title">${post.title.rendered}</h2>
          <p class="post-date">${dateFormatter(post.date)}</p>
          <img
            class="post-img"
            src="${post._embedded["wp:featuredmedia"][0].media_details.sizes.medium.source_url}"
            alt="image of Bali"
          />
        </div>
          `;
  }
}

// check if posts are in sessionStorage
if (sessionStorage.getItem("posts")) {
  // if so, get them from sessionStorage
  const posts = JSON.parse(sessionStorage.getItem("posts"));

  // check is posts already exist in the DOM
  if (postsContainer) {
    displayPosts(posts);
  }
} else {
  // if not, get them from the API
  getPosts();
  const posts = JSON.parse(sessionStorage.getItem("posts"));
}
