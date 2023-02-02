const url = "https://travela.magnuspladsen.no/wp-json/wp/v2/posts?_embed";

const postsContainer = document.querySelector(".posts-container");

function dateFormatter(string) {
  return string.substring(0, 10);
}

function getShortText(string) {
  const newString = removeTags(string);
  return newString.substring(0, 110) + "...";
}

// removes the <p> tags from the excerpt
function removeTags(string) {
  return string.substring(3, string.length - 5);
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

  for (let i = 0; i < 5; i++) {
    const post = posts[i];
    postsContainer.innerHTML += `
    <a href="post.html?id=${post.id}" class="post-link">
      <div class="post-container">

        <img
          class="post-img"
          src="${
            post._embedded["wp:featuredmedia"][0].media_details.sizes.medium
              .source_url
          }"
          alt="image of Bali"
        />
        <div class="post-all-text-container">
          <h2 class="post-title">${post.title.rendered}</h2>
          <div class="post-info-container">
            <p class="post-author">By ${post._embedded.author[0].name}</p><p>-</p>
            <p class="post-date">${dateFormatter(post.date)}</p>
            <p>-</p>
            <p class="post-category">${post._embedded["wp:term"][0][0].name}</p>
          </div>
          <p class="post-text">${getShortText(post.excerpt.rendered)}</p>
          <p class="posts-readmore">Click to read more</p>
        </div>
      </div>
    </a>`;
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
