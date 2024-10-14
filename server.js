const fastify = require("fastify")({
  logger: true,
  ajv: {
    customOptions: {
      allErrors: true, // Shows all validation errors
      jsonPointers: true, // Needed for ajv-errors
    },
    plugins: [require("ajv-errors")], // Enable ajv-errors
  },
});

const jwtPlugin = require('./plugins/jwtPlugin');
fastify.register(jwtPlugin);
fastify.register(require('@fastify/multipart'))

/* fastify.setErrorHandler((error, request, reply) => {
  if (error.validation) {
    const formattedErrors = error.validation.map((err) => {
      return err.message; // Only return the error message, without the path
    });

    reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: formattedErrors.join(', ') // Join multiple errors into a single string
    });
  } else {
    // Default error handling
    reply.status(error.statusCode || 500).send({
      error: error.message || 'Internal Server Error'
    });
  }
}); */
/* fastify.addHook('onReady', (request, reply, done) => {
  console.log('This is every onReady');
 
}) */
const logMe = async (request, reply) => {
  request.log.info({url: request.url}, "on some ROUTEE")
}
fastify.addHook('onRoute', (routeOptions) => {
  if(routeOptions.config?.logMe) {
    routeOptions.onRequest = logMe
  }
    
})
//fastify.addHook("preHandler", testHook);
// Register plugins and routes


const protected = require("./routes/protected");
const userRoutes = require("./routes/userRoutes");
const petRoutes = require("./routes/petRoutes");
const authRoutes = require('./routes/authRoutes')


fastify.register(authRoutes);
fastify.register(protected);
fastify.register(userRoutes);
fastify.register(petRoutes);

fastify.get("/", (request, reply) => {
  reply.send({ hello: "world" });
});

/* fastify.get('/test-jwt', {
  preHandler: fastify.verifyJWT
}, async (request, reply) => {
  return { message: 'JWT verification passed!', user: request.user };
}); */

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

