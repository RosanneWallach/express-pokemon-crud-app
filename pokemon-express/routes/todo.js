import express from "express"
import { nanoid } from "nanoid"


export default function setupPokemonRouter(db) {

    const router = express.Router();
    router.get("/", function (_request, response) {
        //The underscore means to ignore the param that's not being used
        response.status(200).json({
            //Set our response to have a status of 200 (OK!) and to respond with JSON
            success: true,
            pokemon: db.data.pokemon, //Returns the todos from our DB
        });
    });

    router.get("/:pokemonname", (request, response) => {
        const pokemonName = request.params.pokemonname

        const pokemonIdData = db.data.pokemon.filter(pokemon => pokemon.name === pokemonName)
        response.status(200).json(pokemonIdData)
    })

    router.post("/", function (request, response) {
        //Push the new todo
        db.data.pokemon.push({
            name: request.body.name,
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

    router.put("/:pokemon", (request, response) => {
        const pokemon = request.params.pokemon;
        const pokemonIndex = db.data.pokemon.findIndex(currentPokemon => currentPokemon.name === pokemon)
        db.data.pokemon[pokemonIndex].name = request.body.name
        // console.log(db)
        db.write()

        response.status(200).json({
            msg: "changed"
        });
    })

     router.delete("/:id", (request, response) => {
        const pokemon = db.data.pokemon

        const pokemon_id = request.params.id

        const pokemon_deleted = pokemon.find(pokemon => pokemon.id = pokemon_id)

        const filteredPoke = pokemon.filter(pokemon => pokemon.id !== pokemon_id)

        db.data.pokemon = filteredPoke

        db.write();

        response.status(200).json({
            success: true,
            pokemon_deleted: pokemon_deleted
        });
    })

    return router
}