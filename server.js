import express from "express";
import fetch from "node-fetch";
const app = express();

// Set static folder
app.use(express.static("public"));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ express: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Handle Get request to fetch users
app.get("/users", async (req, res) => {
  try {
    setTimeout(async () => {
      const limit = +req.query.limit || 10;

      // const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const response = await fetch(
        `https://jsonplaceholder.org/users?_limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const users = await response.json();

      res.send(`
      <h2 class="text-2xl font-bold my-4">Users</h2>
      <ul>
        ${users
          .map((user) => `<li>${user.firstname} ${user.lastname}</li>`)
          .join("")}
      </ul>
    `);
    }, 2000);
  } catch (error) {
    console.error("Fetch error: ", error);
    res.status(500).send("Error fetching users");
    console.error("Fetch error: ", error);
  }
});

// Handle Post request for temp conversion
app.post("/convert", (req, res) => {
  setTimeout(() => {
    const fahrenheit = parseFloat(req.body.fahrenheit);
    const celsius = (fahrenheit - 32) * (5 / 9);
    res.send(`<p>
    ${fahrenheit} degrees Farenheit is equal to ${celsius.toFixed(
      2
    )} degrees Celsius.</p>`);
  }, 2000);
});

// Handle GET request for polling example
let counter = 0;
app.get("/poll", (req, res) => {
  counter++;

  const data = { value: counter };
  res.json(data);
});

// Handle GET request for weather
let currentTemperature = 20;
app.get("/get-temperature", (req, res) => {
  currentTemperature += Math.random() * 2 - 1;
  res.send(currentTemperature.toFixed(1) + "°C");
});

// Handle POST request for user search
const contacts = [
  { name: "John Doe", email: "john@example.com" },
  { name: "Jane Doe", email: "jane@example.com" },
  { name: "Alice Smith", email: "alice@example.com" },
  { name: "Bob Williams", email: "bob@example.com" },
  { name: "Mary Harris", email: "mary@example.com" },
  { name: "David Mitchell", email: "david@example.com" },
];

app.post("/search", (req, res) => {
  const searchTerm = req.body.search.toLowerCase();
  if (!searchTerm) {
    return res.send("<tr></tr>");
  }

  const searchResults = contacts.filter((contact) => {
    const name = contact.name.toLocaleLowerCase();
    const email = contact.email.toLocaleLowerCase();
    return name.includes(searchTerm) || email.includes(searchTerm);
  });
  setTimeout(() => {
    const searchResultHtml = searchResults
      .map(
        (contact) =>
          `<tr>
        <td class="px-6"><div class="my-2">${contact.name}</div></td>
        <td class="px-6"><div class="my-2">${contact.email}</div></td>
      </tr>`
      )
      .join("");
    res.send(searchResultHtml);
  }, 2000);
});

// Handle POST request for user search
app.post("/search/api", async (req, res) => {
  const searchTerm = req.body.search.toLowerCase();
  if (!searchTerm) {
    return res.send("<tr></tr>");
  }

  const response = await fetch(`https://jsonplaceholder.org/users`);

  const contacts = await response.json();

  const searchResults = contacts.filter((contact) => {
    const firstname = contact.firstname.toLocaleLowerCase();
    const lastname = contact.lastname.toLocaleLowerCase();
    const email = contact.email.toLocaleLowerCase();
    const phone = contact.phone;
    return (
      firstname.includes(searchTerm) ||
      lastname.includes(searchTerm) ||
      email.includes(searchTerm) ||
      phone.includes(searchTerm)
    );
  });
  setTimeout(() => {
    const searchResultHtml = searchResults
      .map(
        (contact) =>
          `<tr>
            <td class="px-6"><div class="my-2">${contact.firstname} ${contact.lastname}</div></td>
            <td class="px-6"><div class="my-2">${contact.email}</div></td>
            <td class="px-6"><div class="my-2">${contact.phone}</div></td>
          </tr>`
      )
      .join("");
    res.send(searchResultHtml);
  }, 2000);
});

// Handle POST request for email validation
app.post("/contact/email", (req, res) => {
  const submittedEmail = req.body.email;
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  const isValid = {
    message: "That email is valid",
    class: "text-green-700",
  };

  const isInvalid = {
    message: "Please enter a valid email address",
    class: "text-red-700",
  };

  if (!emailRegex.test(submittedEmail)) {
    return res.send(`
    
    <div class="mb-4" hx-target="this" hx-swap="outerHTML">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
      >Email Address</label
    >
    <input
      name="email"
      hx-post="/contact/email"
      class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
      type="email"
      id="email"
      value="${submittedEmail}"
      required
    />
    <div class="${isInvalid.class}">${isInvalid.message}</div>
  </div>`);
  } else {
    console.log(submittedEmail);
    return res.send(`
    
    <div class="mb-4" hx-target="this" hx-swap="outerHTML">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
      >Email Address</label
    >
    <input
      name="email"
      hx-post="/contact/email"
      class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
      type="email"
      id="email"
      value="${submittedEmail}"
      required
    />
    <div class="${isValid.class}">${isValid.message}</div>
  </div>`);
  }
});

// Start the server
app.listen(5000, () => {
  console.log("listening on port 5000");
});
