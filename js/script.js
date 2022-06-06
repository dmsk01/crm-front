import {
  addClient,
  editClient,
  getClients,
  getClientsWithQuery,
  getClient,
  removeClient,
} from "./ajax.js";

import { clearContainer, debounce, convertTime, sortList } from "./utils.js";

const tableContainer = document.querySelector(".table-body");
const addContactButton = document.querySelector(".table-add-contact");
const clientsTableTh = document.querySelectorAll("th[data-prop]");
const saveButton = document.querySelector(".form-save-button");
const searchInput = document.getElementById("search-input");

let sortProp = "surname";
let isSortDirectionReverse = false;
let usersListFromAPI;

function collectDataFromForm(form) {
  const formData = Object.fromEntries(new FormData(form).entries());

  const formContacts = form.querySelectorAll("div.contact-line");
  const clientContacts = [];
  if (formContacts.length > 0) {
    formContacts.forEach((contact) => {
      const [select, input] = Array.from(contact.children);
      const type = select.value;
      const value = input.value;
      clientContacts.push({ type, value });
    });
  }

  return {
    ...formData,
    contacts: clientContacts,
  };
}

async function onClientSave(form) {
  await addClient(
    "http://localhost:3000/api/clients",
    collectDataFromForm(form)
  );

  form.reset();

  initApp();
}

