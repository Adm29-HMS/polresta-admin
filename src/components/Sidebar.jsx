import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Image,
    Users,
    Newspaper,
    Gavel,
    UserX,
    Siren,
    BookOpen,
    Building2,
    HandHeart,
    FileText,
    LogOut,
    Award,
    Calendar,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Image, label: 'Media Gallery', href: '/media-gallery' },
    { icon: Users, label: 'Data Pejabat', href: '/data-pejabat' },
    { icon: Newspaper, label: 'Data Berita', href: '/data-berita' },
    { icon: Gavel, label: 'Data Kriminal', href: '/data-kriminal' },
    { icon: Gavel, label: 'Statistik Kriminal', href: '/statistik-kriminal' },
    { icon: Siren, label: 'Data Lalu Lintas', href: '/data-lalulintas' },
    { icon: UserX, label: 'Data DPO', href: '/data-dpo' },
    { icon: UserX, label: 'Orang Hilang', href: '/orang-hilang' },
    { icon: Siren, label: 'Peringatan Darurat', href: '/peringatan-darurat' },
    { icon: BookOpen, label: 'Peraturan', href: '/peraturan' },
    { icon: Building2, label: 'Kantor Polisi', href: '/kantor-polisi' },
    { icon: HandHeart, label: 'Layanan', href: '/layanan' },
    { icon: Award, label: 'Data Prestasi', href: '/data-prestasi' },
    { icon: Calendar, label: 'Data Program', href: '/data-program' },
    { icon: FileText, label: 'Profil Polres', href: '/profil' },
];

export function Sidebar({ isOpen, onClose }) {
    return (
        <aside className={cn(
            "w-64 bg-primary text-primary-foreground h-screen flex flex-col fixed left-0 top-0 border-r border-border/10 shadow-xl z-50 transition-transform duration-300 lg:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h1 className="text-xl font-heading font-bold tracking-wider text-secondary">
                    POLRESTA ADMIN
                </h1>
                <button
                    onClick={onClose}
                    className="lg:hidden text-white/70 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {sidebarItems.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        onClick={() => onClose?.()}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group text-sm font-medium",
                                isActive
                                    ? "bg-secondary text-secondary-foreground shadow-md"
                                    : "hover:bg-white/10 text-gray-300 hover:text-white"
                            )
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="tracking-wide">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                {/* <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-md transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span>Resta Sorkot</span>
                </button> */}
            </div>
        </aside >
    );
}
