import { Task, User } from '../types';

/**
 * Actualiza el streak y badges del usuario basado en las tareas completadas.
 * Se llama después de completar una tarea para mantener el estado actualizado.
 */
export function updateStreakAndBadges(tasks: Task[], user: User | null, setUser: (u: User) => void): void {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

    // Verificar si hay al menos 1 tarea completada HOY
    // Usamos fechaEntrega como referencia, asumiendo que se completa el día de entrega
    const hasCompletedToday = tasks.some(t => t.completada && t.fechaEntrega === today);

    if (!hasCompletedToday) {
        // NO hay tareas completadas hoy → NO hacer nada (streak se mantiene)
        return;
    }

    // SÍ hay tareas completadas hoy
    const lastDate = user.lastCompletionDate;
    let newStreak = user.streak;
    let newBadges = [...user.badges];

    if (lastDate === null) {
        // Primera vez completando
        newStreak = 1;
    } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastDate === yesterdayStr) {
            // Completó ayer → incrementar streak
            newStreak += 1;
        } else if (lastDate !== today) {
            // No es ayer ni hoy → reset y nuevo inicio
            newStreak = 1;
        }
        // Si es hoy, no cambiar streak
    }

    // Actualizar lastCompletionDate
    const updatedUser: User = {
        ...user,
        streak: newStreak,
        lastCompletionDate: today,
        badges: newBadges
    };

    // Desbloquear badges según streak (solo si no los tiene ya)
    const badgeMap: Record<number, string> = {
        3: "Principiante 🔥",
        7: "Consistente 💪",
        14: "Racha Pro ⭐",
        30: "Leyenda 📚"
    };

    Object.entries(badgeMap).forEach(([streakNum, badge]) => {
        const streakThreshold = parseInt(streakNum);
        if (newStreak >= streakThreshold && !newBadges.includes(badge)) {
            newBadges.push(badge);
        }
    });

    updatedUser.badges = newBadges;

    // Actualizar el usuario
    setUser(updatedUser);
}