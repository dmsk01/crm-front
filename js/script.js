(() => {
  async function getClients(url) {
    const response = await fetch(url);
    const users = await response.json().then((data) => data);
    return users;
  }

  async function getClient(url, id) {
    const response = await fetch(`${url}/${id}`);
    const user = await response.json().then((data) => data);
    return user;
  }

  async function addClient(url, payload) {
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async function editClient(url, id, newValue) {
    const response = await fetch(`${url}/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ ...newValue }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const user = await response.json().then((data) => data);
    return user;
  }

  async function removeClient(url, id) {
    const response = await fetch(`${url}/${id}`, {
      method: "DELETE",
    });

    if (response.status === 404)
      console.log("Something went wrong. Can't find the record.");
    const data = await response.json().then((data) => data);
    return data;
  }

  async function drawTable() {
    const usersList = await getClients("http://localhost:3000/api/clients");
    if (usersList.length) {
      usersList.forEach((user) => {
        createTalbleLine(user);
      });
    }
  }

  function convertISOTime(isoDate) {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return {
      year,
      month,
      day,
      hours,
      minutes,
    };
  }

  function createSocialLinks(contacts) {
    let contactsList = "";
    for (let contact of contacts) {
      let id;
      const { type, value } = contact;

      switch (type) {
        case "Телефон":
          id = "phone";
          break;
        case "Email":
          id = "mail";
          break;
        case "Facebook":
          id = "fb";
          break;
        case "В контакте":
          id = "vk";
          break;
        default:
          id = "contact";
      }

      const template = `
          <li class="item-body__social-link social-link">
            <a href="${value}" target="_blank" title="${type}: ${value}" data-bs-toggle="tooltip" data-bs-placement="top">
              <svg width=" 16" height="16" viewBox="0 0 16 16" fill="none" >
                <use xlink:href="./img/sprite.svg#${id}"></use>
              </svg>
            </a>
          </li>
        `;
      contactsList += template;
    }
    return contactsList;
  }

  function createContact() {
    const contactLine = document.createElement("div");
    contactLine.classList.add(
      "d-flex",
      "align-content-center",
      "mb-3",
      "contact-line"
    );
    const input = document.createElement("input");
    input.classList.add("form-control", "contact-input");
    const deleteButton = document.createElement("button");
    deleteButton.classList.add(
      "d-flex",
      "justify-content-center",
      "align-items-center",
      "p-2",
      "btn",
      "btn-outline-danger",
      "contact-delete-button"
    );
    deleteButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7">
          <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#F06A4D"/>
        </g>
      </svg>
    `;

    const select = `
      <select class="form-select form-select-sm contact-select" aria-label="contact type select">
        <option selected value="Телефон">Телефон</option>
        <option value="Email">Email</option>
        <option value="Facebook">Facebook</option>
        <option value="В контакте">В контакте</option>
      </select>
    `;
    contactLine.innerHTML = select;
    contactLine.appendChild(input);
    contactLine.appendChild(deleteButton);

    return contactLine;
  }

  function createTalbleLine(user) {
    const tableContainer = document.querySelector(".table-body");
    const tableRow = document.createElement("tr");
    tableRow.classList.add("align-middle");

    const { contacts, id, createdAt, updatedAt, name, surname, lastName } =
      user;
    const contactItems = createSocialLinks(contacts);
    const created = convertISOTime(createdAt);
    const updated = convertISOTime(updatedAt);

    const idCell = document.createElement("td");
    idCell.innerText = id;
    tableRow.appendChild(idCell);

    const nameCell = document.createElement("td");
    nameCell.innerText = `${surname} ${name} ${lastName}`;
    tableRow.appendChild(nameCell);

    const createdCell = document.createElement("td");
    createdCell.innerHTML = `${created.day}.${created.month}.${created.year}<span class="ms-2">${created.hours}:${created.minutes}</span>`;
    tableRow.appendChild(createdCell);

    const updatedCell = document.createElement("td");
    updatedCell.innerHTML = `${updated.day}.${updated.month}.${updated.year}<span class="ms-2">${updated.hours}:${updated.minutes}</span>`;
    tableRow.appendChild(updatedCell);

    const contactsCell = document.createElement("td");
    const contactsList = document.createElement("ul");
    contactsList.classList.add(
      "d-flex",
      "justify-content-start",
      "ps-0",
      "mb-0",
      "contacts-list"
    );
    contactsList.innerHTML = contactItems;
    contactsCell.appendChild(contactsList);
    tableRow.appendChild(contactsCell);

    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.classList.add("button-delete");
    deleteButton.innerHTML = `
      <svg width=" 16" height="16" viewBox="0 0 16 16" fill="none" >
        <use xlink:href="./img/sprite.svg#edit">
        </use>
      </svg>
      <span>Изменить</span>
    `;
    deleteCell.appendChild(deleteButton);
    tableRow.appendChild(deleteCell);

    const editCell = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.setAttribute("type", "button");
    editButton.classList.add("button-edit");
    editButton.innerHTML = `
      <svg width=" 16" height="16" viewBox="0 0 16 16" fill="none" >
        <use xlink:href="./img/sprite.svg#delete">
        </use>
      </svg>
      <span>Удалить</span>
    `;
    
    editCell.appendChild(editButton);
    tableRow.appendChild(editCell);

    deleteButton.addEventListener("click", (e) => {
      console.log("delete client", surname, name);
    });
    editButton.addEventListener("click", (e) => {
      console.log("edit client", surname, name);
    });
    tableContainer.appendChild(tableRow);
  }

  function onClientSave() {
    const form = document.querySelector(".modal-form");
    const data = Object.fromEntries(new FormData(form).entries());
    console.log(data);
  }

  const saveButton = document.querySelector(".form-save-button");
  saveButton.addEventListener("click", onClientSave);

  document
    .querySelector(".table-add-contact")
    .addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      const contact = createContact();
      document.querySelector("#add-contacts-container").appendChild(contact);
    });

  drawTable();
})();
