const userModel = require("../models/userModel");
const userSchemas = require("../schemas/userSchema");
async function userRoutes(fastify, options) {
  fastify.get("/api/users", async (req, res) => {
    try {
      const users = await userModel.getAllUsers();
      // Transform the data into a format where pets are grouped under their respective users
      
      const usersReduced = users.reduce((acc, row) => {
        const userId = row.user_id;

        if (!acc[userId]) {
          acc[userId] = {
            id: userId,
            name: row.user_name,
            email: row.user_email,
            pets: [],
          };
        }

        if (row.pet_id) {
          acc[userId].pets.push({
            id: row.pet_id,
            name: row.pet_name,
            type: row.pet_type,
            image: row.pet_image ? row.pet_image.toString('base64') : null
          });
        }

        return acc;
      }, {});
      res.code(200).send(Object.values(usersReduced));
    } catch (err) {
      fastify.log.error(err);
      res.code(500).send({ error: "Database query failed" });
    }
  });
  fastify.get(
    "/api/users/:id",
    { schema: userSchemas.getUserSchema },
    async (request, reply) => {
      const { id } = request.params;
      try {
        const userId = await userModel.getUserById(id);

        if (userId.length === 0) {
          return reply.code(404).send({ message: "User not found" });
        }
        // Transform data into a user object with pets
        const user = {
          id: userId[0].user_id,
          name: userId[0].user_name,
          email: userId[0].user_email,
          pets: userId
            .filter((row) => row.pet_id)
            .map((row) => ({
              id: row.pet_id,
              name: row.pet_name,
              type: row.pet_type,
              image: row.pet_image ? row.pet_image.toString('base64') : null
            })),
        };
        //console.info('userId', user);
        reply.code(200).send(user);
      } catch (error) {
        fastify.log.error(error);
        reply, code(500).send({ error: "Failed to get users" });
      }
    }
  );
  fastify.post(
    "/api/users",
    { schema: userSchemas.createUserSchema },
    async (request, reply) => {
      const { name, email } = request.body;

      /*  if (!email || !name) {
      return reply.code(400).send({ error: "Name and email are required" });
    } */

      try {
        const addUser = await userModel.createUser(name, email);
        //reply.code(201).send({ msg: "User created", userId: addUser });

        reply.code(201).send({ msg: "User created", userId: addUser.insertId });
      } catch (error) {
        fastify.log.error(error);
        reply, code(500).send({ error: "Failed to insert user into db" });
      }
    }
  );

  fastify.put("/api/users/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const { name, email } = request.body;

      if (!email || !name) {
        return reply.code(400).send({ error: "Name and email are required" });
      }

      const userUpdate = await userModel.updateUser(id, name, email);

      if (userUpdate.length === 0) {
        return reply.code(404).send({ msg: "User not found" });
      }

      reply
        .code(200)
        .send({ msg: "User updated succesfully", user: userUpdate });
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ msg: "failed update of user" });
    }
  });
  fastify.delete("/api/users/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      const affectedRows = await userModel.deleteUser(id);
      if (affectedRows === 0) {
        return reply.code(404).send({ msg: "User not found" });
      }
      reply.code(200).send({ msg: "User deleted successfully" });
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ msg: "Something went wrong" });
    }
  });
}

module.exports = userRoutes;
