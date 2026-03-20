const swaggerJsdoc = require('swagger-jsdoc')
require('dotenv').config()

const servers = {
  local:      'http://localhost:3000',
  test:       'https://test.tudominio.com',
  production: 'https://tudominio.com'
}

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'QuizGuard API',
      version:     '1.0.0',
      description: 'API para sistema de exámenes con IA'
    },
    servers: [
      {
        url:         servers[process.env.NODE_ENV] || servers.local,
        description: process.env.NODE_ENV || 'local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type:         'http',
          scheme:       'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Profile: {
          type: 'object',
          properties: {
            id:         { type: 'string', format: 'uuid' },
            name:     { type: 'string', example: 'Juan García' },
            role:        { type: 'string', enum: ['student', 'teacher', 'admin'] },
            created_at:  { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            ok:      { type: 'boolean', example: false },
            mensaje: { type: 'string',  example: 'Error message' },
            data:    { type: 'null' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            ok:      { type: 'boolean', example: true },
            mensaje: { type: 'string',  example: 'OK' },
            data:    { type: 'object' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js']
}

module.exports = swaggerJsdoc(options)