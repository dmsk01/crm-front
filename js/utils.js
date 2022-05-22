Array.from(document.querySelectorAll('input[type="text"]')).forEach((input) => {
  input.setAttribute(
    "onkeypress",
    "return /[0-9a-zA-Zа-яА-Я]/i.test(event.key)"
  );
});
