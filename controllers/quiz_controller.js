var models = require('../models/models.js')

/*
// GET /quizes/question
exports.question = function(req, res) {
  models.Quiz.findAll().success(function(quiz){
    res.render('quizes/question', {pregunta: quiz[0].pregunta});
  })
};
// GET /quizes/answer
exports.answer = function(req, res) {
  models.Quiz.findAll().success(function(quiz) {
    if (req.query.respuesta === quiz[0].respuesta) {
      res.render('quizes/answer', {respuesta: 'Correcto'});
    }
    else {
      res.render('quizes/answer', {respuesta: 'Incorrecto'});
    }
  })
};
*/

// AutoLoad - Refactor the code if the route have :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId));}
    }
  ).catch(function(error) { next(error); });
};

// GET /quizes
exports.index = function(req, res) {
  if(req.query.search!="") {
    var info=(req.query.search||"").replace(" ","%");
  } else {
    info = "";
  }
  models.Quiz.findAll({
    where:['pregunta like ?', '%'+info+'%'], order:'pregunta ASC'
  }).then(
    function(quizes) {
      res.render('quizes/index', {quizes: quizes, errors: []});
    }
  ).catch(function(error) {next(error);})
};

// GET /quizes/:id
exports.show = function(req, res) {
//  models.Quiz.findById(req.params.quizId).then(function(quiz){
    res.render('quizes/show', { quiz: req.quiz, errors: []});
//  })
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
//  models.Quiz.findById(req.params.quizId).then(function(quiz) {
    var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
//    res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto'});
      resultado = 'Correcto';
    }
//    else {
      res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
//    }
//  })
};

// GET /author
exports.author = function(req, res) {
  res.render('author/author.ejs', {quiz: req.quiz, title: 'Creditos', errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build ( // Crea un objeto quiz
    { pregunta: "Pregunta", respuesta: "Respuesta", tema:""}
  );
  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

  quiz
  .validate()
  .then( function(err){
    if (err) {
      res.render('quizes/new', {quiz: quiz, errors: err.errors});
    } else {
      // Save in DB question & answer of quiz.
      quiz
      .save( {fields: ["pregunta", "respuesta", "tema"]})
      .then(function() { res.redirect('/quizes')})
    }  // Redirect HTTP (relative URL) list of questions
  }
);};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz; //AutoLoad of quiz's instance

  res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errrors});
      } else {
        req.quiz   // save: save question & answer in DB
        .save( {fields: ["pregunta", "respuesta", "tema"]})
        .then( function(){ res.redirect('/quizes');});
      } // Redirect HTTP (relative URL) list of questions
    }
  );
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};
