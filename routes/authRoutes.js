async function authRoutes(fastify, options) {
    fastify.post('/api/login', async (request, reply) => {
      const { username, password } = request.body;
      // Authentication logic
      if (username === 'admin' && password === 'password') {
        const token = fastify.jwt.sign({ username }, { expiresIn: '1h' });
        console.log('token', token);
        
        reply.send({ token });
      } else {
        reply.code(401).send({ error: 'Unauthorized' });
      }
    });
  }
  
  module.exports = authRoutes;