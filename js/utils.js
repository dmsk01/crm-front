Array.from(document.querySelectorAll('input[type="text"]')).forEach((input) => {
  input.setAttribute(
    "onkeypress",
    "return /[0-9a-zA-Zа-яА-Я]/i.test(event.key)"
  );
});

function clearContainer(container) {
  // container.innerHTML = '';
  let child = container.lastElementChild;
  while (child) {
    container.removeChild(child);
    child = container.lastElementChild;
  }
}

function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function convertTime(isoDate) {
  return new Date(isoDate).toLocaleDateString("ru", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sortList(clientsList, prop, isReverseOrder = false) {
  return clientsList.sort((a, b) => {
    if (!isReverseOrder ? a[prop] < b[prop] : a[prop] > b[prop]) return -1;
  });
}

export { clearContainer, debounce, convertTime, sortList };
