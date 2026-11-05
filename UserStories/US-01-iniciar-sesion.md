# US-01 — Iniciar sesión

## Original

**Rol:** docente

**Historia**  
Como docente quiero iniciar sesión con mi correo y mi contraseña para entrar a mis planeamientos y que nadie más los vea.

## Contexto

EduAcompaña es un demo de escritorio, en español de Costa Rica, para docentes de primaria y secundaria. No hay registro ni recuperación de contraseña: las cuentas ya existen. Ninguna acción del producto llama a un modelo de lenguaje; los textos de ayuda salen de datos guardados (US-16).

## Criterios de aceptación

1. La pantalla de acceso muestra el nombre **EduAcompaña**, los campos **Correo** y **Contraseña**, y el botón **Entrar**.
2. No aparecen opciones de crear cuenta, recuperar contraseña ni entrar como invitado.
3. Si el correo o la contraseña están vacíos, **Entrar** no abre sesión y el sistema indica: «Ingrese su correo y su contraseña.»
4. Si el correo no existe o la contraseña no coincide, no se abre sesión y el mensaje es el mismo en ambos casos: «Correo o contraseña incorrectos.»
5. Con un correo y una contraseña válidos, el sistema abre la lista de planeamientos de esa persona (US-03).
6. Al actualizar la página, la sesión sigue activa. Al cerrar el navegador, la sesión termina.
7. Quien ya tiene sesión y abre la pantalla de acceso llega directo a su lista.
8. Quien no tiene sesión y abre la lista o un planeamiento llega a la pantalla de acceso.
9. Una sesión de una docente no muestra planeamientos ni datos de otra cuenta, aunque se cambie la dirección del planeamiento en el navegador. En ese caso el sistema muestra: «No tiene acceso a este planeamiento.»

## Cuentas del demo

La contraseña de las tres cuentas es `Demo2026`.

| Docente | Correo | Planeamiento que ya tiene |
| --- | --- | --- |
| Juanita Pérez | juanita.perez@demo.mep.cr | Matemática, 4.° año, marzo 2026, en borrador en el paso 4 |
| Carlos Mora | carlos.mora@demo.mep.cr | Español, 2.° año, abril 2026, listo para entrega |
| María Solís | maria.solis@demo.mep.cr | Ciencias, 7.° año, febrero 2026, en el paso 8 sin ajustes aplicados |

El detalle de cada planeamiento y de los escenarios guardados está en US-03 y US-16.

## Enhanced

La historia original cubre la pantalla y los mensajes. Le faltan el contrato HTTP, los módulos y la definición de terminado.

**Funcionalidad.** `POST /api/auth/login` recibe `{ email, password }`. Si ambos vienen vacíos responde `400` con `code: VALIDATION` y el mensaje «Ingrese su correo y su contraseña.» Si el correo no existe o la contraseña no coincide, responde `401` con `code: INVALID_CREDENTIALS` y el mismo mensaje en ambos casos. No revela cuál campo falló. Un acierto crea una cookie de sesión `httpOnly` que se cierra al cerrar el navegador, devuelve `TeacherProfile` (`id`, `fullName`, `email`, `schoolName`, `regionalDirectorate`) y la interfaz navega a `/plans`. `passwordHash` no sale en la respuesta. No hay registro, recuperación ni invitado.

`GET /api/auth/me` devuelve `200` con sesión y `401` sin ella. Quien ya tiene sesión y abre `/login` es redirigido a `/plans`. Quien no tiene sesión y abre `/plans` o `/plans/:planId` vuelve a `/login`. Un `planId` de otra docente responde `404` y la pantalla muestra «No tiene acceso a este planeamiento.»

**Módulos.** `frontend/src/pages/LoginPage.tsx`, `frontend/src/services/authService.ts`, guarda de ruta en `frontend/src/App.tsx`. Backend: `backend/src/presentation/authController.ts`, `backend/src/application/login.ts`, repositorio de `Teacher` en `backend/src/infrastructure/`, semilla en `backend/prisma/seed.ts`.

**Definición de terminado.** Prueba Jest del mismo `401` para correo desconocido y contraseña incorrecta, y de que la respuesta no incluye `passwordHash`. Prueba de componente de los dos mensajes. Playwright: Juanita entra y ve solo su lista; al recargar sigue dentro. Actualizar `docs/api-spec.yml` si cambia el cuerpo de error.

**No funcional.** Comparar la contraseña contra el hash. No guardar la contraseña ni un token en `localStorage`. La pantalla es de escritorio, a 1440 px, sin layout móvil.
