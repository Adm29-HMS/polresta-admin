import React from 'react';
import { Bell, Search, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header({ onMenuClick }) {
    const { user, logout } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40 bg-opacity-90 backdrop-blur-sm">
            <div className="flex items-center gap-4 w-1/3">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md lg:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="relative w-full max-w-md hidden sm:block">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                </button>
                <div className="h-8 w-px bg-gray-200 mx-2"></div>

                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-primary">{user?.name || 'Admin User'}</p>
                            <p className="text-xs text-gray-500">{user?.email || 'admin@polresta.com'}</p>
                        </div>
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-secondary border-2 border-secondary shadow-sm">
                            <User className="w-5 h-5" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
