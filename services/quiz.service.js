const { callAIWithRotation } = require('./ia/iaRotation.service');
const { 
  QUIZ_GENERATOR_PROMPT, 
  QUIZ_EVALUATOR_PROMPT, 
  QUIZ_REGENERATOR_PROMPT,
  VALID_QUESTION_TYPES
} = require("./quiz.agents");

const TYPES_WITH_OPTIONS_AND_ONE_CORRECT = new Set(['choice_unique', 'dropdown']);
const TYPES_WITH_OPTIONS_AND_MULTI_CORRECT = new Set(['multiple_choice']);
const TYPES_WITH_OPTIONS_NO_CORRECT = new Set(['checkboxes']);
const TYPES_OPEN_TEXT_WITH_CORRECT = new Set(['short_answer', 'paragraph']);

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const isStringArray = (value) => Array.isArray(value) && value.every((item) => typeof item === 'string');
const isNumberArray = (value) => Array.isArray(value) && value.every((item) => typeof item === 'number' && Number.isFinite(item));

const OPEN_TEXT_FALLBACKS = {
  short_answer: ['Respuesta técnicamente correcta'],
  paragraph: ['Desarrolla una respuesta coherente con el tema', 'Incluye conceptos clave del tema']
};

const ensureStringArray = (value, fieldName) => {
  if (!isStringArray(value) || value.length === 0) {
    throw new Error(`Campo inválido: ${fieldName} debe ser un array de strings no vacío`);
  }
  return value.map((item) => item.trim()).filter(Boolean);
};

const ensureOptions = (question) => {
  const options = ensureStringArray(question.options, `questions[].options (${question.type})`);
  if (options.length < 2) {
    throw new Error(`Campo inválido: questions[].options (${question.type}) debe tener al menos 2 elementos`);
  }
  return options;
};

const ensureCorrectAnswersInOptions = (correctAnswers, options, expectedCount, questionType) => {
  const uniqueCorrectAnswers = [...new Set(correctAnswers.map((item) => item.trim()))].filter(Boolean);
  if (expectedCount === 1 && uniqueCorrectAnswers.length !== 1) {
    throw new Error(`Campo inválido: correctAnswers[] en ${questionType} debe tener exactamente 1 elemento`);
  }
  if (expectedCount === 'multi' && uniqueCorrectAnswers.length < 2) {
    throw new Error(`Campo inválido: correctAnswers[] en ${questionType} debe tener 2 o más elementos`);
  }
  const missing = uniqueCorrectAnswers.filter((answer) => !options.includes(answer));
  if (missing.length > 0) {
    throw new Error(`Campo inválido: correctAnswers[] en ${questionType} contiene valores fuera de options[]`);
  }
  return uniqueCorrectAnswers;
};

const normalizeCorrectAnswersFromOptions = (question, options, expectedCount, questionType) => {
  const rawCandidates = [
    question.correctAnswers,
    question.correctAnswer,
    question.answerKey,
    question.expectedAnswers,
    question.answer,
    question.expected
  ];

  let extracted = [];
  for (const candidate of rawCandidates) {
    if (isStringArray(candidate) && candidate.length > 0) {
      extracted = candidate.map((item) => item.trim()).filter(Boolean);
      break;
    }
    if (typeof candidate === 'string' && candidate.trim()) {
      extracted = [candidate.trim()];
      break;
    }
  }

  const filteredInOptions = [...new Set(extracted)].filter((answer) => options.includes(answer));
  if (expectedCount === 1) {
    if (filteredInOptions.length >= 1) return [filteredInOptions[0]];
    return [options[0]];
  }

  // expectedCount === 'multi'
  if (filteredInOptions.length >= 2) return filteredInOptions;
  if (filteredInOptions.length === 1 && options.length >= 2) {
    const nextOption = options.find((opt) => opt !== filteredInOptions[0]);
    return nextOption ? [filteredInOptions[0], nextOption] : [filteredInOptions[0]];
  }
  if (options.length >= 2) return [options[0], options[1]];

  throw new Error(`Campo inválido: correctAnswers[] en ${questionType} no se pudo normalizar`);
};

const extractCandidateCorrectAnswers = (question) => {
  const candidates = [
    question.correctAnswers,
    question.correctAnswer,
    question.expectedAnswers,
    question.answerKey,
    question.answer,
    question.expected
  ];

  for (const candidate of candidates) {
    if (isStringArray(candidate) && candidate.length > 0) {
      const cleaned = candidate.map((item) => item.trim()).filter(Boolean);
      if (cleaned.length > 0) return cleaned;
    }
    if (typeof candidate === 'string' && candidate.trim()) {
      return [candidate.trim()];
    }
  }

  return [];
};

