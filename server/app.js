var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
var apiRouter = require('./routes/testApi');
var classRouter = require('./routes/classes');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/User.js');
var cors = require('cors');
var swaggerUi = require('swagger-ui-express'), swaggerDocument = require('./swagger.json');
const config = require('./config');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://server-database:27017/my_db', {useNewUrlParser: true})
  .then(() => console.log('Successfully connected to my_db'))
  .catch((err) => console.error(err));
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var jwtAuth = require('socketio-jwt-auth');

//io.use(cors());

io.use(jwtAuth.authenticate({
  secret: config.secret,
  algorithm: 'HS256'
}, function(payload, done) {
  User.findOne({ _id: payload._id}, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, 'User does not exist');
    }

    return done(null, user);
  })
}));

io.on('connection', function (socket) {
  console.log('A user connected');
  console.log(socket.request.user);
  socket.on('disconnect', function() {
    console.log('A user disconnected');
  });
  socket.on('SEND_MESSAGE', function (data) {
    io.sockets.in(data.user.class).emit('MESSAGE', data)
    //console.log(data)
  });
  socket.on('join', function (data) {
    socket.join(data.username);
  });
  socket.on('join class', function (data) {
    socket.join(data.class);
  })
  socket.on('send private message', function (data) {
    io.sockets.in(data.receiver).emit('new private message', data);
    io.sockets.in(data.sender.username).emit('new private message', data);
  })
  //socket.on('save-message', function (data) {
    //console.log(data);
    //io.emit('new-message', { message: data });
  //});
});
io.listen(3001)
app.use(cors());
//const enableCrossDomain = function (req, res, next) {
  //res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  //res.header('Access-Control-Allow-Methods', '*');
  //res.header('Access-Control-Allow-Headers', '*');
  //next();
//}
//app.use(enableCrossDomain)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/testapi', apiRouter);
app.use('/classes', classRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(require('express-session')({
  secret: config.secret,
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

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
