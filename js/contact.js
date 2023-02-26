// url to the contact form API
const contactURL =
  "https://travela.magnuspladsen.no/wp-json/contact-form-7/v1/contact-forms/96/feedback";

// Selecting the form elements
const nameInput = document.querySelector("#your-name");
const nameError = document.querySelector("#name-error");
const emailInput = document.querySelector("#your-email");
const emailError = document.querySelector("#email-error");
const messageInput = document.querySelector("#your-message");
const messageError = document.querySelector("#message-error");
const subjectInput = document.querySelector("#your-subject");
const subjectError = document.querySelector("#subject-error");
const form = document.querySelector("#contact-form");

// Function to post the form data to the API
function postMessageToAPI(data) {
  fetch(contactURL, {
    method: "POST",
    body: data,
  });
}

// Function to check lenght of input
function checkLength(value, len) {
  if (value.trim().length > len) {
    return true;
  } else {
    return false;
  }
}

// Function to validate email
function validateEmail(email) {
  const regEx = /\S+@\S+\.\S+/;
  const patternMatches = regEx.test(email);
  return patternMatches;
}

// Function to validate the form
function validateForm(event) {
  event.preventDefault();

  if (checkLength(nameInput.value, 5) === true) {
    nameError.style.display = "none";
  } else {
    nameError.style.display = "block";
    nameInput.style.border = "1px solid red";
  }

  if (checkLength(messageInput.value, 10) === true) {
    messageError.style.display = "none";
  } else {
    messageError.style.display = "block";
    messageInput.style.border = "1px solid red";
  }

  if (validateEmail(emailInput.value) === true) {
    emailError.style.display = "none";
  } else {
    emailError.style.display = "block";
    emailInput.style.border = "1px solid red";
  }
  if (checkLength(subjectInput.value, 15) === true) {
    subjectError.style.display = "none";
  } else {
    subjectError.style.display = "block";
    subjectInput.style.border = "1px solid red";
  }

  if (
    checkLength(nameInput.value, 1) === true &&
    checkLength(messageInput.value, 10) === true &&
    checkLength(subjectInput.value, 15) === true &&
    validateEmail(emailInput.value) === true
  ) {
    postMessageToAPI(new FormData(form));
    form.innerHTML = `<div class="form-success">
    <h2 class="">Thank you for your message!</h2>
    <p>We will get back to you as soon as possible.</p>
    </div>`;
  }
}

form.addEventListener("submit", validateForm);
