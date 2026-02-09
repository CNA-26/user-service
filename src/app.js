const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

module.exports = (container) => {
    const app = express();
    app.use(bodyParser.json());

    const authMiddleware = require('./middlewares/authMiddleware')(container);

    // Swagger docs
    app.use('/api/auth/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use('/api/auth/refresh', require('./routes/postRefresh')(container));
    app.use('/api/auth/logout', require('./routes/postLogout')(container));
    app.use('/api/auth/login', require('./routes/postLogin')(container));

    app.use('/api/auth/users', require('./routes/postUsers'));
    app.use('/api/auth/users', require('./routes/getUsers'));

    app.put('/api/auth/users', authMiddleware, require('./routes/putUsers'));

    app.use('/api/auth/users', authMiddleware, require('./routes/deleteUsers'));
    app.use('/api/auth/users', require('./routes/postResetPassword'));
    app.use('/api/auth/users', require('./routes/patchUpdatePassword'));

    return app;
};
