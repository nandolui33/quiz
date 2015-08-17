// MW de autorizacion de accesos HTTP restringidos

exports.loginRequired = function(req, res, next){
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
};

// Get /login   -- Formulario del login
exports.new = function(req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {};

    res.render('sessions/new', {errors: errors});
};

// POST /login   -- Crear la sesion 
exports.create = function(req, res) {

    var login     = req.body.login;
    var password  = req.body.password;

    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error, user) {

        if (error) {  // Si hay un error retornamos mensajes de error de sesión
            req.session.errors = [{"message": 'Error fatal obtenido : '+error}];
            res.redirect("/login");        
            return;
        }

        // Crear req.session.user y guardar campos   id  y  username
        // La sesión se define por la existencia de:    req.session.user
        req.session.user = {id:user.id, username:user.username};
		
		//Crea rq.session.tiempo para guardar la hora del reloj del sistema
		req.session.tiempo = new Date().getTime();
		req.session.autoLogout = false;

        res.redirect(req.session.redir.toString());// redirección a path anterior de login
    });
};

// DELETE /Desconexión   -- Destruir la sesion 
exports.destroy = function(req, res) {
    delete req.session.user;
	if(req.session.autoLogout) {//si el valor pasó a true en app.js
		res.redirect("/login"); //se redirecciona y se muestra mensaje de +2 minutos
		}else {
			res.redirect(req.session.redir.toString()); // redirección a path anterior, path de login
		}    
};







