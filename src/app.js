const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

module.exports = (container) => {
    const app = express();
    app.use(bodyParser.json());

    // Swagger docs
    app.use("/api/auth/users", require('./routes/postUsers'));
    app.use('/api/auth/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Routes
    app.use("/api/auth/refresh", require('./routes/postRefresh')(container));
    app.use("/api/auth/logout", require('./routes/postLogout')(container));
    app.use('/api/auth/login', require('./routes/postLogin')(container));

    return app;
};