const Groq = require("groq-sdk");
const { QUIZ_GENERATOR_PROMPT, QUIZ_EVALUATOR_PROMPT,QUIZ_REGENERATOR_PROMPT } = require("./quiz.agents");
const groq = new Groq();
const generateQuiz = async (topic) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        QUIZ_GENERATOR_PROMPT,
        { role: "user", content: `Genera un cuestionario avanzado sobre: ${topic}` }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.2
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error al generar quiz:", error);
    throw error;
  }
};
const evaluateQuiz = async (resultsData) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        QUIZ_EVALUATOR_PROMPT,
        { 
          role: "user", 
          content: `Analiza estos resultados: ${JSON.stringify(resultsData)}` 
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error al evaluar quiz:", error);
    throw error;
  }
};
const regenerateQuestion = async ({ currentQuiz, questionIndex, instruction }) => {
  const preguntaActual = currentQuiz.questions[questionIndex];

  const completion = await groq.chat.completions.create({
    messages: [
      QUIZ_REGENERATOR_PROMPT,
      {
        role: "user",
        content: `Cuestionario actual: ${JSON.stringify(currentQuiz, null, 2)}

Pregunta a reemplazar (índice ${questionIndex}):
${JSON.stringify(preguntaActual, null, 2)}

Instrucción del usuario: "${instruction}"

Devuelve SOLO el JSON de la nueva pregunta con la misma estructura.`
      }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    temperature: 0.7
  });

  return JSON.parse(completion.choices[0].message.content);
};



module.exports = { generateQuiz, evaluateQuiz,regenerateQuestion  };