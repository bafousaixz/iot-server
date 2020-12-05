var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var Mongoose = require('mongoose');

var usersRouter = require('./routes/users');
var iotRouter = require('./routes/iot');
var resourceRouter = require('./routes/resources');

var app = express();

//connect DB
var uri = "mongodb+srv://kuon5895:kuon5895@cluster0.rqptm.mongodb.net/test";
var url = 'mongodb://localhost:27017/mydb';
db = Mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
})
// const port = process.env.port || 3000;
// app.listen(port, () => {
//     console.log("What the f")
// })

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "HEAD,OPTIONS,POST,PUT,GET,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/iots', iotRouter);
app.use('/stations', resourceRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;