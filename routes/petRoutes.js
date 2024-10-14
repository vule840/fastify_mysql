const { config } = require('nodemon')
const petModel = require('../models/petModel')
const petSchemas = require('../schemas/petSchema')
async function petRoutes(fastify, options) {
    fastify.get('/api/users/:userId/pets', { schema: petSchemas.getPetsSchema }, async (request, reply) => {
        //userId is string so carefull
        //parseInt(userId) or userId*1 to convert to number
        const {userId} = request.params
        try {
            const pets = await petModel.getPets(userId)
            const filteredPets = pets.filter(pet => pet.user_id === parseInt(userId));
            
            if (filteredPets.length > 0) {
                reply.code(200).send(filteredPets);
            } else {
                reply.code(404).send({ message: 'No pets found for this user' });
            }
        } catch (error) {
            fastify.log.error(error);
            reply, code(500).send({ error: "Failed to get users" });
        }
    })
    fastify.get('/api/users/:userId/pets/:id',  async (req, res) => {
        const {id} = req.params
        try {
            const pet = await petModel.getPet(id)
            res.code(200).send(pet)
        } catch (error) {
            fastify.log.error(error);
            res, code(500).send({ error: "Failed to get users" });
        }
    })

    fastify.post('/api/users/:userId/pets', /* { schema: petSchemas.addPetSchema } */ async (request,reply) => {
        const {userId} = request.params
        //const m= await request.fields
        
        
          // Get uploaded file(s)
          const data = await request.file()
          /* console.log('data', data);
          console.log('fields', data.fields.name.value); */
          const fileBuffer = await data.toBuffer();  // For in-memory processing
          //console.log('fileBuffer', fileBuffer);
        try {
            const newPet = await petModel.createPet(data.fields.name.value,data.fields.type.value,userId, fileBuffer)
            reply.code(200).send(newPet)
        } catch (error) {
            fastify.log.error(error);
            reply, code(500).send({ error: "Failed to get users" });
        }
    })
    fastify.put('/api/users/:userId/pets/:id', async (req,res) => {
        const {id} = req.params
        const {name, type} = req.body

        if(!name || !type){
           return res.code(400).send({msg: 'missing name or type'})
        }
        try {
            const updatePet = await petModel.updatePet(name,type,id)
            res.code(200).send(updatePet)
        } catch (error) {
            fastify.log.error(error);
            res, code(500).send({ error: "Failed to update pet" });
        }
    })
    fastify.delete('/api/users/:userId/pets/:id', async (req,res) => {
        const {id} = req.params
        //const {name, type} = req.body
        try {
            const deletePet = await petModel.deletePet(id)
            res.code(200).send(deletePet)
        } catch (error) {
            fastify.log.error(error);
            res, code(500).send({ error: "Failed to delete pet" });
        }
    })
   
}

module.exports = petRoutes