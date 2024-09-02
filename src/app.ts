import express from 'express'
import dotenv from 'dotenv'
import { globalRouter } from './routes/global.route'

const app = express()
dotenv.config()

const PORT = process.env.PORT

app.use(express.json())

const server = app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
app.get("/favicon.ico", (req, res) => res.sendStatus(200))

app.use('/', globalRouter)