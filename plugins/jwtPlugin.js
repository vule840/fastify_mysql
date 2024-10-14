
// plugins/jwtPlugin.js
const fp = require('fastify-plugin');
const fastifyJwt = require('@fastify/jwt');

// Define the plugin
const jwtPlugin = async function (fastify, options){
  console.log('JWT Plugin Loaded');

  // Register the JWT plugin with the secret
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
  });

  // Decorate the Fastify instance with the verifyJWT function
  fastify.decorate('verifyJWT', async function (request, reply) {
    try {
      await request.jwtVerify(); // Verifies and decodes the JWT
   /*    console.log('tokenn', token); // Log the decoded token */

    } catch (err) {
      console.error('JWT Verification Error:', err); // Log the error for debugging
      reply.code(401).send({ error: 'Unauthorized: Invalid JWT token' });
    }
  });
};

// Export the plugin using fastify-plugin
module.exports = fp(jwtPlugin);