const navButton = document.querySelector("#nav-button");
const dropDown = document.querySelector("#drop-down");

if (navButton) {
  navButton.addEventListener("click", () => {
    if (dropDown.classList.contains("dropdown-hidden")) {
      dropDown.classList.remove("dropdown-hidden");
      dropDown.classList.add("dropdown-show");
    } else {
      dropDown.classList.add("dropdown-hidden");
      dropDown.classList.remove("dropdown-show");
    }
  });
}