const normalizeAndValidateQuestion = (question, index) => {
  if (!isObject(question)) {
    throw new Error(`Pregunta inválida en índice ${index}: debe ser un objeto`);
  }

  const type = String(question.type || '').trim();
  if (!VALID_QUESTION_TYPES.includes(type)) {
    throw new Error(`Pregunta inválida en índice ${index}: tipo no permitido (${type || 'vacío'})`);
  }
  if (!isNonEmptyString(question.title)) {
    throw new Error(`Pregunta inválida en índice ${index}: title es obligatorio`);
  }

  const normalized = {
    ...question,
    type,
    title: question.title.trim(),
    description: typeof question.description === 'string' ? question.description.trim() : ''
  };

  if (TYPES_WITH_OPTIONS_AND_ONE_CORRECT.has(type)) {
    const options = ensureOptions(normalized);
    const correctAnswers = normalizeCorrectAnswersFromOptions(normalized, options, 1, type);
    normalized.options = options;
    normalized.correctAnswers = ensureCorrectAnswersInOptions(correctAnswers, options, 1, type);
    delete normalized.correctAnswer;
    delete normalized.answerKey;
    delete normalized.expectedAnswers;
    delete normalized.answer;
    delete normalized.expected;
    return normalized;
  }

  if (TYPES_WITH_OPTIONS_AND_MULTI_CORRECT.has(type)) {
    const options = ensureOptions(normalized);
    const correctAnswers = normalizeCorrectAnswersFromOptions(normalized, options, 'multi', type);
    normalized.options = options;
    normalized.correctAnswers = ensureCorrectAnswersInOptions(correctAnswers, options, 'multi', type);
    delete normalized.correctAnswer;
    delete normalized.answerKey;
    delete normalized.expectedAnswers;
    delete normalized.answer;
    delete normalized.expected;
    return normalized;
  }

  if (TYPES_WITH_OPTIONS_NO_CORRECT.has(type)) {
    normalized.options = ensureOptions(normalized);
    delete normalized.correctAnswers;
    return normalized;
  }

  if (TYPES_OPEN_TEXT_WITH_CORRECT.has(type)) {
    const extractedAnswers = extractCandidateCorrectAnswers(normalized);
    const fallbackAnswers = OPEN_TEXT_FALLBACKS[type] || ['Respuesta válida'];
    const safeCorrectAnswers = extractedAnswers.length > 0 ? extractedAnswers : fallbackAnswers;
    normalized.correctAnswers = [...new Set(safeCorrectAnswers)];
    delete normalized.options;
    delete normalized.correctAnswer;
    delete normalized.expectedAnswers;
    delete normalized.answerKey;
    delete normalized.answer;
    delete normalized.expected;
    return normalized;
  }

  if (type === 'linear_scale') {
    const scaleMin = Number.isFinite(normalized.scaleMin) ? normalized.scaleMin : 1;
    const scaleMax = Number.isFinite(normalized.scaleMax) ? normalized.scaleMax : 5;
    if (scaleMin >= scaleMax) {
      throw new Error('Campo inválido: linear_scale requiere scaleMin < scaleMax');
    }
    normalized.scaleMin = scaleMin;
    normalized.scaleMax = scaleMax;
    normalized.scaleMinLabel = isNonEmptyString(normalized.scaleMinLabel) ? normalized.scaleMinLabel.trim() : 'Insatisfecho';
    normalized.scaleMaxLabel = isNonEmptyString(normalized.scaleMaxLabel) ? normalized.scaleMaxLabel.trim() : 'Satisfecho';
    delete normalized.correctAnswers;
    delete normalized.options;
    delete normalized.emojis;
    return normalized;
  }

  if (type === 'emoji_scale') {
    normalized.scaleMin = 1;
    normalized.scaleMax = 5;
    normalized.scaleMinLabel = isNonEmptyString(normalized.scaleMinLabel) ? normalized.scaleMinLabel.trim() : 'Muy bajo';
    normalized.scaleMaxLabel = isNonEmptyString(normalized.scaleMaxLabel) ? normalized.scaleMaxLabel.trim() : 'Muy alto';
    delete normalized.correctAnswers;
    delete normalized.options;
    delete normalized.emojis;
    return normalized;
  }

  if (type === 'star_rating') {
    normalized.starsMax = 5;
    delete normalized.correctAnswers;
    delete normalized.options;
    return normalized;
  }

  if (type === 'ranking') {
    const options = ensureOptions(normalized);
    const correctAnswers = ensureStringArray(normalized.correctAnswers, 'questions[].correctAnswers (ranking)');
    if (correctAnswers.length !== options.length) {
      throw new Error('Campo inválido: ranking requiere correctAnswers[] con el mismo tamaño que options[]');
    }
    const optionsSet = new Set(options);
    if (new Set(correctAnswers).size !== options.length || correctAnswers.some((item) => !optionsSet.has(item.trim()))) {
      throw new Error('Campo inválido: ranking requiere que correctAnswers[] sea un orden exacto de options[]');
    }
    normalized.options = options;
    normalized.correctAnswers = correctAnswers;
    return normalized;
  }

  if (type === 'number') {
    const min = Number.isFinite(normalized.min) ? normalized.min : 0;
    const max = Number.isFinite(normalized.max) ? normalized.max : 999999;
    if (min > max) {
      throw new Error('Campo inválido: number requiere min <= max');
    }
    if (!isNumberArray(normalized.correctAnswers) || normalized.correctAnswers.length === 0) {
      throw new Error('Campo inválido: number requiere correctAnswers[] numérico no vacío');
    }
    normalized.min = min;
    normalized.max = max;
    normalized.correctAnswers = normalized.correctAnswers;
    delete normalized.options;
    return normalized;
  }

  if (['email', 'url', 'phone', 'date'].includes(type)) {
    delete normalized.correctAnswers;
    delete normalized.options;
    return normalized;
  }

  return normalized;
};

