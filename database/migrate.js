const fs       = require('fs')
const path     = require('path')
const supabase = require('../config/supabase')
require('dotenv').config()

const correrMigraciones = async () => {
  const carpeta = path.join(__dirname, 'migrations')
  const archivos = fs.readdirSync(carpeta).sort()

  for (const archivo of archivos) {
    if (!archivo.endsWith('.sql')) continue

    console.log(`Corriendo migración: ${archivo}`)
    const sql = fs.readFileSync(path.join(carpeta, archivo), 'utf8')

    const { error } = await supabase.rpc('exec_sql', { sql })

    if (error) {
      console.error(`Error en ${archivo}:`, error.message)
      process.exit(1)
    }

    console.log(`${archivo} ejecutada`)
  }

  console.log('Migraciones completadas')
  process.exit(0)
}

correrMigraciones()