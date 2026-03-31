const { callCerebras } = require('./providers/cerebras.service');
const { callGroq } = require('./providers/groq.service');
const { callOpenRouter } = require('./providers/openrouter.service');

const aiInventory = [
  { name: 'Cerebras', execute: (p) => callCerebras(p) },
  { name: 'Groq', execute: (p) => callGroq(p) },
  { name: 'Open iA', execute: (p) => callOpenRouter(p) },
  
];

const IA_TIMEOUT_MS = Number(process.env.IA_TIMEOUT_MS || 25000);
const IA_TIMEOUT_RETRIES = 2;

const withTimeout = (promise, timeoutMs, providerName) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`[timeout] ${providerName} excedió ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
};

const isTimeoutError = (error) => typeof error?.message === 'string' && error.message.includes('[timeout]');

const cleanJSON = (text) => {
  try {
    const raw = text.replace(/```json|```/g, "").trim();
    const match = raw.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : JSON.parse(raw);
  } catch (e) {
    throw new SyntaxError("Error al generar preguntas");
  }
};

async function callAIWithRotation(payload, options = {}) {
  const { validate } = options;
  let lastError = null;

  for (const ai of aiInventory) {
    for (let attempt = 0; attempt <= IA_TIMEOUT_RETRIES; attempt++) {
      try {
       // console.log(`📡 Intentando con: ${ai.name}...`);
        
        const rawResponse = await withTimeout(ai.execute(payload), IA_TIMEOUT_MS, ai.name);
        const parsed = cleanJSON(rawResponse);
        const validated = typeof validate === 'function' ? validate(parsed) : parsed;
        return validated;

      } catch (error) {
        lastError = new Error(`${ai.name}: ${error.message}`);
        const shouldRetryTimeout = isTimeoutError(error) && attempt < IA_TIMEOUT_RETRIES;
        if (shouldRetryTimeout) {
          continue;
        }
        break;
      }
    }
  }
  
  throw new Error(`Se alcanzo el limite. ${lastError ? `Ultimo error: ${lastError.message}` : ''}`.trim());
}

module.exports = { callAIWithRotation };