function createSocialLinksList(contacts) {
  const socialList = document.createElement("ul");

  socialList.classList.add(
    "d-flex",
    "justify-content-start",
    "ps-0",
    "mb-0",
    "contacts-list"
  );

  if (Array.isArray(contacts)) {
    for (let contact of contacts) {
      const { type, value } = contact;
      const socialLink = document.createElement("li");
      socialLink.classList.add("social-link");
      let id;

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
            <a href="${value}" target="_blank" title="${type}: ${value}" data-bs-toggle="tooltip" data-bs-placement="top">
              <svg width=" 16" height="16" viewBox="0 0 16 16" fill="none" >
                <use xlink:href="./img/sprite.svg#${id}"></use>
              </svg>
            </a>
          `;
      socialLink.innerHTML = template;
      socialList.appendChild(socialLink);
    }
  }

  return socialList;
}

function createFormContact(contact = {}) {
  const contactLine = document.createElement("div");
  contactLine.classList.add(
    "d-flex",
    "align-content-center",
    "mb-3",
    "contact-line"
  );

  const input = document.createElement("input");
  input.classList.add("form-control", "contact-input");
  input.value = contact.value || "";
  input.required = true;

  const selectOptions = [
    "Телефон",
    "Email",
    "Facebook",
    "В контакте",
    "Другое",
  ];

  const select = document.createElement("select");
  select.classList.add("form-select", "form-select-sm", "contact-select");

  let fragment = document.createDocumentFragment();
  selectOptions.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.innerText = option;
    optionElement.setAttribute("value", option);
    contact.type === option
      ? optionElement.setAttribute("selected", true)
      : null;
    fragment.appendChild(optionElement);
  });

  select.appendChild(fragment);

  input.type = inputType(select.options[select.selectedIndex].text);

  select.addEventListener("change", () => {
    const selectValue = select.options[select.selectedIndex].text;
    input.type = inputType(selectValue);
  });

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
        <g>
          <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#F06A4D"/>
        </g>
      </svg>
    `;

  deleteButton.addEventListener("click", (e) => {
    e.target.closest("div.contact-line").remove();
  });

  contactLine.appendChild(select);
  contactLine.appendChild(input);
  contactLine.appendChild(deleteButton);

  return contactLine;
}

function createFormContacts(arrOfContacts = []) {
  let fragment = document.createDocumentFragment();
  for (let contact of arrOfContacts) {
    const contactElement = createFormContact(contact);
    fragment.appendChild(contactElement);
  }
  return fragment;
}

function inputType(inputType) {
  switch (inputType) {
    case "Телефон":
      return "tel";
    case "Email":
      return "email";
    default:
      return "text";
  }
}

function createTalbleLine(user, { onDelete, onEdit }) {
  const { contacts, id, createdAt, updatedAt, name, surname, lastName } = user;

  const tableRow = document.createElement("tr");
  tableRow.classList.add("align-middle");

  const created = convertTime(createdAt);
  const updated = convertTime(updatedAt);

  const idCell = document.createElement("td");
  idCell.innerText = id;
  tableRow.appendChild(idCell);

  const nameCell = document.createElement("td");
  const nameLink = document.createElement("a");
  nameLink.href = "#" + id;
  nameLink.innerText = `${surname} ${name} ${lastName}`;
  nameCell.appendChild(nameLink);
  tableRow.appendChild(nameCell);

  const createdCell = document.createElement("td");
  createdCell.innerHTML = created;
  tableRow.appendChild(createdCell);

  const updatedCell = document.createElement("td");
  updatedCell.innerHTML = updated;
  tableRow.appendChild(updatedCell);

  const contactsCell = document.createElement("td");
  const contactsSocialList = createSocialLinksList(contacts);

  contactsCell.appendChild(contactsSocialList);
  tableRow.appendChild(contactsCell);

  const deleteCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("type", "button");
  deleteButton.classList.add("button-delete");
  deleteButton.innerHTML = `
      <svg width=" 16" height="16" viewBox="0 0 16 16" fill="none" >
        <use xlink:href="./img/sprite.svg#delete">
        </use>
      </svg>
      <span>Удалить</span>
    `;
  deleteCell.appendChild(deleteButton);
  tableRow.appendChild(deleteCell);

  const editCell = document.createElement("td");
  const editButton = document.createElement("button");
  editButton.setAttribute("type", "button");
  editButton.classList.add("button-edit");
  editButton.innerHTML = `
      <svg width=" 16" height="16" viewBox="0 0 16 16" fill="none" >
        <use xlink:href="./img/sprite.svg#edit">
        </use>
      </svg>
      <span>Изменить</span>
    `;

  editCell.appendChild(editButton);
  tableRow.appendChild(editCell);

  deleteButton.addEventListener("click", (e) => {
    if (confirm("Вы уверены, что хотите удалить пользователя?")) {
      onDelete(e, id);
    }
  });

  editButton.addEventListener("click", (e) => {
    onEdit({ id, name, surname, lastName, contacts });
  });

  return tableRow;
}

function createEditForm() {
  const { id, name, surname, lastName, contacts } = arguments[0];

  const template = `
  <div class="modal fade" id="person-modal" tabindex="-1" aria-labelledby="personModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Изменить данные <span>${
            id || ""
          }</span></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form class="modal-form" name='person-form'>
            <div class="mb-3">
              <label for="recipient-name" class="col-form-label">Имя:</label>
              <input id='name-input' type="text" class="form-control" id="recipient-name" name="name" value="${
                name || ""
              }">
            </div>
            <div class="mb-3">
              <label for="recipient-surname" class="col-form-label">Фамилия:</label>
              <input id='surname-input' type="text" class="form-control" id="recipient-surname" name="surname" value="${
                surname || ""
              }">
            </div>
            <div class="mb-3">
              <label for="recipient-lastname" class="col-form-label">Отчество:</label>
              <input id='lastname-input' type="text" class="form-control" id="recipient-lastname" name="lastName" value="${
                lastName || ""
              }">
            </div>
            <div id="edit-contacts-container" class="mb-3">
            </div>
            <div class="mb-3">
              <button type="button" class="table-add-contact btn btn-outline-primary d-inline-flex align-items-center">
                <svg id='plus' width="16" height="16" viewBox="0 0 16 16" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.99998 4.66683C7.63331 4.66683 7.33331 4.96683 7.33331 5.3335V7.3335H5.33331C4.96665 7.3335 4.66665 7.6335 4.66665 8.00016C4.66665 8.36683 4.96665 8.66683 5.33331 8.66683H7.33331V10.6668C7.33331 11.0335 7.63331 11.3335 7.99998 11.3335C8.36665 11.3335 8.66665 11.0335 8.66665 10.6668V8.66683H10.6666C11.0333 8.66683 11.3333 8.36683 11.3333 8.00016C11.3333 7.6335 11.0333 7.3335 10.6666 7.3335H8.66665V5.3335C8.66665 4.96683 8.36665 4.66683 7.99998 4.66683ZM7.99998 1.3335C4.31998 1.3335 1.33331 4.32016 1.33331 8.00016C1.33331 11.6802 4.31998 14.6668 7.99998 14.6668C11.68 14.6668 14.6666 11.6802 14.6666 8.00016C14.6666 4.32016 11.68 1.3335 7.99998 1.3335ZM7.99998 13.3335C5.05998 13.3335 2.66665 10.9402 2.66665 8.00016C2.66665 5.06016 5.05998 2.66683 7.99998 2.66683C10.94 2.66683 13.3333 5.06016 13.3333 8.00016C13.3333 10.9402 10.94 13.3335 7.99998 13.3335Z"
                    fill="#0d6efd" />
                </svg>
                <span class="ms-2">Добавить контакт</span>
              </button>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary form-save-button" data-bs-dismiss="modal">Сохранить</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
        </div>
      </div>
    </div>
  </div>
`;

  document.querySelector("main").insertAdjacentHTML("afterend", template);

  const contactsElementsFromDB = createFormContacts(contacts);
  const formContactsContainer = document.getElementById(
    "edit-contacts-container"
  );
  formContactsContainer.appendChild(contactsElementsFromDB);

  const addContactButton = document.querySelector(".table-add-contact");

  addContactButton.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    if (formContactsContainer.childElementCount >= 9) {
      addContactButton.classList.add("hidden");
    }
    const contact = createFormContact();
    formContactsContainer.appendChild(contact);
  });

  formContactsContainer.addEventListener("click", (e) => {
    e.preventDefault();
    if (formContactsContainer.childElementCount < 10) {
      addContactButton.classList.remove("hidden");
    }
  });

  const personModal = document.getElementById("person-modal");

  openModal(personModal);

  return template;
}

