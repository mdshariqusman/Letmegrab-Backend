const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
var cors = require('cors')

dotenv.config();
const app = express();
app.use(morgan('dev'))
app.use(express.json())
const port = 8000;
app.use(cors())

app.use('/letmegrab', require('./routes/productRoutes'))

app.listen(process.env.PORT || port, () => {
    console.log(`listen on ${process.env.PORT || port}`);
})