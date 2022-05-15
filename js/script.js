async function getData(url) {
  const response = await fetch(url);
  const users = await response.json();
  console.log(users);
}

function sendData(url, payload) {
  const data = fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers:{
      "Content-type": "application/json"
    }
  });
}

getData("http://localhost:3000/api/clients");
