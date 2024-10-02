const Blog = require("../models/blog")

const blogsRouter = require("express").Router()

blogsRouter.get("/",(request,response) => {
    Blog.find({})
        .then(blogs => {
            response.json(blogs)
        })
        .catch(error => next(error))
})

blogsRouter.post("/",async (request,response) => {

    let newBlog = request.body

    if(!(newBlog.title && newBlog.url)){
        response.status(400).end()
    }

    if(!newBlog.likes){
      newBlog = {...newBlog,likes: 0}
    }
   
    const blog = new Blog(newBlog)


    const result = await blog.save()
    response.status(201).json(result)


})

module.exports = blogsRouter