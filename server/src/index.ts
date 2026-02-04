// src/index.ts
import express from 'express';
import cors from 'cors';
import { caloriesRoutes } from './modules/calories/caloriesRoutes';
import { validator } from './validator';
import { authRoutes } from './modules/auth/jwtRoutes';
const app = express()

app.use(cors()) // Enable CORS for all routes for dissmissing CORS errors during development
app.use(express.json()) // Enabled to parse JSON request bodies

app.use('/calories', caloriesRoutes)
app.use('/auth', authRoutes)

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})
