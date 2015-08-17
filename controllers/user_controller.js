
var users = { admin: {id: 1, username:"admin", password: "1234"},
			  jart:  {id: 2, username:"jart",  password: "1015"}
	};

	// Comprueba si el usuario esta registrado en users
	// Si la autenticacion falla o hay errores se ejecuta callback de error
exports.autenticar = function(login, password, callback){
	if(users[login]){
		if(password===users[login].password){
			callback(null, users[login]);
		}else{
			callback(new Error('Password erroneo.'));
		}
	}else{
		callback(new Error('No existe el usuario'));
	}	
};