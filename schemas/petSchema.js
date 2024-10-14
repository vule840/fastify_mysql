const petSchemas = {
    getPetsSchema: {
      params: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'integer', minimum: 1 }
        }
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              type: { type: 'string' },
              user_id: { type: 'number' }
            }
          }
        }
      }
    },
  
    addPetSchema: {
      body: {
        type: 'object',
        required: ['name', 'type'],
        properties: {
          name: { type: 'string', minLength: 3 },
          type: { type: 'string', minLength: 3 },
          user_id: { type: 'integer' }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            msg: { type: 'string' },
            petId: { type: 'number' }
          }
        }
      }
    }
  };
  
  module.exports = petSchemas;
  