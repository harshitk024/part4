const { application } = require("express")
const { response } = require("../app")
const Blog = require("../models/blog")
const User = require("../models/user")

const blogsRouter = require("express").Router()

blogsRouter.get("/",async (request,response) => {
   const blogs = await Blog.find({}).populate("user")
   response.json(blogs)
})


blogsRouter.post("/",async (request,response) => {

    let newBlog = request.body

    const user = request.user

    if(!(newBlog.title && newBlog.url)){
        response.status(400).end()
    }

    if(!newBlog.likes){
      newBlog = {...newBlog,likes: 0}
    }
   
    const blog = new Blog({
        title: newBlog.title,
        author: newBlog.author,
        url: newBlog.url,
        likes: newBlog.likes,
        user: user.id
    })


    const result = await blog.save()

    user.blogs = user.blogs.concat(result.id)
    await user.save()
    response.status(201).json(result)


})

blogsRouter.delete("/:id", async (request,response) => {


    const blog = await Blog.findById(request.params.id)

    const user = request.user

    if(blog.user.toString() === user.id.toString()){
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()

        user.blogs = user.blogs.filter((b) => b.id !== blog.id)
        await user.save()
    } else {
        response.status(400).send({error: "invalid user"})
    }

})

blogsRouter.get("/:id",async (request,response) => {

   const blog =  await Blog.findById(request.params.id)
    response.status(201).json(blog)

})

blogsRouter.put("/:id", async (request,response) => {

    const body = request.body

    const blog = {...body}

    await Blog.findByIdAndUpdate(request.params.id,blog,{new:true})
    response.status(204).end()

})
module.exports = blogsRouter