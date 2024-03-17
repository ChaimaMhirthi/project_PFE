const express = require('express');
// ya chayma raw mkch t5dm bl typescript bch t3ml import !!!

const cors = require('cors');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const guestRouter = require('./routes/guest');
const authenticateToken = require('./middleware/authenticationToken');

// manich nasma3 fik


const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/guest', guestRouter);

app.listen(port, () =>
  console.log(`🚀 Server ready at: http://localhost:${port}`),
);