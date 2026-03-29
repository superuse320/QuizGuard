const OpenAI = require("openai");
const Groq = require("groq-sdk");
const Cerebras = require("@cerebras/cerebras_cloud_sdk"); 

const openRouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});
const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY 
});
const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY, 
});
module.exports = { 
  openRouter, 
  groq, 
  cerebras 
};