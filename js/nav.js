const navButton = document.querySelector("#nav-button");
const dropDown = document.querySelector("#drop-down");


if (navButton) {
  navButton.addEventListener("click", () => {
    if (dropDown.classList.contains("hidden")) {
      dropDown.classList.remove("hidden");
    }
    else {
      dropDown.classList.add("hidden");
    }

  });
}
