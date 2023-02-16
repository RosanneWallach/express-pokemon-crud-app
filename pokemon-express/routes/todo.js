import express from "express"
import { nanoid } from "nanoid"


export default function setupTodoRouter(db) {

    const router = express.Router();
    router.get("/", function (_request, response) {
        //The underscore means to ignore the param that's not being used
        response.status(200).json({
            //Set our response to have a status of 200 (OK!) and to respond with JSON
            success: true,
            todos: db.data.todos, //Returns the todos from our DB
        });
    });

    router.get("/:id", (request, response) => {
        const toDoId = request.params.id

        const toDoIdData = db.data.todos.filter(todo => todo.id === toDoId)
        response.status(200).json(toDoIdData)
    })

    router.post("/", function (request, response) {
        //Push the new todo
        db.data.todos.push({
            name: request.body.todo,
            id: nanoid(4),
        });

        //Save the todo to the "database"
        db.write();
        // console.log(db)

        //Respond with 200 (OK!) and tell the user the request is successful
        response.status(200).json({
            success: true,
        });
    });

    router.put("/:id", (request, response) => {
        const todo = request.params.id;
        const todoIndex = db.data.todos.findIndex(currentTodo => currentTodo.id === todo)
        db.data.todos[todoIndex].name = request.body.todo
        // console.log(db)
        db.write()

        response.status(200).json({
            msg: "changed"
        });
    })

    router.delete("/:id", (request, response) => {
        const todo = request.params.id
        // console.log(db.data.todos)
        const newDb = db.data.todos.filter(currentTodo => currentTodo.id !== todo)
        db.data.todos = newDb
        // console.log(db)
        db.write()
        response.status(200).json({
            msg: "deleted"
        });
    })

    return router
}