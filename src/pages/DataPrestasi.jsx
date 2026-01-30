import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus, Loader2, Award } from 'lucide-react';
import { prestasiService, mediaService, STORAGE_URL } from '@/lib/api';
import RichTextEditor from '@/components/RichTextEditor';
import '../styles/tiptap-custom.css';
import { toast } from 'sonner';

export default function DataPrestasi() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: null,
        judul: '',
        deskripsi: '',
        tanggal: '',
        gambar: null
    });
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await prestasiService.getAll();
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, gambar: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            judul: '',
            deskripsi: '',
            tanggal: '',
            gambar: null
        });
        setPreviewImage(null);
        setIsFormVisible(false);
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            judul: item.judul,
            deskripsi: item.deskripsi,
            tanggal: item.tanggal,
            gambar: null
        });
        setPreviewImage(item.gambar ? `${STORAGE_URL}/${item.gambar}` : null);
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
        try {
            await prestasiService.delete(id);
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
            const dataToSubmit = new FormData();
            dataToSubmit.append('judul', formData.judul);
            dataToSubmit.append('deskripsi', formData.deskripsi);
            dataToSubmit.append('tanggal', formData.tanggal);
            if (formData.gambar) {
                dataToSubmit.append('gambar', formData.gambar);
            }
            if (formData.id) {
                dataToSubmit.append('_method', 'PUT');
                await prestasiService.update(formData.id, dataToSubmit);
            } else {
                await prestasiService.create(dataToSubmit);
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Data Prestasi</h1>
                    <p className="text-muted-foreground">Kelola data prestasi dan penghargaan.</p>
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
                        <CardTitle>{formData.id ? 'Edit Prestasi' : 'Input Prestasi Baru'}</CardTitle>
                        <CardDescription>Masukkan informasi prestasi atau penghargaan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="judul">Judul Prestasi</Label>
                                    <Input id="judul" value={formData.judul} onChange={handleInputChange} required placeholder="Contoh: Juara 1 Lomba..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal">Tanggal</Label>
                                    <Input id="tanggal" type="date" value={formData.tanggal} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <RichTextEditor
                                    value={formData.deskripsi}
                                    onChange={(value) => setFormData(prev => ({ ...prev, deskripsi: value }))}
                                    placeholder="Jelaskan detail prestasi..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gambar">Foto Dokumentasi</Label>
                                <Input id="gambar" type="file" onChange={handleFileChange} accept="image/*" />
                                {previewImage && (
                                    <div className="mt-2 relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
                                    </div>
                                )}
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
                                <TableHead>Foto</TableHead>
                                <TableHead>Judul</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        Belum ada data prestasi.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            {item.gambar ? (
                                                <img src={`${STORAGE_URL}/${item.gambar}`} alt={item.judul} className="w-16 h-16 object-cover rounded-md" />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                                                    <Award className="w-8 h-8 text-gray-300" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{item.judul}</TableCell>
                                        <TableCell>{item.tanggal}</TableCell>
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
