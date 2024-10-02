const { application } = require("express")
const { response } = require("../app")
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

blogsRouter.delete("/:id", async (request,response) => {

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put("/:id", async (request,response) => {

    const body = request.body

    const blog = {...body}

    await Blog.findByIdAndUpdate(request.params.id,blog,{new:true})
    response.status(204).end()

})
module.exports = blogsRouter