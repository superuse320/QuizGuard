const { cerebras } = require('../../../config/iaConfig');
const callCerebras = async (payload) => {
  //console.log(" [Cerebras] Iniciando petición...");
  try {
    const completion = await cerebras.chat.completions.create({
      ...payload,
      model: "llama3.1-8b", 
      stream: false,
      temperature: 0.1, 
      max_completion_tokens: 8000,  
      response_format: { type: "json_object" },
    });
    if (completion && completion.choices && completion.choices[0]) {
   //   console.log("[Cerebras] Respuesta recibida con éxito.");
      return completion.choices[0].message.content;
    } else {
      throw new Error("Estructura de respuesta inesperada ");
    }
  } catch (error) {
    //console.error(`[Cerebras] Error: ${error.message}`);
    throw error; 
  }
};

module.exports = { callCerebras };