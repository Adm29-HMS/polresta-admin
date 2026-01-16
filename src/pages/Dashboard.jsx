import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardService, beritaService, STORAGE_URL } from '@/lib/api';
import { Loader2, FileText, AlertTriangle, UserX, Users, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format } from 'date-fns';

const DashboardCard = ({ title, value, icon: Icon, color }) => (
    <Card>
        <CardContent className="p-6 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                <h3 className="text-3xl font-bold font-heading">{value}</h3>
            </div>
            <div className={`p-3 rounded-full ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </CardContent>
    </Card>
);

export default function Dashboard() {
    const [stats, setStats] = useState({
        total_berita: 0,
        total_kriminal: 0,
        total_dpo: 0,
        total_orang_hilang: 0
    });
    const [recentNews, setRecentNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch stats and news in parallel
                const [statsRes, newsRes] = await Promise.all([
                    dashboardService.getStats(),
                    beritaService.getAll()
                ]);

                setStats(statsRes ? (statsRes.counts || statsRes) : {}); // Handle response structure
                // Sort news by date descending and take top 5
                const sortedNews = (newsRes.data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
                setRecentNews(sortedNews);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-heading font-bold text-gray-900">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                    title="Total Berita"
                    value={stats.berita || stats.total_berita || 0}
                    icon={FileText}
                    color="bg-blue-600"
                />
                <DashboardCard
                    title="Laporan Kriminal"
                    value={stats.kriminal || stats.total_kriminal || 0}
                    icon={AlertTriangle}
                    color="bg-red-600"
                />
                <DashboardCard
                    title="DPO Aktif"
                    value={stats.dpo || stats.total_dpo || 0}
                    icon={UserX}
                    color="bg-orange-600"
                />
                <DashboardCard
                    title="Orang Hilang"
                    value={stats.orang_hilang || stats.total_orang_hilang || 0}
                    icon={Users}
                    color="bg-yellow-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="min-h-[400px]">
                    <CardHeader>
                        <CardTitle>Statistik Kriminalitas</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
                        <div className="text-center">
                            <p>Chart integration pending implementation of Chart.js/Recharts.</p>
                            <p className="text-sm mt-2">Data available: {stats.kriminal || stats.total_kriminal || 0} cases reported.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="min-h-[400px]">
                    <CardHeader>
                        <CardTitle>Berita Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentNews.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">Belum ada berita.</p>
                            ) : (
                                recentNews.map((news) => (
                                    <div key={news.id} className="flex gap-4 items-start border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                            {news.cover ? (
                                                <img src={`${STORAGE_URL}/${news.cover}`} alt={news.judul} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm line-clamp-2 hover:text-blue-600 transition-colors">
                                                {news.judul}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                                    {news.kategori?.nama || 'News'}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {news.created_at ? format(new Date(news.created_at), 'dd MMM yyyy') : '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
