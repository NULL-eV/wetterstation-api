require('dotenv').config()

const express = require('express')
const { Pool } = require('pg')

const app = express()
app.use(express.json())

const port = 3000

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
})

// Create table if not exists
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS data (
        id SERIAL PRIMARY KEY,
        temp REAL,
        humd REAL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('DB initialized')
  } catch (err) {
    console.error('DB error:', err.message)
  }
}

app.get('/', (req, res) => {
  res.send('API is running')
})

// GET all existing entries
app.get('/api/data', async (req, res) => {
	try {
    const result = await pool.query('SELECT * FROM data')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST a new entry
app.post('/api/data', async (req, res) => {
	try {
    const { temperatur, luftfeuchtigkeit } = req.body
    const result = await pool.query(
      'INSERT INTO data (temp, humd) VALUES ($1, $2) RETURNING *',
      [temperatur, luftfeuchtigkeit]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT (UPDATE) an existing entry
app.put('/api/data:id', async (req, res) => {
	try {
    const { id } = req.params
    const { temperatur, luftfeuchtigkeit } = req.body
    const result = await pool.query(
      'UPDATE data SET temp = $1, humd = $2 WHERE id = $3 RETURNING *',
      [temperatur, luftfeuchtigkeit, id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE an existing entry
app.delete('/api/data/:id', async (req, res) => {
	try {
    const { id } = req.params
    await pool.query('DELETE FROM data WHERE id = $1', [id])
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(port, async () => {
  await initDB();
  console.log(`API listening on port ${process.env.API_PORT}:${port}`)
})
