const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0', info: {
            title: 'User service API',
            version: '1.0.0',
            description: 'Welcome to User Service API. Feel free to try requests yourself.\n' + '- [Our repository](https://github.com/CNA-26/user-service/)\n' + '- If you need admin rights [create an issue](https://github.com/CNA-26/user-service/issues/new/choose) writing @mentions of our [team members](https://github.com/orgs/CNA-26/teams/user-service) in it or otherwise contact us.',
        },

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http', scheme: 'bearer', bearerFormat: 'JWT',
                },
            },
        },
    },

    apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);