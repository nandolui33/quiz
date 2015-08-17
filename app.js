var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials=require('express-partials');
var methodOverride=require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(methodOverride('_method'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('Quiz 2015'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());
app.use(session());

//Helpers dinamicos:
app.use(function(req,res,next){
	
	//guardar path en session.redir para despues de login
  if(!req.path.match(/\/login|\/logout/)){
      req.session.redir = req.path;
  }
  
  //Hacer visible req.session en las vistas
  res.locals.session = req.session;
  //Desconectamos el login si el tiempo es superior a 2 minutos
  if (req.session.tiempo){
		var ultimoTiempo = new Date().getTime();
		var intervalo = ultimoTiempo - req.session.tiempo;
			if (intervalo > (2 * 60 * 1000)) {
				delete req.session.tiempo;
				req.session.autoLogout = true;
				res.redirect("/logout");
			} else {
				req.session.tiempo = ultimoTiempo;
			}
		};
  next();  
});

app.use('/', routes);

//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,errors:[]
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},errors:[]
    });
});


module.exports = app;