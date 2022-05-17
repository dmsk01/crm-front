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

// addClient("http://localhost:3000/api/clients", {
//   name: "Василий",
//   surname: "Пупкин",
//   lastName: "Васильевич",
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

function createTooltip(type, value) {
  const content = `${type}:${value}`;
}

function createSocialLinks(contacts) {
  const template = `
    <a href="https://vk.com/" target="_blank">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7">
          <path
            d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z"
            fill="#9873FF" />
        </g>
      </svg>
    </a>
  `;
  for (let contact of contacts) {
    const type = contact.type;
    const value = contact.value;
    createTooltip(type, value);
    console.log(contact);
  }
  // return template;
}

async function createTalbleLine() {
  const user = await getClient(
    "http://localhost:3000/api/clients",
    1652779446324
  );
  const { contacts, id, createdAt, updatedAt, name, surname, lastName } = user;
  createSocialLinks(contacts);
  const created = convertISOTime(createdAt);
  const updated = convertISOTime(updatedAt);
  const baseInfoTemplate = `<tr class="table-body__row">
  <td class="table-body__item item-body item-body_grey">
    <span>${id}</span>
  </td>
  <td class="table-body__item item-body">
    ${surname} ${name} ${lastName}
  </td>
  <td class="table-body__item item-body item-body_grey item-body_gap">
    ${created.day}.${created.month}.${created.year}<span>${created.hours}:${created.minutes}</span>
  </td>
  <td class="table-body__item item-body item-body_grey item-body_gap">
  ${updated.day}.${updated.month}.${updated.year}<span>${updated.hours}:${updated.minutes}</span>
  </td>
  <td class="table-body__item item-body">
    <ul class="item-body__list">
      <li class="item-body__social-link social-link">
        <a href="https://vk.com/" target="_blank">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.7">
              <path
                d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z"
                fill="#9873FF" />
            </g>
          </svg>
        </a>
      </li>
    </ul>
  </td>
  <td class="table-body__item item-body">
    <button class="item-body__button">
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
  <td class="table-body__item item-body">
    <button class="item-body__button">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7">
          <path
            d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z"
            fill="#F06A4D" />
        </g>
      </svg>
      <span>Удалить</span>
    </button>
  </td>
</tr>`;
  return baseInfoTemplate;
}

createTalbleLine();
