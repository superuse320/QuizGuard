const fs       = require('fs')
const path     = require('path')
const supabase = require('../config/supabase')
require('dotenv').config()

const correrSeeders = async () => {
  const carpeta = path.join(__dirname, 'seeders')
  const archivos = fs.readdirSync(carpeta).sort()

  for (const archivo of archivos) {
    if (!archivo.endsWith('.sql')) continue

    console.log(`Corriendo seeder: ${archivo}`)
    const sql = fs.readFileSync(path.join(carpeta, archivo), 'utf8')

    const { error } = await supabase.rpc('exec_sql', { sql })

    if (error) {
      console.error(`Error en ${archivo}:`, error.message)
      process.exit(1)
    }

    console.log(` ${archivo} ejecutado`)
  }

  console.log('Seeders completados')
  process.exit(0)
}

correrSeeders()