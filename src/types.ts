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
}

export type Theme = 'auto' | 'light' | 'dark';