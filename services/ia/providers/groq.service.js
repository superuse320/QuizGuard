const { groq } = require('../../../config/iaConfig');

const callGroq = async (payload) => {
  console.log("[Groq] Iniciando petición...");
  try {
    const completion = await groq.chat.completions.create({
      ...payload,
      model: "llama-3.3-70b-versatile",
      max_tokens: 1500, 
      temperature: 0.1, 
     
      stream: false,
    });
    console.log("[Groq] Respuesta recibida con éxito.");
     console.log("MEsssage",completion.choices[0].message.content)
    return completion.choices[0].message.content;
  } catch (error) {
    console.error(`[Groq] Error: ${error.message}`);
    throw error;
  }
};

module.exports = { callGroq };