const validateQuizPayload = (payload) => {
  if (!isObject(payload)) {
    throw new Error('La respuesta de IA debe ser un objeto JSON');
  }
  if (payload.type === 'object' && Object.keys(payload).length <= 2) {
    throw new Error('Respuesta inválida de IA: objeto de esquema detectado, se esperaba un cuestionario completo');
  }
  if (!Array.isArray(payload.questions) || payload.questions.length === 0) {
    throw new Error('Respuesta inválida de IA: questions[] debe existir y tener al menos 1 pregunta');
  }

  const normalizedQuestions = payload.questions.map((question, index) => normalizeAndValidateQuestion(question, index));
  const cappedQuestions = normalizedQuestions.slice(0, 20);
  return {
    ...payload,
    version: isNonEmptyString(payload.version) ? payload.version.trim() : '1.0',
    title: isNonEmptyString(payload.title) ? payload.title.trim() : 'Cuestionario generado',
    description: typeof payload.description === 'string' ? payload.description.trim() : '',
    questions: cappedQuestions
  };
};

const validateFeedbackPayload = (payload) => {
  if (!isObject(payload)) {
    throw new Error('Respuesta inválida de IA: feedback debe ser un objeto');
  }
  if (!isObject(payload.metadata) || typeof payload.metadata.score !== 'number') {
    throw new Error('Respuesta inválida de IA: metadata.score es obligatorio y numérico');
  }
  if (!Array.isArray(payload.evaluation)) {
    throw new Error('Respuesta inválida de IA: evaluation debe ser un array');
  }
  return payload;
};

const validateSingleQuestionPayload = (payload) => normalizeAndValidateQuestion(payload, 0);

const isDetailedUserPrompt = (text) => {
  if (!isNonEmptyString(text)) return false;
  const detailedHints = [
    /\b\d+\s*preguntas?\b/i,
    /opci[oó]n/i,
    /selecci[oó]n\s*[uú]nica/i,
    /nivel/i,
    /tema|incluye|evita/i,
    /clara|precisa|ambig/i
  ];
  return detailedHints.filter((rx) => rx.test(text)).length >= 2;
};

const buildGeneratorUserPrompt = (topic) => {
  const raw = isNonEmptyString(topic) ? topic.trim() : 'Haz un formulario de conocimiento general';
  if (isDetailedUserPrompt(raw)) {
    return raw;
  }

  return `${raw}

Si no se especifica otra cosa:
- Genera 10 preguntas
- Tipo de formulario por defecto: examen
- Tipo de pregunta por defecto: choice_unique (selección única)
- Si el usuario pide encuesta/forms, usa checkboxes por defecto
- Máximo permitido: 20 preguntas`;
};

const generateQuiz = async (topic) => {
  try {
    const userPrompt = buildGeneratorUserPrompt(topic);
    const result = await callAIWithRotation({
      messages: [
        QUIZ_GENERATOR_PROMPT,
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    }, { validate: validateQuizPayload });

    return result;
  } catch (error) {
    console.error("Error al generar quiz:", error);
    throw error;
  }
};

const evaluateQuiz = async (resultsData) => {
  try {
    const result = await callAIWithRotation({
      messages: [
        QUIZ_EVALUATOR_PROMPT,
        { 
          role: "user", 
          content: `Analiza estos resultados: ${JSON.stringify(resultsData)}` 
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    }, { validate: validateFeedbackPayload });

    return result;
  } catch (error) {
    console.error("Error al evaluar quiz:", error);
    throw error;
  }
};

const regenerateQuestion = async ({ currentQuiz, questionIndex, instruction }) => {
  try {
    const preguntaActual = currentQuiz.questions[questionIndex];

    const result = await callAIWithRotation({
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
      response_format: { type: "json_object" },
      temperature: 0.7
    }, { validate: validateSingleQuestionPayload });

    return result;
  } catch (error) {
    console.error("Error al regenerar pregunta:", error);
    throw error;
  }
};

module.exports = { generateQuiz, evaluateQuiz, regenerateQuestion };