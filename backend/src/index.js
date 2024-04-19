const express = require('express');
const cors = require('cors');
const app  = express();
const authRouter        = require('./routes/auth');
const projectRouter     = require('./routes/project');
const companyRouter     = require('./routes/company');
const commentRouter     = require('./routes/comment');
const bodyParser = require('body-parser');

const authenticateToken = require('./middleware/authenticationToken');
const multer = require('multer');


const port = process.env.PORT || 3000;
const { PrismaClient } = require('@prisma/client');

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

app.use('/project', projectRouter);
app.use('/company', authenticateToken, companyRouter);
app.use('/comment', authenticateToken, commentRouter);
// app.use(authenticateToken,resourceRouter)


/////////////////////////////





app.listen(port, () =>{
  testConnection();

  console.log(`🚀 Server ready at: http://localhost:${port}`)}

);