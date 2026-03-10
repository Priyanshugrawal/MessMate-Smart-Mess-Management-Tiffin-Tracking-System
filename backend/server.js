require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const setupSockets = require('./src/socket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
setupSockets(server);

server.listen(PORT, () => {
  console.log(`MessMate backend running on port ${PORT}`);
});
