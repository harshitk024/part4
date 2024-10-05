const usersRouter = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")


usersRouter.get("/",async (request,response) => {

    const users = await User.find({}).populate("blogs")
    response.json(users)
})

usersRouter.post("/",async (request,response) => {

    const {username,name,password} = request.body

    if(password.length < 3){
        response.status(400).send({error: "Password Length must be greater than 3"})
    }

    const passwordHash = await bcrypt.hash(password,10)
    
    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})




module.exports = usersRouter