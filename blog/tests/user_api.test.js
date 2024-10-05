const {test,beforeEach,describe,after} = require("node:test")
const User = require("../models/user")
const helper = require("./test_helper")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const assert = require("node:assert")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

describe("creating a new user",() => {

    beforeEach(async() => {
       await User.deleteMany({})
       const passwordHash =  await bcrypt.hash(helper.initialUser[0].password,10)
       helper.initialUser[0].password = passwordHash
       const initialUser = new User(helper.initialUser[0])
       await initialUser.save()
    })


    test("a user is created with valid properties", async () => {

        const usersAtFirst = await helper.usersInDb()


        const newUser = {
            username: "root",
            name: "admin",
            password: "adminapp53"
        }

        await api
              .post("/api/users")
              .send(newUser)
              .expect(201)
              .expect("Content-Type",/application\/json/)
        
        
        const usersAtEnd = await helper.usersInDb()
        const usernames = usersAtEnd.map((user) => user.username)

        assert.strictEqual(usersAtEnd.length,usersAtFirst.length + 1)

        assert(usernames.includes("root"))

    })
})



after(() => {
    mongoose.connection.close()
})