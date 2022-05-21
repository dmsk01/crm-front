Array.from(document.querySelectorAll('input[type="text"]')).forEach((input) => {
  input.setAttribute("onkeypress", "return /[0-9a-zA-Z]/i.test(event.key)");
});
