# PROJECT_NOTES.md - Estado Actual de TaskSchool (22 enero 2026)

**IMPORTANTE PARA COPILOT / IA**:  
Usa SOLO esta información como referencia del estado real del proyecto. Ignora cualquier cosa anterior que contradiga esto.

## Descripción general
- App web React + Vite para gestión de tareas escolares.
- URL live: https://task-school-eight.vercel.app
- Diseño minimalista, colores por materia y prioridad (rojo alta, amarillo media, azul baja, verde completada).
- Tema oscuro/claro automático (prefers-color-scheme) + toggle manual con íconos sol/luna/monitor.
- Persistencia con localStorage implementada (tareas y usuario logueado).

## Features ya implementadas y funcionales
- Login / bienvenida con email-contraseña, "Entrar", "Empezar sin cuenta", link registro.
- Dashboard: tabs pendientes/completadas, tarjetas con detalles, botón +.
- Modal Nueva Tarea: dropdown materia, tipo, descripción, fechas picker, prioridad radios.
- Detalle tarea: modal con info completa, marcar completada, adjuntar foto.
- Calendario: mensual interactivo, clics en días muestran tareas.
- Historial: filtros materia/mes, % completadas, gráfico simple, export PDF/CSV.
- Persistencia: localStorage ('taskSchool_tasks', 'taskSchool_user', 'taskSchool_theme').
- Tema: consistente en la mayoría de pantallas (arreglando colados en login/modal/calendario).

## Lo que falta / Próximos objetivos
- Simular modo competitivo (grupos, invitaciones, ranking, leaderboard).
- Agregar streak counter y badges.
- Mejorar UX dark mode (menos "cripi").
- Integrar DB real (Firebase).

## Notas técnicas
- Usa TypeScript.
- Claves localStorage: 'taskSchool_tasks', 'taskSchool_user', 'taskSchool_theme'.
- Mantén el código limpio y no rompas lo que ya funciona.

¡Este es el estado real al 22 de enero 2026! Usa esto siempre como base.