# PROJECT_NOTES.md - Estado Actual de TaskSchool (27 enero 2026)

**IMPORTANTE PARA COPILOT / IA**:  
Usa SOLO esta información como referencia del estado real del proyecto. Ignora cualquier cosa anterior que contradiga esto.

## Descripción general
- App web React + Vite para gestión de tareas escolares.
- URL live: https://task-school-eight.vercel.app
- Diseño minimalista, colores por materia y prioridad (rojo alta, amarillo media, azul baja, verde completada).
- Tema oscuro/claro automático (prefers-color-scheme) + toggle manual con íconos sol/luna/monitor.
- Persistencia con localStorage implementada (tareas, usuario, theme, streaks, badges).

## Features ya implementadas y funcionales
- Login: Email/password simulado + guest mode.
- Dashboard: Tabs para pendientes/completadas, streaks con contador (TrendingUp icon), badges mostrados (Award icon).
- Formulario tareas: Crear/editar con materia, tipo, desc, fechas, prioridad, imagen.
- Detalle tarea: Ver/editar/completar.
- Calendario: Vista mensual con dots coloreados por prioridad/completado.
- Historial: Lista filtrable por materia/mes, stats de completadas, gráfico simple, export PDF/CSV.
- Streaks y Badges: Automático (updateStreakAndBadges), badges por hitos (3/7/14/30 días), visual en dashboard.
- Persistencia: localStorage ('taskSchool_tasks', 'taskSchool_user', 'taskSchool_theme').
- Tema: consistente en todas pantallas.

## Lo que falta / Próximos objetivos
- Simular modo competitivo (grupos, invitaciones, ranking, leaderboard) - EN PROGRESO.
- Agregar streak counter y badges - COMPLETADO.
- Integrar DB real (Firebase).

## Notas técnicas
- Usa TypeScript.
- Claves localStorage: 'taskSchool_tasks', 'taskSchool_user', 'taskSchool_theme'.
- Mantén el código limpio y no rompas lo que ya funciona.

¡Este es el estado real al 27 de enero 2026! Usa esto siempre como base.