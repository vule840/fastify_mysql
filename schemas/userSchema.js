const userSchema = {
    createUserSchema: {
      body: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', minLength: 2 },
          email: { type: 'string', format: 'email' }
        },
        // Custom error messages for validation
        errorMessage: {
          required: {
            name: 'Name is required.',
            email: 'Email is required.'
          },
          properties: {
            name: 'Name should be at least 2 characters long.',
            email: 'Email should be a valid email address.'
          }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            msg: { type: 'string' },
            userId: { type: 'number' }
          }
        }
      }
    },
    getUserSchema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer', minimum: 1 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            email: { type: 'string' },
            pets: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' },
                  type: { type: 'string' },
                  image: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  };
  
  module.exports = userSchema;
  