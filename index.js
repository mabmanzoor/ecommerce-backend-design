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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/add-product", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "add-product.html"));
});

app.get("/products", (req, res) => {

  const search = req.query.search;

  let filteredProducts = products;
  const page = parseInt(req.query.page) || 1;

const limit = 2;

const startIndex = (page - 1) * limit;

const endIndex = startIndex + limit;
  

  if (search) {
    filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  let html = `
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
      <div>
        <h2>${product.name}</h2>

        <p>Price: ${product.price}</p>

        <a href="/products/${product.id}">
          View Details
        </a>

        <hr>
      </div>
    `;
  });



html += `
  <a href="/products?page=${page + 1}">
    Next Page
  </a>
`;

res.send(html);

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
    <h1>${product.name}</h1>

    <p>Price: ${product.price}</p>

    <p>Category: ${product.category}</p>

    <a href="/products">
      Back
    </a>
  `);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});