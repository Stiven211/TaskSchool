# PROJECT_NOTES.md - Estado Actual de TaskSchool (19 enero 2026)

**IMPORTANTE PARA COPILOT / IA**:  
Usa SOLO esta información como referencia del estado real del proyecto. Ignora cualquier cosa anterior que contradiga esto.

## Descripción general
- App web React + Vite para gestión de tareas escolares.
- URL live: https://task-school-eight.vercel.app
- Diseño minimalista, colores por materia y prioridad (rojo alta, amarillo media, azul baja, verde completada).
- Todo funciona visualmente, pero los datos NO persisten al recargar la página.

## Features ya implementadas y funcionales
- Pantalla de Login / Bienvenida con formulario email-contraseña, botón "Entrar", "Empezar sin cuenta" y link "Regístrate aquí".
- Dashboard principal:
  - Tabs Pendientes / Completadas con conteo real.
  - Tarjetas de tareas con ícono/color materia, título, fechas asignada/entrega, prioridad coloreada, botones "Ver detalles" y completar/deshacer.
  - Botón flotante + para abrir modal de nueva tarea.
- Modal "Nueva Tarea":
  - Campos: materia (dropdown), tipo de tarea, descripción, fechas asignada/entrega (datepicker), prioridad (radios con colores).
- Vista Detalle de Tarea:
  - Modal o página con toda la info completa.
  - Botón grande "Marcar como completada".
  - Opción para adjuntar foto (subir imagen de la tarea hecha).
- Calendario mensual:
  - Muestra puntos coloreados por prioridad/completada en cada día.
  - Clic en cualquier día muestra lista de tareas de ese día (modal o sección).
- Historial y Estadísticas:
  - Filtros por materia y mes.
  - Lista de tareas completadas.
  - Contador real de % completadas.
  - Gráfico simple.
  - Exportar a PDF/CSV.

## Lo que falta / Próximos objetivos inmediatos
1. Persistencia con localStorage:
   - Guardar tareas (array completo con id, todos los campos, imagen base64 si hay).
   - Guardar usuario logueado (email, name, isGuest).
   - Cargar datos al iniciar la app.
   - Guardar automáticamente al agregar/editar/completar tarea.
2. Modo oscuro/claro:
   - Automático según preferencia del sistema.
   - Toggle manual pequeño en header con ícono sol 🌞 / luna 🌙.
   - Guardar preferencia en localStorage.

## Notas técnicas
- Usa TypeScript si ya está configurado.
- Mantén el código limpio y no rompas lo que ya funciona.
- Prioriza integración en App.tsx, Dashboard.tsx y modal de nueva tarea.

¡Este es el estado real al 19 de enero 2026! Usa esto siempre como base.