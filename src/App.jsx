import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { Toaster } from "@/components/ui/sonner"
import Dashboard from '@/pages/Dashboard';
import MediaGallery from '@/pages/MediaGallery';
import DataPejabat from '@/pages/DataPejabat';
import DataBerita from '@/pages/DataBerita';
import DataKriminal from '@/pages/DataKriminal';
import DataStatistikKriminal from '@/pages/DataStatistikKriminal';
import DataLaluLintas from '@/pages/DataLaluLintas';
import DataDPO from '@/pages/DataDPO';
import PeringatanDarurat from '@/pages/PeringatanDarurat';
import Peraturan from '@/pages/DataPeraturan';
import OrangHilang from '@/pages/OrangHilang';
import KantorPolisi from '@/pages/KantorPolisi';
import Layanan from '@/pages/Layanan';
import Profil from '@/pages/Profil';
import Login from '@/pages/Login';
import DataPrestasi from '@/pages/DataPrestasi';
import DataProgram from '@/pages/DataProgram';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Toaster />
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Dashboard />} />
                        <Route path="media-gallery" element={<MediaGallery />} />
                        <Route path="data-pejabat" element={<DataPejabat />} />
                        <Route path="data-berita" element={<DataBerita />} />
                        <Route path="data-kriminal" element={<DataKriminal />} />
                        <Route path="statistik-kriminal" element={<DataStatistikKriminal />} />
                        <Route path="data-lalulintas" element={<DataLaluLintas />} />
                        <Route path="data-dpo" element={<DataDPO />} />
                        <Route path="orang-hilang" element={<OrangHilang />} />
                        <Route path="peringatan-darurat" element={<PeringatanDarurat />} />
                        <Route path="peraturan" element={<Peraturan />} />
                        <Route path="kantor-polisi" element={<KantorPolisi />} />
                        <Route path="layanan" element={<Layanan />} />
                        <Route path="data-prestasi" element={<DataPrestasi />} />
                        <Route path="data-program" element={<DataProgram />} />
                        <Route path="profil" element={<Profil />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    )
}

export default App
