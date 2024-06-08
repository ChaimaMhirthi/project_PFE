const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authRouter = require('./routes/auth');
const projectRouter = require('./routes/project');
const commentRouter = require('./routes/comment');
const resourceRouter = require('./routes/inspectionResource');
const usersRouter = require('./routes/user');
const infrastructureRouter = require('./routes/infrastructure');
const result = require('./routes/results');
const missionsRouter = require('./routes/missions');
const bodyParser = require('body-parser');

const { authenticateToken } = require('./middleware/authenticationToken');
const { checkStatus} = require('./middleware/checkStatus');
const { getDataStatistics } = require('./controller/DataStatystics');

const path = require('path'); // Import du module path
const config = require('./config.json');
const port = process.env.PORT || 3000;
const app = express();

const sharedRepo = config.sharedRepo;

app.use(express.static(sharedRepo));


async function testConnection() {
    try {
        await prisma.$connect();
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/auth', authRouter);

// Appliquer authenticateToken globalement pour toutes les routes sauf /auth
app.use(authenticateToken);
app.use(checkStatus);

app.use('/infrastructure', infrastructureRouter);
app.use('/project', projectRouter);
app.use('/comment', commentRouter);
app.use('/results', result);
app.use('/users', usersRouter);
app.use('/missions', missionsRouter);
app.get('/getDataStatystics', getDataStatistics);

console.log(__dirname);

module.exports = sharedRepo;

app.listen(port, () => {
    testConnection();
    console.log(`🚀 Server ready at: http://localhost:${port}`);
});
