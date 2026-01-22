const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User service API',
            version: '1.0.0',
            description: 'API docs',
        },
    },
    apis: ['./src/routes/*.js'], // scan route files for JSDoc
};

module.exports = swaggerJsdoc(options);
