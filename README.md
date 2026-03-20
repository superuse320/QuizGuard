# QuizGuard API

REST API para sistema de exámenes con inteligencia artificial. Permite evaluar respuestas automáticamente con Gemini, detectar trampas en tiempo real con Supabase Realtime y gestionar exámenes, preguntas, intentos y perfiles de usuarios.

---

## Tecnologías

- **Node.js** + **Express 5**
- **Supabase** — base de datos PostgreSQL + Auth + Realtime
- **Gemini API** — evaluación de respuestas con IA
- **Swagger** — documentación de la API
- **Nodemon** — recarga automática en desarrollo

---

## Requisitos

- Node.js v20+
- Cuenta en [Supabase](https://supabase.com)
- API Key de [Google AI Studio](https://aistudio.google.com)

---

## Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/quizguard.git
cd quizguard

# 2. Instala dependencias
npm install

# 3. Configura las variables de entorno
cp .env.example .env
# Edita .env con tus keys

# 4. Corre las migraciones en Supabase SQL Editor
# Pega el contenido de database/migrations/ en orden

# 5. Corre los seeders (opcional)
# Pega el contenido de database/seeders/ en Supabase SQL Editor

# 6. Inicia el servidor
npm run dev
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz con:

```env
PORT=3000
NODE_ENV=local

SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...   # service_role key (nunca la anon key)

GEMINI_API_KEY=AIza...
```

> ⚠️ Nunca subas el `.env` a GitHub. Está en el `.gitignore`.

---

## Scripts

```bash
npm run dev      # Servidor con recarga automática (nodemon)
npm run start    # Servidor en producción
```

---

## Estructura del proyecto

```
quizguard/
├── index.js                    # Entrada del servidor
├── .env                        # Variables de entorno (no subir)
├── .gitignore
├── .htaccess                   # Para cPanel
│
├── config/
│   ├── supabase.js             # Cliente Supabase
│   ├── gemini.js               # Cliente Gemini
│   └── swagger.js              # Configuración Swagger
│
├── routes/
│   ├── auth.routes.js
│   ├── profile.routes.js
│   ├── examenes.routes.js
│   ├── preguntas.routes.js
│   ├── intentos.routes.js
│   └── respuestas.routes.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── profile.controller.js
│   ├── examenes.controller.js
│   ├── preguntas.controller.js
│   ├── intentos.controller.js
│   └── respuestas.controller.js
│
├── models/
│   ├── profile.model.js
│   ├── examen.model.js
│   ├── pregunta.model.js
│   ├── intento.model.js
│   └── respuesta.model.js
│
├── services/
│   └── gemini.service.js       # Evaluar respuestas + feedback
│
├── middlewares/
│   ├── auth.middleware.js      # Verifica token de Supabase
│   ├── roles.middleware.js     # Verifica rol (student/teacher/admin)
│   └── error.middleware.js     # Manejo global de errores
│
├── resources/
│   └── profile.resource.js    # Filtra campos de la respuesta
│
├── utils/
│   ├── response.js             # ApiResponseService
│   └── asyncHandler.js        # Wrapper para errores async
│
└── database/
    ├── migrations/
    │   ├── 001_crear_profiles.sql
    │   ├── 002_crear_examenes.sql
    │   ├── 003_crear_preguntas.sql
    │   ├── 004_crear_intentos.sql
    │   ├── 005_crear_respuestas.sql
    │   └── 006_crear_alertas.sql
    └── seeders/
        └── 001_seeder_profiles.sql
```

---

## Base de datos

### Tablas

| Tabla | Descripción |
|---|---|
| `profiles` | Usuarios (student, teacher, admin) |
| `examenes` | Exámenes creados por profesores |
| `preguntas` | Preguntas generadas por la IA en el frontend |
| `intentos` | Sesión del estudiante en un examen |
| `respuestas` | Respuestas evaluadas por Gemini |
| `alertas` | Trampas detectadas — Supabase Realtime |

### Roles

| Rol | Permisos |
|---|---|
| `student` | Hacer exámenes, ver sus resultados |
| `teacher` | Crear exámenes, ver resultados de estudiantes |
| `admin` | Acceso total al sistema |

## Autenticación

El registro y login lo maneja **Supabase Auth** desde el frontend. El backend solo verifica el token JWT en cada petición.

```
Frontend → supabase.auth.signUp()  → token
Frontend → POST /api/auth/register-profile + token → perfil creado
Frontend → cada petición → Authorization: Bearer token
Backend  → verifica token con Supabase → deja pasar o rechaza
```

---

## Documentación Swagger

Con el servidor corriendo entra a:

```
http://localhost:3000/api/docs
```

Para autenticarte en Swagger:
1. Haz login en Supabase desde Postman para obtener el `access_token`
2. Clic en **Authorize** en Swagger
3. Escribe `Bearer tu_access_token`

---

## Despliegue en cPanel

```
1. Sube el proyecto vía File Manager o Git
2. cPanel → Setup Node.js App → apunta a index.js
3. Environment Variables → agrega SUPABASE_URL, SUPABASE_SERVICE_KEY, GEMINI_API_KEY
4. npm install desde el panel o SSH
5. Inicia la app
```

El archivo `.htaccess` ya está configurado para redirigir al puerto de Node.js.

---

## Tiempo real (Supabase Realtime)

Las alertas de trampas se envían directo desde el frontend a Supabase. El panel del docente escucha los cambios en tiempo real sin pasar por el backend.

```js
// Frontend estudiante — detecta trampa y guarda en Supabase
await supabase.from('alertas').insert({ intento_id, tipo: 'tab_switch' })

// Frontend docente — escucha en tiempo real
supabase.channel('alertas')
  .on('postgres_changes', { event: 'INSERT', table: 'alertas' }, handler)
  .subscribe()
```

---