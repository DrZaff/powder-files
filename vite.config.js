import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local stand-in for Netlify Functions: `npm run dev` and `npm run preview` answer /api/weather with the
// same handler that Netlify deploys (netlify/functions/weather.mjs). Production does not use this.
async function weatherApi(req, res, next) {
  if (!req.url.startsWith('/api/weather')) return next()
  try {
    const { default: handler } = await import('./netlify/functions/weather.mjs')
    const response = await handler(new Request(`http://localhost${req.url}`, { method: req.method }))
    res.statusCode = response.status
    response.headers.forEach((value, key) => res.setHeader(key, value))
    res.end(await response.text())
  } catch (error) { next(error) }
}
const localFunctions = { name: 'pf-local-functions', configureServer: s => { s.middlewares.use(weatherApi) }, configurePreviewServer: s => { s.middlewares.use(weatherApi) } }

export default defineConfig({ plugins: [react(), localFunctions] })
