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
  usersList.forEach((user) => {
    createTalbleLine(user);
  });
}

drawTable();

// addClient("http://localhost:3000/api/clients", {
//   name: "Федор",
//   surname: "Конев",
//   lastName: "Иванович",
//   contacts: [
//     {
//       type: "Телефон",
//       value: "+71234567890",
//     },
//     {
//       type: "Email",
//       value: "abc@xyz.com",
//     },
//     {
//       type: "Facebook",
//       value: "https://facebook.com/vasiliy-pupkin-the-best",
//     },
//   ],
// });

// const user = getClient("http://localhost:3000/api/clients", 1652779446324);

// removeClient("http://localhost:3000/api/clients", 1652623760402);

// const user = {
//   name: "Иванов",
//   surname: "Иван",
//   lastName: "Иванович",
//   contacts: [
//     {
//       type: "Телефон",
//       value: "+71234567890",
//     },
//     {
//       type: "Email",
//       value: "abc@xyz.com",
//     },
//     {
//       type: "Facebook",
//       value: "https://facebook.com/vasiliy-pupkin-the-best",
//     },
//   ],
// };

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
  deleteButton.classList.add("contact-delete-button");
  deleteButton.innerHTML = `
    <svg width=" 16" height="16" viewBox="0 0 16 16" fill="none" >
      <use xlink:href="./img/sprite.svg#cancel"></use>
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

  const { contacts, id, createdAt, updatedAt, name, surname, lastName } = user;
  const contactItems = createSocialLinks(contacts);
  const created = convertISOTime(createdAt);
  const updated = convertISOTime(updatedAt);

  const baseInfoTemplate = `
      <td>
       ${id}
      </td>
      <td>
        ${surname} ${name} ${lastName}
      </td>
      <td>
        ${created.day}.${created.month}.${created.year}<span class="ms-2">${created.hours}:${created.minutes}</span>
      </td>
      <td>
      ${updated.day}.${updated.month}.${updated.year}<span class="ms-2">${updated.hours}:${updated.minutes}</span>
      </td>
      <td>
        <ul class="d-flex justify-content-start ps-0 mb-0 contacts-list">
          ${contactItems}
        </ul>
      </td>
      <td>
        <button class='button-change'>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.7">
              <path
                d="M2 11.5V14H4.5L11.8733 6.62662L9.37333 4.12662L2 11.5ZM13.8067 4.69329C14.0667 4.43329 14.0667 4.01329 13.8067 3.75329L12.2467 2.19329C11.9867 1.93329 11.5667 1.93329 11.3067 2.19329L10.0867 3.41329L12.5867 5.91329L13.8067 4.69329V4.69329Z"
                fill="#9873FF" />
            </g>
          </svg>
          <span>Изменить</span>
        </button>
      </td>
      <td>
        <button class='button-delete'>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.7">
              <path
                d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z"
                fill="#F06A4D" />
            </g>
          </svg>
          <span>Удалить</span>
        </button>
      </td>`;

  tableRow.innerHTML = baseInfoTemplate;
  tableContainer.appendChild(tableRow);
}

// function sortFunction(a, b, query) {
//   if (a[query] > b[query]) return 1;
//   if (a[query] < b[query]) return -1;
//   return 0;
// }

document.querySelector(".table-add-contact").addEventListener("click", (e) => {
  e.stopImmediatePropagation();
  const contact = createContact();
  document.querySelector("#add-contacts-container").appendChild(contact);
});
