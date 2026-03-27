const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'QuizGuard API',
    description: 'API para generación y evaluación de cuestionarios técnicos con IA',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Ingresa el token JWT en el formato: Bearer <token>'
    }
  }
};

const outputFile = './swagger_output.json'; // Archivo que se generará
const endpointsFiles = ['./routes/api.routes.js']; // Ruta a tus archivos de rutas

// Ejecutar la generación
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index.js'); // Opcional: arranca el servidor después de generar
});