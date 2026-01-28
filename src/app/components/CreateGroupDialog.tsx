import { useState } from 'react';
import { Users } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User, Group } from '../../types';
import { toast } from 'sonner';

interface CreateGroupDialogProps {
    user: User | null;
    groups: Group[];
    setGroups: (groups: Group[]) => void;
    setUser: (user: User) => void;
}

export function CreateGroupDialog({ user, groups, setGroups, setUser }: CreateGroupDialogProps) {
    const [open, setOpen] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Solo usuarios logueados (no guests) pueden crear grupos
    if (!user || user.isGuest) {
        return null;
    }

    /**
     * Genera un código de invitación de 6 caracteres alfanuméricos en mayúsculas
     */
    const generateInviteCode = (): string => {
        return Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();
    };

    /**
     * Genera un UUID simple usando timestamp + random
     */
    const generateId = (): string => {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            toast.error('Por favor ingresa un nombre para el grupo');
            return;
        }

        // Verificar si ya existe un grupo con el mismo nombre
        if (groups.some(g => g.name.toLowerCase() === groupName.toLowerCase())) {
            toast.error('Ya existe un grupo con este nombre');
            return;
        }

        setIsLoading(true);

        try {
            // Generar datos del nuevo grupo
            const inviteCode = generateInviteCode();
            const newGroup: Group = {
                id: generateId(),
                name: groupName.trim(),
                inviteCode,
                members: [
                    {
                        userId: user.email || user.name, // Usar email si existe, sino name (para guests)
                        points: 0,
                        streak: user.streak || 0,
                    },
                ],
                createdAt: new Date().toISOString(),
            };

            // Actualizar grupos en localStorage
            const updatedGroups = [...groups, newGroup];
            setGroups(updatedGroups);

            // Actualizar usuario con el nuevo grupo
            const updatedUser: User = {
                ...user,
                groupIds: [...(user.groupIds || []), newGroup.id],
            };
            setUser(updatedUser);

            // Mostrar éxito con código de invitación
            toast.success(`¡Grupo creado! Código: ${inviteCode}`, {
                description: 'Comparte este código con tus amigos para que se unan.',
            });

            // Limpiar y cerrar modal
            setGroupName('');
            setOpen(false);
        } catch (error) {
            toast.error('Error al crear el grupo. Intenta de nuevo.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 dark:border-blue-400 dark:text-blue-400"
                >
                    <Users className="w-4 h-4 mr-2" />
                    Crear Grupo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Crear nuevo grupo</DialogTitle>
                    <DialogDescription>
                        Crea un grupo para competir con tus compañeros y compartir tu progreso.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="group-name" className="text-foreground">
                            Nombre del grupo
                        </Label>
                        <Input
                            id="group-name"
                            placeholder="ej: Mi clase de Matemática"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="h-10 border-input"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setGroupName('');
                                setOpen(false);
                            }}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateGroup}
                            disabled={!groupName.trim() || isLoading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isLoading ? 'Creando...' : 'Crear'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
