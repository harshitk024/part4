const {test,after,beforeEach,describe}  = require("node:test")
const assert = require("node:assert")
const Blog = require("../models/blog")
const helper = require("./test_helper")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const mongoose = require("mongoose")

const initialBlogs = [

    {
        title: "blog-1",
        author: "author-1",
        url: "https://blog1.com",
        likes: 53
    },
    {
        title: "blog-2",
        author: "author-2",
        url: "https://blog2.com",
        likes: 3
    }
]

beforeEach(async () => {

    await Blog.deleteMany({})

    const blogObjects = initialBlogs.map((blog) => new Blog(blog))

    const promiseArray = blogObjects.map((ele) => ele.save())

    await Promise.all(promiseArray)

    console.log("done");

})

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

test.only("blog is created",async () => {

    const newBlog = {
       title: "test-blog",
       author: "noauthor",
       url: "https://test_blog.com",
       likes: 51
    }

    await api
            .post("/api/blogs")
            .send(newBlog)
            .expect(201)
            .expect("Content-Type",/application\/json/)

    const blogs = await helper.blogsInDb()

    assert.strictEqual(blogs.length,initialBlogs.length + 1)

    const content = blogs.map((blog) => blog.title)

    assert(content.includes("test-blog"))
})

test.only("likes is undefined", async() => {

    const newBlog = {
        title: "test-blog",
        author: "noauthor",
        url: "https://test_blog.com",
    }

    await api
          .post("/api/blogs")
          .send(newBlog)
          .expect(201)
          .expect("Content-Type",/application\/json/)
    
    const blogs = await helper.blogsInDb()

    const lastBlog = blogs.find((blog) => blog.title === "test-blog")

    assert.strictEqual(lastBlog.likes,0)
})

describe('properties are missing', () => {
    
    test.only("title is missing",async () => {
        const newBlog = {
            author: "noauthor",
            url: "https://test_blog.com",
            likes: 51
        }

        await api
              .post("/api/notes")
              .send(newBlog)
              .expect(400)
    })

    test.only("url is missing", async () => {

        const newBlog = {
            title: "test-blog",
            author: "noauthor",
            likes: 51
        }

        await api
        .post("/api/notes")
        .send(newBlog)
        .expect(400)
    })

    test.only("title and url both are missing",async () => {
        const newBlog = {
            author: "noauthor",
            likes: 51
        }

        await api
              .post("/api/notes")
              .send(newBlog)
              .expect(400)
 })
});


after(async() => {
  mongoose.connection.close()
})