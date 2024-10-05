const { response, request } = require("../app")
const logger = require("./logger")
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const requestLogger = (request,response,next) => {
   
    logger.info("Method: ",request.method)
    logger.info("Path: ",request.path)
    logger.info("Body: ",request.body)
    logger.info("---")

    next()
}

const tokenExtractor = (request,response,next) => {

    const authorization = request.get("authorization")

    if(authorization && authorization.startsWith("Bearer ")){
        request.token = authorization.replace("Bearer ","")
    }

    next()
}

const userExtractor = async (request,response,next) => {


    const authorization = request.get("authorization")

    let token;

    if(authorization && authorization.startsWith("Bearer ")){
        token = authorization.replace("Bearer ","")
        const decodedToken = jwt.verify(token,process.env.SECRET)
        request.user = await User.findById(decodedToken.id)
    }


    next()
}

const unknownEndpoint = (request,response) => {
    response.status(400).send({error: "unknown Endpoint"})
}

const errorHandler = (error,request,response,next) => {

    logger.error(error)

    if(error.name === "CastError"){
        return response.status(400).send({error: "malformatted id"})
    } else if (error.name === "ValidationError") {
        return response.status(400).send({error: error})
    } else if (error.name === "Internal Server Error"){
        return response.status(500).send({error: error})
    }

    next(error)
}

module.exports = {
    requestLogger,
    tokenExtractor,
    unknownEndpoint,
    userExtractor,
    errorHandler
}