const createError = require('http-errors');
const compression = require('compression');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const moment = require('moment');
const exphbs = require('express-handlebars');
const logger = require('morgan');
const debug = require('debug')('bits:server');
const http = require('http');

/* eslint-disable */
// Initialize localStorage
if (typeof localStorage === 'undefined' || localStorage === null) {
  let LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
/* eslint-enable */

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Initialize express
const app = express();

// Compression Middleware
function shouldCompress(req, res, next) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }
  // fallback to standard filter function
  return compression.filter(req, res);
}

// compress all responses
app.use(compression({ filter: shouldCompress }));

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handlebars Helpers
const {
  truncate,
  formatDate,
  relativeTime,
  formatCap,
  formatUnderscrore,
  select,
  selectMultiple,
  addTrait,
} = require('./helpers/hbs');

// Handlebars middleware
app.engine('.handlebars', exphbs({
  helpers: {
    truncate: truncate,
    formatDate: formatDate,
    relativeTime: relativeTime,
    formatCap: formatCap,
    formatUnderscrore: formatUnderscrore,
    select: select,
    selectMultiple: selectMultiple,
    addTrait: addTrait,
  },
  defaultLayout: 'main',
  partialsDir: ['./views/partials/'],
  extname: '.handlebars',
}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

// Set Port
const port = normalizePort(process.env.PORT || 5000);
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe  ${addr}` : `port  + ${addr.port}`;
  debug(`Listening on ${bind}`);
}

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
