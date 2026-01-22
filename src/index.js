require('dotenv').config();

const {createContainer} = require('./container');
const createApp = require('./app');

const container = createContainer();
const app = createApp(container);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
