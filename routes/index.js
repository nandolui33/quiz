var express = require('express');
var router = express.Router();

// Controller quiz_controller.
var quizController = require('../controllers/quiz_controller');
//var authorController = require('../controllers/author_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz', errors: []});
});

// Routes quizController.
/*
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);
*/

router.get('/author', quizController.author);


// AutoLoad of commands with :quizId
router.param('quizId', quizController.load); //AutoLoad :quizId

// Def. of routes of /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizes/:quizId(\\d+)', quizController.update);
router.delete('/quizes/:quizId(\\d+)', quizController.destroy);

module.exports = router;
