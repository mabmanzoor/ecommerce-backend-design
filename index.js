const express = require("express");
const path = require("path");

const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

const products = [
  {
    id: 1,
    name: "Laptop",
    price: 50000,
    category: "Electronics",
  },

  {
    id: 2,
    name: "Phone",
    price: 30000,
    category: "Mobile",
  },

  {
    id: 3,
    name: "Tablet",
    price: 20000,
    category: "Electronics",
  },

  {
    id: 4,
    name: "Shoes",
    price: 4000,
    category: "Fashion",
  },

  {
    id: 5,
    name: "Camera",
    price: 35000,
    category: "Electronics",
  }
];

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/add-product", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "add-product.html"));
});

app.get("/products", (req, res) => {

  const search = req.query.search || "";

  let filteredProducts = products;

  if (search) {
    filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  const page = parseInt(req.query.page) || 1;

  const limit = 2;

  const startIndex = (page - 1) * limit;

  const endIndex = startIndex + limit;

  let html = `
<!DOCTYPE html>

<html>

<head>

  <title>Products Page</title>

  <link rel="stylesheet" href="/style.css">

</head>

<body>

  <nav>
    <a href="/">Home</a>
    <a href="/products">Products</a>
    <a href="/add-product">Add Product</a>
    <a href="/login">Login</a>
    <a href="/signup">Signup</a>
  </nav>

  <div class="container">

    <h1>Products Page</h1>

    <a href="/add-product">
      Add Product
    </a>

    <br><br>

    <form>
      <input 
        type="text" 
        name="search" 
        placeholder="Search product"
      >

      <button type="submit">
        Search
      </button>
    </form>

    <br>
`;

  filteredProducts
    .slice(startIndex, endIndex)
    .forEach((product) => {

      html += `
        <div class="product-card">

          <h2>${product.name}</h2>

          <p>Price: ${product.price}</p>

          <p>Category: ${product.category}</p>

          <a href="/products/${product.id}">
            View Details
          </a>

        </div>
      `;
    });

  html += `
    <br>

    <a href="/products?page=${page + 1}&search=${search}">
      Next Page
    </a>

  </div>

</body>

</html>
`;

  res.send(html);
});

app.post("/login", (req, res) => {

  const email = req.body.email;

  const password = req.body.password;

  if (
    email === "admin@gmail.com" &&
    password === "12345"
  ) {
    res.redirect("/products");
  } else {
    res.send("Invalid Email or Password");
  }
});

app.post("/add-product", (req, res) => {

  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
  };

  products.push(newProduct);

  res.redirect("/products");
});

app.get("/products/:id", (req, res) => {

  const productId = parseInt(req.params.id);

  const product = products.find((p) => p.id === productId);

  res.send(`
<!DOCTYPE html>

<html>

<head>

  <title>Product Details</title>

  <link rel="stylesheet" href="/style.css">

</head>

<body>

  <div class="container">

    <h1>${product.name}</h1>

    <p>Price: ${product.price}</p>

    <p>Category: ${product.category}</p>

    <a href="/products">
      Back
    </a>

  </div>

</body>

</html>
  `);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});