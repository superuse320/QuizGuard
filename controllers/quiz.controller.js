const quizService        = require('../services/quiz.service');
const asyncHandler       = require('../utils/asyncHandler');
const ApiResponseService = require('../utils/response'); 

const generateNewQuiz = asyncHandler(async (req, res) => {
    const { tema } = req.body;

    if (!tema) {
        return ApiResponseService.error(res, 400, "Por favor, proporciona un tema para el cuestionario.");
    }

    const quizData = await quizService.generateQuiz(tema);
    return ApiResponseService.success(res, "Cuestionario generado exitosamente", quizData); 
});

module.exports = {
    generateNewQuiz
};