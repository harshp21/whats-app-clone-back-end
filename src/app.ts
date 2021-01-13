// importing
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoute from './router/user/user-route';
import indexRoute from './router/index/index-route';
import bodyParser from 'body-parser';
import cors from 'cors';

// app config
const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: process.env.REQUEST_ORIGIN
}))

// router
app.use('/', indexRoute);
app.use('/user', userRoute);

// db config
const connectionUrl = process.env.MONGODB_CONNECTION_URL;
mongoose.connect(connectionUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Successfully connected to mongodb")).catch(err => console.log("mongo error", err));


// app listen
app.listen(port, () => console.log(`listening on port : ${port}`));