async function protected(fastify, options) {
    fastify.get('/protected', {
      /* config: { logMe: true }, */
      onRequest: [fastify.verifyJWT], logMe: true 
    }, async (request, reply) => {

      try {
        const user = request.user
    return { message: 'Hello, you are authenticated!',  user};
      } catch (err) {
        return reply.code(401).send({ error: 'Unauthorized: Invalid JWT token', err });
      }
    });
  }

module.exports = protected