export async function getClients(url) {
  const response = await fetch(url);
  if (response.ok) {
    const users = await response.json().then((data) => data);
    return users;
  } else {
    console.log("Ошибка HTTP: " + response.status);
  }
}

export async function getClientsWithQuery(url, search = "") {
  const response = await fetch(`${url}?search=${search}`);
  const user = await response.json().then((data) => data);
  return user;
}

export async function getClient(url, id) {
  const response = await fetch(`${url}/${id}`);
  const user = await response.json().then((data) => data);
  return user;
}

export async function addClient(url, payload) {
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function editClient(url, id, newValue) {
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

export async function removeClient(url, id) {
  const response = await fetch(`${url}/${id}`, {
    method: "DELETE",
  });

  if (response.status === 404) {
    console.log("Something went wrong. Can't find the record.");
  }
  const data = await response.json().then((data) => data);
  return data;
}
