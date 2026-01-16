import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { statistikLalulintasService } from '@/lib/api';
import { toast } from 'sonner';

export default function DataLaluLintas() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: null,
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
        pelanggaran: 0,
        kecelakaan: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await statistikLalulintasService.getAll();
            setData(Array.isArray(result) ? result : result.data || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error('Gagal mengambil data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const resetForm = () => {
        setFormData({
            id: null,
            bulan: new Date().getMonth() + 1,
            tahun: new Date().getFullYear(),
            pelanggaran: 0,
            kecelakaan: 0
        });
        setIsFormVisible(false);
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            bulan: item.bulan,
            tahun: item.tahun,
            pelanggaran: item.pelanggaran,
            kecelakaan: item.kecelakaan
        });
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
        try {
            await statistikLalulintasService.delete(id);
            toast.success('Data berhasil dihapus');
            fetchData();
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Gagal menghapus data');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            if (formData.id) {
                await statistikLalulintasService.update(formData.id, formData);
            } else {
                await statistikLalulintasService.create(formData);
            }
            toast.success('Data berhasil disimpan');
            fetchData();
            resetForm();
        } catch (error) {
            console.error('Submit failed:', error);
            const msg = error.response?.data?.message || 'Gagal menyimpan data.';
            toast.error(msg);
        } finally {
            setSubmitLoading(false);
        }
    };

    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Data Statistik Lalu Lintas</h1>
                    <p className="text-muted-foreground">Kelola statistik pelanggaran dan kecelakaan per bulan.</p>
                </div>
                {!isFormVisible && (
                    <Button onClick={() => setIsFormVisible(true)} className="bg-secondary text-black hover:bg-yellow-500">
                        <Plus className="w-4 h-4 mr-2" /> Tambah Data
                    </Button>
                )}
            </div>

            {isFormVisible && (
                <Card className="animate-in slide-in-from-top-4 duration-300">
                    <CardHeader>
                        <CardTitle>{formData.id ? 'Edit Data' : 'Input Data Baru (Bulanan)'}</CardTitle>
                        <CardDescription>Masukkan data statistik untuk bulan tertentu.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bulan">Bulan</Label>
                                    <select
                                        id="bulan"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.bulan}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {monthNames.map((name, index) => (
                                            <option key={index + 1} value={index + 1}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tahun">Tahun</Label>
                                    <Input id="tahun" type="number" min="2020" max="2030" value={formData.tahun} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pelanggaran">Jumlah Pelanggaran</Label>
                                    <Input id="pelanggaran" type="number" min="0" value={formData.pelanggaran} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kecelakaan">Jumlah Kecelakaan</Label>
                                    <Input id="kecelakaan" type="number" min="0" value={formData.kecelakaan} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 gap-2">
                                <Button type="button" variant="outline" onClick={resetForm}>Batal</Button>
                                <Button type="submit" disabled={submitLoading} className="bg-secondary text-black hover:bg-yellow-500">
                                    {submitLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Simpan Data
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {loading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                </div>
            ) : (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Periode</TableHead>
                                <TableHead>Pelanggaran</TableHead>
                                <TableHead>Kecelakaan</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        Belum ada data tersedia.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{monthNames[item.bulan - 1]} {item.tahun}</TableCell>
                                        <TableCell>{item.pelanggaran}</TableCell>
                                        <TableCell>{item.kecelakaan}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    );
}
