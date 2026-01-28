export interface Task {
    id: string;
    materia: string;
    tipo: string;
    descripcion: string;
    fechaAsignada: string;
    fechaEntrega: string;
    prioridad: 'alta' | 'media' | 'baja';
    completada: boolean;
    imagenAdjunta?: string;
}

export interface User {
    email: string;
    name: string;
    isGuest: boolean;
    streak: number;               // días consecutivos completando al menos 1 tarea
    lastCompletionDate: string | null;  // ISO date 'YYYY-MM-DD' de la última vez que completó tarea(s)
    badges: string[];             // ej: ["Principiante 🔥", "Consistente 💪"]
    groupIds: string[];           // IDs de los grupos a los que pertenece
    points: number;               // puntos acumulados (para ranking)
}

export interface Group {
    id: string;
    name: string;
    inviteCode: string;           // código de 6 caracteres para unirse
    members: {
        userId: string;           // email o identificador único del usuario
        points: number;
        streak: number;           // copia del streak personal para leaderboard
    }[];
    createdAt: string;            // ISO date
}

export type Theme = 'auto' | 'light' | 'dark';