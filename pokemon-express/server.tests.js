import request from "supertest"
import createServer from "./server.js"

const server = await createServer()

describe("Just testing the server", function () {
    describe("Testing the /todo route", function () {
        it("Should be unable to get todo without flag", function (done) {
            request(server).get("/todo").expect(401).end(function (err) {
                if (err) {
                    throw err
                } else {
                    done()
                }
            })
        })
    })

    it("Should be able to get todo with flag", function (done) {
        request(server).get("/todo?admin=true").expect(200).end(function (err) {
            if (err) {
                throw err
            } else {
                done()
            }
        })
    })

    it("Should be able to create a todo", function (done) {
        request(server).post("/todo?admin=true")
            .send({ "todo": "clean the garage" })
            .expect(200)
            .expect('Content-Type', /json/)
            // .expect(response => response.body.success === "haha")
            .end(function (err, response) {
                if (err) {
                    throw err
                } else {
                    expect(response.body).toEqual({ success: true })
                    done()
                }
            })
    })

    it("Should be able to delete a todo", function (done) {
        request(server).delete("/todo/Ch_k?admin=true")
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, response) {
                if (err) {
                    throw err
                } else {
                    console.log(response.body)
                    expect(response.body).toEqual({ mssg: "deleted" })
                    done()
                }
            })
    })

    it("Should be able to update a todo", function (done) {
        request(server).put("/todo/1otM?admin=true")
            .send({ "todo": "changed todo" })
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, response) {
                if (err) {
                    console.log(response.body)
                    throw err
                } else {
                    console.log(response.body)
                    expect(response.body).toEqual({ mssg: "changed" })
                    done()
                }
            })
    })

})