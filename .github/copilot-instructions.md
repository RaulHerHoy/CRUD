# Copilot Instructions for CRUD Vehicle Store

## Architecture Overview

**Monorepo with two independent services:**
- **Frontend** (`frontend/`): Angular 20 SSR app serving UI at `localhost:4200`
- **Backend** (`server/`): Express.js API at `localhost:5000` with MongoDB

**Data Flow:**
1. Angular components → UsuariosService/VehiculosService (HTTP calls)
2. Services hit `http://localhost:5000/api/*` endpoints
3. Backend controllers query MongoDB (mongoose models)
4. Responses include user context (_id, email, rol, tipo)

## Key Patterns

### Backend (Express + Mongoose)

**Model Structure:**
- Models in `server/models/` define MongoDB schemas with validation (required, unique, enum)
- User roles: "buyer" | "admin" (default: buyer)
- User types: "normal" | "premium" | "vip" (default: normal)
- See [usuario.js](server/models/usuario.js) for schema pattern with timestamps

**Routes Pattern:**
- Routes grouped by resource in `server/routes/*.routes.js`
- Each route file: `const router = require("express").Router()`
- Controllers in `server/controllers/` handle business logic
- Middleware in `server/middlewares/` (authJWT currently disabled, uses localStorage instead)
- adminOnly middleware checks `req.user.rol === "admin"` - user object must be attached by prior middleware

**CORS & Middleware Stack** (in [server/index.js](server/index.js)):
1. CORS enabled only for `http://localhost:4200`
2. Morgan logs all HTTP requests
3. express.json() parses request bodies
4. Routes mounted as `/api/auth`, `/api/usuarios`, `/api/vehiculos`, etc.

### Frontend (Angular 20 Standalone)

**Service Layer:**
- Services inject HttpClient and use `this.http.post/get()` 
- Base URLs like `http://localhost:5000/api/auth/` (trailing slash)
- See [usuarios.service.ts](frontend/src/app/services/usuarios.service.ts) for patterns: Observable return, localStorage sync, isPlatformBrowser check for SSR compatibility

**Component Structure:**
- Standalone components with `imports: [CommonModule, FormsModule]`
- Use `@Input()` for parent-to-child data binding
- See [vehiculos.ts](frontend/src/app/components/vehiculos/vehiculos.ts): filters, CRUD forms, admin checks via `UsuariosService.obtenerUsuarioActual()`
- Components check `esAdmin = this.usuarios.esAdmin()` to conditionally show admin UI

**State Management:**
- User state: localStorage keys "usuario" and "isLogged" (set by UsuariosService)
- Cart state: localStorage via CarritoService
- No NgRx/state library - simple service-based state

## Critical Workflows

### Development Setup
```bash
# Terminal 1: Backend
cd server && npm install
npm run dev  # runs nodemon, watches server/

# Terminal 2: Frontend  
cd frontend && npm install
npm start    # ng serve on port 4200

# Terminal 3: Database
mongod       # Connects to mongodb://localhost:27017/tienda-vehiculos
```

### Adding a New Admin Feature
1. Add route in `server/routes/*.routes.js` → wrap with adminOnly middleware
2. Create/update controller in `server/controllers/`
3. Add method in frontend service (`frontend/src/app/services/*.ts`)
4. Add UI in component, guard with `if (this.esAdmin)` block
5. Test: Login as admin user (rol: "admin"), verify localStorage has correct user

### Testing Auth Flow
- Login stores user in localStorage under key "usuario"
- Frontend reads with UsuariosService.obtenerUsuarioActual()
- adminOnly middleware expects req.user object (currently not attached - **potential bug**)

## Specific Anti-Patterns & Quirks

⚠️ **Password Handling:** Backend auth compares plain text passwords (line 22 in [auth.routes.js](server/routes/auth.routes.js)) - NO bcrypt used despite bcryptjs in package.json

⚠️ **JWT Auth Middleware:** Disabled in [authJWT.js](server/middlewares/authJWT.js) - requests don't validate tokens, user context managed entirely by frontend localStorage

⚠️ **Req.user Mismatch:** adminOnly middleware checks `req.user.rol` but nothing attaches req.user - admin routes may fail silently

⚠️ **SSR Consideration:** Services check `isPlatformBrowser(this.platformId)` before localStorage access (for Angular SSR)

## File Organization

- **Controllers:** Separates route handlers from logic (Vehiculo, Usuario, Carrito, Venta controllers)
- **Models:** Mongoose schemas with inline comments explaining each field (follow this pattern)
- **Services:** One per resource (UsuariosService, VehiculosService, CarritoService, VentasService)
- **Components:** One per page/feature, with template (`.html`), style (`.css`), logic (`.ts`), tests (`.spec.ts`)

## External Dependencies

**Backend:** Express, Mongoose (MongoDB), CORS, Morgan (logging), bcryptjs (unused)
**Frontend:** @angular core modules, RxJS, Express (for SSR)
**Database:** MongoDB @ `mongodb://localhost:27017/tienda-vehiculos`

---
*Last updated: Jan 2026 - Reflects Angular 20 SSR, Express 4.x, Mongoose 8.x setup*
