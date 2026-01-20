import { useState } from 'react';
import { BookCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User } from '../../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = { email, name: email.split('@')[0], isGuest: false };
    onLogin(user);
  };

  const handleGuestLogin = () => {
    const user: User = { email: '', name: 'Invitado', isGuest: true };
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center transform rotate-3 shadow-lg">
              <BookCheck className="w-12 h-12 text-primary-foreground" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl text-center text-foreground mb-2">TaskSchool</h1>
          <p className="text-center text-muted-foreground mb-8">Gestiona tus tareas escolares de forma simple</p>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-input focus:border-primary focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-input focus:border-primary focus:ring-primary"
                required
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover-glow"
              >
                Entrar
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">o</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGuestLogin}
              className="w-full h-12 border-input hover:bg-accent hover-glow"
            >
              Empezar sin cuenta
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿No tienes cuenta?{' '}
            <button className="text-primary hover:text-primary/80">
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