function openModal(element) {
  const modal = new bootstrap.Modal(element);
  modal.show();
}

async function searchClient(searchQuery) {
  const searchResult = await getClientsWithQuery(
    "http://localhost:3000/api/clients",
    searchQuery
  );
  render(searchResult);
}

const onInputChange = debounce(searchClient, 1000);

function handleSearchFormChange() {
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    if (!query) {
      initApp();
    }
  });
  document.getElementById("search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;
    onInputChange(query);
  });
}

clientsTableTh.forEach((th) => {
  th.addEventListener("click", function () {
    sortProp = this.dataset.prop;
    isSortDirectionReverse = !isSortDirectionReverse;
    this.classList.toggle("reverse");
    render(usersListFromAPI);
  });
});

const userHandlers = {
  onAdd() {
    createEditForm();
    // const saveButton = document.querySelector(".form-save-button");
    // saveButton.addEventListener("click", async () => {
    //   const form = document.forms["person-form"];
    //   const formInfo = collectDataFromForm(form);
    //   await addClient("http://localhost:3000/api/clients", formInfo);

    //   form.reset();

    //   initApp();
    // });
  },
  onEdit(user) {
    createEditForm(user);
    const saveButton = document.querySelector(".form-save-button");
    saveButton.addEventListener("click", async () => {
      const form = document.forms["person-form"];
      const formInfo = collectDataFromForm(form);
      await editClient("http://localhost:3000/api/clients", user.id, formInfo);

      form.reset();

      initApp();
    });
  },
  onDelete(e, id) {
    removeClient("http://localhost:3000/api/clients", id);
    e.target.closest("tr").remove();
  },
};

addContactButton.addEventListener("click", (e) => {
  e.stopImmediatePropagation();
  const contact = createFormContact();
  document.querySelector("#add-contacts-container").appendChild(contact);
});

saveButton.addEventListener("click", () => {
  const form = document.forms["modal-form"];
  onClientSave(form);
});

function render(usersListFromAPI) {
  clearContainer(tableContainer);

  let usersList = [...usersListFromAPI];

  usersList = sortList(usersList, sortProp, isSortDirectionReverse);

  usersList.forEach((user) => {
    tableContainer.appendChild(createTalbleLine(user, userHandlers));
  });
}

async function initApp() {
  usersListFromAPI = await getClients("http://localhost:3000/api/clients");
  render(usersListFromAPI);
}

initApp();
handleSearchFormChange();

function createClientCard(user) {
  const { id, name, surname, lastName, contacts } = user;
  const template = `
    <div class="modal fade" id="user-card" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Пользователь id <span>${id || ""}</span>
          </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h6 class="modal-title mb-3">
              Имя: <span>${name || ""}</span>
            </h6>
            <h6 class="modal-title mb-3">
              Фамилия: <span>${surname || ""}</span>
            </h6>
            <h6 class="modal-title mb-3">
              Отчество: <span>${lastName || ""}</span>
            </h6>
            <div class="list-group" id="card-contacts-list">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>`;

  console.log(contacts);

  // if (contacts.length) {
  //   const contactList = document.getElementById("card-contacts-list");
  //   console.log(contactList);
  //   for (let contact of contacts) {
  //     const link = `<a href="#" class="list-group-item list-group-item-action">${contact.type}: ${contact.value}</a>`;
  //     contactList.insertAdjacentHTML("afterbegin", "<h2>123123</h2>");
  //   }
  // }

  document.querySelector("main").insertAdjacentHTML("afterend", template);

  const clientModal = document.getElementById("user-card");

  openModal(clientModal);

  clientModal.addEventListener("hide.bs.modal", () => {
    history.replaceState({}, document.title, ".");
  });
}

async function updateState() {
  const hash = window.location.hash;
  try {
    if (hash) {
      const client = await getClient(
        "http://localhost:3000/api/clients",
        hash.substring(1)
      );
      client && createClientCard(client);
    }
  } catch (error) {
    console.error(error);
  }
}

window.addEventListener("hashchange", updateState);
window.addEventListener("load", updateState);
