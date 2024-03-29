const express = require('express')
const cors = require('cors');

const app = express()
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;
const authenticateToken = require('./middleware/authenticationToken');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

app.use('/auth', authRouter);

app.use('/user',authenticateToken, userRouter);


app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}`),
);