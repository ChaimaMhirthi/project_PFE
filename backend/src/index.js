const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');
const projectRouter = require('./routes/project');
const commentRouter = require('./routes/comment');
const resourceRouter = require('./routes/inspectionResource');
const usersRouter= require('./routes/user');
const infrastructureRouter = require('./routes/infrastructure');
const result = require('./routes/results');
const bodyParser = require('body-parser');
const {authenticateToken }= require('./middleware/authenticationToken');
const path = require('path'); // Import du module path
const config = require('./config.json');

const port = process.env.PORT || 3000;
const { PrismaClient } = require('@prisma/client');

const app = express();

const sharedRepo = config.sharedRepo;

app.use(express.static(sharedRepo));

const prisma = new PrismaClient();

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
app.use('/infrastructure',authenticateToken,infrastructureRouter);

app.use('/project', authenticateToken, projectRouter);
app.use('/comment', authenticateToken, commentRouter);
app.use('/results', authenticateToken  ,result);
app.use('/users',authenticateToken,usersRouter );

console.log(__dirname);

module.exports = sharedRepo;

app.listen(port, () => {
    testConnection();
    console.log(`🚀 Server ready at: http://localhost:${port}`);
});
