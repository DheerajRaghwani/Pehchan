# Pehchan Dhantewada — Frontend (Static)

This repository contains a polished, responsive frontend for the *Pehchan Dhantewada* government project.

## What is included
- Login page (JWT-based auth; expects `POST /api/user/login` returning `{ token }`)
- Dashboard with summary cards (endpoints: `/child/count`, `/hospital/count`, `/child/recent`)
- Child Entry form (`POST /child/create`)
- Hospital Entry form (`POST /hospital/create`)
- Plain HTML/CSS/JS — no build step required

## How to use
1. Edit `app.js` and set `API_BASE` to your backend URL (for production, use `https://api.yourdomain.gov/api`).
2. Place these static files on any static host (NGINX, GitHub Pages, Azure Blob Static website).
3. Ensure your backend allows CORS for the frontend origin and supports the listed endpoints.

## Notes for backend integration
The backend in your project uses JWT authentication and CORS is enabled. The frontend expects the following (adjust to match your controllers if necessary):

- `POST /api/user/login` — body: `{ username, password }` → response: `{ token, username? }`
- `GET  /api/child/count` — returns `{ count: number }`
- `GET  /api/hospital/count` — returns `{ count: number }`
- `GET  /api/child/recent?days=7` — returns `[{ name, address, ... }]`
- `POST /api/child/create` — body: child model
- `POST /api/hospital/create` — body: hospital model

If your controller paths are different, change `app.js` accordingly.

## License
Use within your project. This UI is provided as-is; modify styles and assets to meet government accessibility and branding requirements.

