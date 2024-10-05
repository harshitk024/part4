const Blog = require("../models/blog")
const User = require("../models/user")

const initialUser = [
    {
        username: "harshk24",
        name: "harshit",
        password: "mybackendapp"
    }
]

const blogsInDb = async () => {

    const blogs = await Blog.find({})
    return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {

    const users = await User.find({})
    return users.map((u) => u.toJSON())
}

module.exports = {

    blogsInDb,
    initialUser,
    usersInDb
}