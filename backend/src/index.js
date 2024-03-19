const express = require('express');

const cors = require('cors');
const authRouter = require('./routes/auth');
const projectRouter = require('./routes/project');
const companyRouter = require('./routes/company');
const authenticateToken = require('./middleware/authenticationToken');


const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/project', authenticateToken, projectRouter);
app.use('/company', authenticateToken, companyRouter);





app.listen(port, () =>
  console.log(`🚀 Server ready at: http://localhost:${port}`),
);