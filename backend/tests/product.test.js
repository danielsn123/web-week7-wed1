const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Your Express app
const api = supertest(app);
const Product = require("../models/productModel");

const products = [
  {
    title: "Book about cats",
    category: "Books & Literature",
    description: "This is a really cool book about cats.",
    price: "20",
    stockQuantity: "10",
    supplier: {
      name: "Cat Books Inc.",
      contactEmail: "contact@catbooks.com",
      contactPhone: "555-555-5555",
      rating: "4",
    }
  },
  {
    title: "Book about dogs",
    category: "Books & Literature",
    description: "This is a really cool book about dogs.",
    price: "25",
    stockQuantity: "15",
    supplier: {
      name: "Dog Books Inc.",
      contactEmail: "contact@dogbooks.com",
      contactPhone: "444-444-4444",
      rating: "4",
    }
  },
];

describe("Product Controller", () => {
  beforeEach(async () => {
    await Product.deleteMany({});
    await Product.insertMany(products);
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  // Test GET /api/products
  it("should return all products as JSON when GET /api/products is called", async () => {
    const response = await api
      .get("/api/products")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(products.length);
  });

  // Test POST /api/products
  it("should create a new product when POST /api/products is called", async () => {
    const newProduct = {
      title: "Book about birds",
      category: "Books & Literature",
      description: "This is a really cool book about birds.",
      price: "15",
      stockQuantity: "5",
      supplier: {
        name: "Bird Books Inc.",
        contactEmail: "contact@birdbooks.com",
        contactPhone: "333-333-3333",
        rating: "5",
      }
    };

    await api
      .post("/api/products")
      .send(newProduct)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const productsAfterPost = await Product.find({});
    expect(productsAfterPost).toHaveLength(products.length + 1);
    const productTitles = productsAfterPost.map((product) => product.title);
    expect(productTitles).toContain(newProduct.title);
  });

  // Test GET /api/products/:id
  it("should return one product by ID when GET /api/products/:id is called", async () => {
    const product = await Product.findOne();
    await api
      .get(`/api/products/${product._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should return 404 for a non-existing product ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await api.get(`/api/products/${nonExistentId}`).expect(404);
  });

  // Test PUT /api/products/:id
  it("should update one product with partial data when PUT /api/products/:id is called", async () => {
    const product = await Product.findOne();
    const updatedProduct = {
      description: "Updated description",
    };

    await api
      .put(`/api/products/${product._id}`)
      .send(updatedProduct)
      //.expect(200)
      .expect("Content-Type", /application\/json/);

    const updatedProductCheck = await Product.findById(product._id);
    expect(updatedProductCheck.description).toBe(updatedProduct.description);
  });

  it("should return 400 for invalid product ID when PUT /api/products/:id", async () => {
    const invalidId = "12345";
    await api.put(`/api/products/${invalidId}`).send({}).expect(400);
  });

  // Test DELETE /api/products/:id
  it("should delete one product by ID when DELETE /api/products/:id is called", async () => {
    const product = await Product.findOne();
    await api.delete(`/api/products/${product._id}`).expect(204);

    const deletedProductCheck = await Product.findById(product._id);
    expect(deletedProductCheck).toBeNull();
  });

  it("should return 400 for invalid product ID when DELETE /api/products/:id", async () => {
    const invalidId = "12345";
    await api.delete(`/api/products/${invalidId}`).expect(400);
  });
});
