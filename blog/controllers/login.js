const loginRouter = require("express").Router()
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const bcrypt = require("bcrypt")
require("dotenv").config()


loginRouter.post("/", async (request,response) => {

    const {username,password} = request.body

    const user = await User.findOne({username})
    console.log(user.passwordHash);


    

    const passwordCorrect = user === null ? false : await bcrypt.compare(password,user.passwordHash)

    if(!(user && passwordCorrect)){
        response.status(401).json({
            error: `username or Password is invalid ${username}, ${password}`,
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken,process.env.SECRET)

    response.status(200).send({token,username:user.username,name: user.name})

})



module.exports = loginRouter