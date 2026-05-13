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
      <button>Add Product</button>
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

    <div class="product-grid">
`;

  filteredProducts
    .slice(startIndex, endIndex)
    .forEach((product) => {

      html += `
  <div class="product-card">

    <img 
  src="${
    product.name === 'Laptop'
      ? 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853'
      : product.name === 'Phone'
      ? 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'
      : product.name === 'Watch'
      ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
      : product.name === 'Shoes'
      ? 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
      : product.name === 'Tablet'
      ? 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0'
      : product.name === 'Camera'
      ? 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32'
      : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
  }"
>

    <h2>${product.name}</h2>

    <p>Price: ${product.price}</p>

    <p>Category: ${product.category}</p>

    <a href="/products/${product.id}">
      <button>View Details</button>
    </a>

  </div>
`;
    });

  html += `

    </div>

    <br>

    <a href="/products?page=${page + 1}&search=${search}">
      <button>Next Page</button>
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

  <nav>
    <a href="/">Home</a>
    <a href="/products">Products</a>
  </nav>

  <div class="container">

    <div class="product-card">

      <img 
        src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853"
      >

      <h1>${product.name}</h1>

      <p>Price: ${product.price}</p>

      <p>Category: ${product.category}</p>

      <a href="/products">
        <button>Back</button>
      </a>

    </div>

  </div>

</body>

</html>
  `);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});