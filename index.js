const express         = require('express')
const cors            = require('cors')
const swaggerUi       = require('swagger-ui-express')
const swaggerSpec     = require('./config/swagger')
const errorMiddleware = require('./middlewares/error.middleware')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const authRoutes   = require('./routes/auth.routes')
const profileRoutes = require('./routes/profile.routes')

app.use('/api/auth',     authRoutes)
app.use('/api/profiles', profileRoutes)

app.get('/', (req, res) => {
  res.json({ mensaje: 'API QuizGuard funcionando' })
})

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
  console.log(`Docs en http://localhost:${PORT}/api/docs`)
})