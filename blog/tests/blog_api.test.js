const {test,after}  = require("node:test")
const assert = require("node:assert")
const Blog = require("../controllers/blogs")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const mongoose = require("mongoose")

test.only("blogs are returned as json",async () => {

    await api
         .get("/api/blogs")
         .expect(200)
         .expect("Content-Type",/application\/json/)
})

test.only("blogs has unique id named 'id' ", async () => {

    const blogs = await api
          .get("/api/blogs")
          .expect(200)
          .expect("Content-Type",/application\/json/)

    const blogs_id = blogs.body.map(b => b.id)

    blogs_id.forEach((id) => {
         assert(id)
    })
})

after(async() => {
  mongoose.connection.close()
})