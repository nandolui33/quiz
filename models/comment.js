/// <reference path="../typings/tsd.d.ts" />

module.exports = function(sequelize, DataTypes){
	return sequelize.define(
		'Comment',
		{texto: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta un comentario"}}
		},
		publicado: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	  }
	);
}