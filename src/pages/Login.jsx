import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { KeyRound, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error saat user mulai typing
        if (error) setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password);

        if (!result.success) {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary blur-[100px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary blur-[100px]"></div>
            </div>

            <Card className="w-full max-w-md border-white/10 bg-black/40 backdrop-blur-md shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <CardHeader className="text-center space-y-4 pt-10">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-secondary/20 to-yellow-600/20 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/10 backdrop-blur-sm p-4 ring-4 ring-white/5">
                        <img src="/logo_utama.ico" alt="Logo" className="w-full h-full object-contain drop-shadow-md transform hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-heading font-bold text-white tracking-wider">POLRESTA ADMIN</CardTitle>
                        <CardDescription className="text-gray-400">Secure Access</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="flex items-center space-x-2 bg-red-500/10 p-3 rounded border border-red-500/20 text-red-500 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@polresta.com"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-secondary focus:ring-secondary/50"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-300">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-secondary focus:ring-secondary/50 pr-10"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <KeyRound className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 bg-yellow-500/10 p-3 rounded border border-yellow-500/20 text-yellow-500 text-xs">
                            <AlertCircle className="w-4 h-4" />
                            <span>Hanya untuk personil berwenang. Semua aktivitas dicatat.</span>
                        </div>

                        <Button type="submit" className="w-full bg-secondary hover:bg-yellow-600 text-black font-bold h-11" disabled={loading}>
                            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center border-t border-white/5 py-4">
                    <p className="text-xs text-gray-500">© 2026 Polresta Sorong Kota</p>
                </CardFooter>
            </Card>
        </div>
    );
}
