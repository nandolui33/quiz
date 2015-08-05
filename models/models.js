var path = require('path');


// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name   = (url[6]||null);
var user      = (url[2]||null);
var pwd       = (url[3]||null);
var protocol  = (url[1]||null);
var dialect   = (url[1]||null);
var port      = (url[5]||null);
var host      = (url[4]||null);
var storage   = process.env.DATABASE_STORAGE;

// Load ORM Model.
var Sequelize = require('sequelize');

/*
//Use BBDD SQLite
var sequelize  = new Sequelize(null, null, null,
  {dialect: "sqlite", storage: "quiz.sqlite"}
);
*/

//Use BBDD SQLite or Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
    {dialect:    protocol,
     storage:    protocol,
     port:       port,
     host:       host,
     storage:    storage,  // solo SQLite (.env)
     omitNull:   true      // solo Postgres
   }
);

//Import definition of the Quiz table to quiz.js.
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

//Export definition of the Quiz table.
exports.Quiz = Quiz;

// sequelize.sync() Create and init the table in DDBB.
sequelize.sync().then(function() {
  // then(..) Run handle when Create the table.
  Quiz.count().then(function(count) {
    // the table init only if the table is empty.
    if (count === 0) {
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma',
                    tema: 'Humanidades'
                 });
      Quiz.create({ pregunta: 'Capital de Portugal',
                    respuesta: 'Lisboa',
                    tema: 'Humanidades'
                  })
      .then(function(){console.log('BBDD inicializada.')});
    };
  });
});
