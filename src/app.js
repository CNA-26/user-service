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

    // Non auth endpoints, to the same path, need to be defined first before auth endpoints,
    // otherwise auth logic is applied to non auth endpoints!
    app.use('/api/auth/users', require('./routes/postRequestPasswordReset'));
    app.use('/api/auth/users', require('./routes/patchUpdatePassword')(container));
    app.use('/api/auth/users', require('./routes/postUsers')(container));
    app.use('/api/auth/users', require('./routes/postResetPassword')(container));

    app.use('/api/auth/users', authMiddleware, require('./routes/getUsers'));
    app.use('/api/auth/users', authMiddleware, require('./routes/putUsers'));
    app.use('/api/auth/users', authMiddleware, require('./routes/deleteUsers'));

    return app;
};
