import express from "express"; //Import Express
import { Low } from "lowdb"; //Import the LowDB module. Uses a JSON file to create our "database"
import { JSONFile } from "lowdb/node";
import { nanoid } from "nanoid"
import setupTodoRouter from "./routes/todo.js";
import morgan from "morgan"



export default async function createServer() {
    // Configure lowdb to write to JSONFile. This will be our "database"
    const adapter = new JSONFile("db.json");
    const db = new Low(adapter);

    //Reads the database
    await db.read();

    //Checks if there is any data in the database. If not, we give default data.
    db.data = db.data || { todos: [] };

    //This writes to the database if there are any changes
    await db.write();

    //Instantiate our express application
    const app = express();


    app.use(morgan('tiny'))

    //Use Builtin middleware to extract JSON data from the body of any request made to the server
    app.use(express.json());

    app.use("/todo",function (request, response, next) {
        if (request.query.admin === "true") {
            next()
        } else {
            response.status(401).send("Unauthorized")
        }
        // next()
    })
    // app.use("/todo", function (request, response, next) {
    //     console.log("hello middlewarasdasde")
    //     next()
    // })


    //Create our GET route that just sends back the Todos data


    app.use("/todo", setupTodoRouter(db))

 return app

};