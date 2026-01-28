import { useState } from 'react';
import { UserPlus } from 'lucide-react';
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

interface JoinGroupDialogProps {
    user: User | null;
    groups: Group[];
    setGroups: (groups: Group[]) => void;
    setUser: (user: User) => void;
}

export function JoinGroupDialog({ user, groups, setGroups, setUser }: JoinGroupDialogProps) {
    const [open, setOpen] = useState(false);
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Solo usuarios logueados (no guests) pueden unirse a grupos
    if (!user || user.isGuest) {
        return null;
    }

    const handleJoinGroup = async () => {
        if (code.trim().length !== 6) {
            toast.error('El código debe tener 6 caracteres');
            return;
        }

        setIsLoading(true);

        try {
            // Buscar grupo por código de invitación
            const targetGroup = groups.find(
                g => g.inviteCode.toUpperCase() === code.trim().toUpperCase()
            );

            if (!targetGroup) {
                toast.error('Código no encontrado. Verifica el código de invitación.');
                setIsLoading(false);
                return;
            }

            // Verificar si ya es miembro del grupo
            const userEmail = user.email || user.name;
            if (targetGroup.members.some(m => m.userId === userEmail)) {
                toast.info('Ya eres miembro de este grupo');
                setIsLoading(false);
                return;
            }

            // Crear nuevo miembro
            const newMember = {
                userId: userEmail,
                points: 0,
                streak: user.streak || 0,
            };

            // Actualizar grupo con el nuevo miembro
            const updatedGroups = groups.map(g =>
                g.id === targetGroup.id
                    ? { ...g, members: [...g.members, newMember] }
                    : g
            );
            setGroups(updatedGroups);

            // Actualizar usuario con el nuevo grupo
            const updatedUser: User = {
                ...user,
                groupIds: [...(user.groupIds || []), targetGroup.id],
            };
            setUser(updatedUser);

            // Mostrar éxito
            toast.success(`¡Te uniste a "${targetGroup.name}"!`, {
                description: 'Ahora compites con tus compañeros.',
            });

            // Limpiar y cerrar modal
            setCode('');
            setOpen(false);
        } catch (error) {
            toast.error('Error al unirse al grupo. Intenta de nuevo.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Convertir código a mayúsculas mientras se escribe
    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value.toUpperCase().slice(0, 6));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 dark:border-blue-400 dark:text-blue-400"
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Unirse a Grupo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Unirse a un grupo</DialogTitle>
                    <DialogDescription>
                        Pega el código de invitación que compartió el creador del grupo.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="invite-code" className="text-foreground">
                            Código de invitación
                        </Label>
                        <Input
                            id="invite-code"
                            placeholder="Ej: ABC123"
                            value={code}
                            onChange={handleCodeChange}
                            maxLength={6}
                            className="h-10 border-input text-center text-lg font-semibold tracking-widest"
                            disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground text-center">
                            {code.length}/6 caracteres
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setCode('');
                                setOpen(false);
                            }}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleJoinGroup}
                            disabled={code.length !== 6 || isLoading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isLoading ? 'Uniéndose...' : 'Unirse'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
