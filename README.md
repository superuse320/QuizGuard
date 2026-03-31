# QuizzIA

[![Hackathon CubePath](https://img.shields.io/badge/Hackathon-CubePath-0EA5E9)](#)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%7C%20DB%20%7C%20Realtime-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-AI-6B46C1)](https://openrouter.ai/)
[![Groq](https://img.shields.io/badge/Groq-LLM%20API-111111)](https://groq.com/)
[![Cerebras](https://img.shields.io/badge/Cerebras-Cloud%20SDK-EA580C)](https://www.cerebras.net/)
[![Swagger](https://img.shields.io/badge/API%20Docs-Swagger-85EA2D?logo=swagger&logoColor=black)](https://swagger.io/)
[![Inspirado por Midudev](https://img.shields.io/badge/Inspirado%20por-Midudev-9146FF?logo=twitch&logoColor=white)](https://www.twitch.tv/midudev)

Plataforma backend para crear formularios, examenes y encuestas con IA de forma rapida, profesional y confiable.

## Que resuelve? 🎯
QuizzIA ayuda a instituciones y equipos a generar preguntas de calidad sin perder tiempo en armado manual.

Esta pensado para:
- universidades,
- investigadores,
- profesores,
- educadores,
- academias y programas de formacion.

Con QuizzIA puedes:
- generar cuestionarios por tema y nivel,
- evaluar respuestas con feedback estructurado,
- regenerar preguntas especificas,
- mantener salida JSON valida con validaciones estrictas.

## Stack utilizado 🧱
- Node.js + Express 5
- Supabase (Auth + DB + Realtime)
- OpenRouter, Groq y Cerebras (rotacion de proveedores IA)
- Swagger para documentacion
- Docker + Docker Compose

## Endpoints principales 🔌
Base URL local: `http://localhost:3000/api`

- `GET /me`
- `POST /quiz/generate`
- `POST /quiz/evaluate`
- `POST /quiz/regenerate-question` (questionIndex inicia en 1)

## Documentacion API 📚
Con el servidor encendido:

- `http://localhost:3000/api/docs`

## Variables de entorno 🔐
Crear `.env` en la raiz:

```env
PORT=3000
NODE_ENV=local

SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SERVICE_KEY=TU_SUPABASE_SERVICE_ROLE_KEY

OPENROUTER_API_KEY=TU_OPENROUTER_KEY
GROQ_API_KEY=TU_GROQ_KEY
CEREBRAS_API_KEY=TU_CEREBRAS_KEY
```

## Inicio rapido ⚡
```bash
npm install
npm run dev
```

## Contribuidores 🤝
- obed-tc
- superuse320
