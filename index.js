require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const port = process.env.PORT;

const httpStatusText = require('./utils/httpStatusText');

const app = express();

app.use(express.json());

const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => {
    console.log("mongodb server started");
})

const userRouter = require('./router/user.router');

app.use("/api/users", userRouter);


app.all("*", (req, res, next) => {

    res.status(400).json({
        status: httpStatusText.ERROR,
        data: null,
        message: "URL may be wrong"
    });
});

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        status: err.statusText || httpStatusText.ERROR,
        data: null,
        message: err.message || "some thing wrong"
    });
});


app.listen(port, () => {
    console.log(`listening on port ${port}`);
})