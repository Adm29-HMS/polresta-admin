import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2, Plus, Loader2, FileText } from 'lucide-react';
import { layananService } from '@/lib/api';
import { toast } from 'sonner';

export default function Layanan() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: null,
        nama: '',
        slug: '',
        deskripsi: '',
        icon: '',
        persyaratan: '',
        prosedur: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await layananService.getAll();
            setData(Array.isArray(result) ? result : result.data || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
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
            nama: '',
            slug: '',
            deskripsi: '',
            icon: '',
            persyaratan: '',
            prosedur: ''
        });
        setIsFormVisible(false);
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            nama: item.nama,
            slug: item.slug,
            deskripsi: item.deskripsi,
            icon: item.icon,
            persyaratan: item.persyaratan,
            prosedur: item.prosedur
        });
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus layanan ini?')) return;
        try {
            await layananService.delete(id);
            toast.success('Layanan berhasil dihapus');
            fetchData();
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Gagal menghapus layanan');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            if (formData.id) {
                await layananService.update(formData.id, formData);
            } else {
                await layananService.create(formData);
            }
            toast.success('Layanan berhasil disimpan');
            fetchData();
            resetForm();
        } catch (error) {
            console.error('Submit failed:', error);
            toast.error('Gagal menyimpan layanan');
        } finally {
            setSubmitLoading(false);
        }
    };

    // Auto-generate slug from nama
    useEffect(() => {
        if (!formData.id && formData.nama) {
            const slug = formData.nama.toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.nama, formData.id]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Layanan</h1>
                    <p className="text-muted-foreground">Manage public services information (SKCK, SIM, etc).</p>
                </div>
                {!isFormVisible && (
                    <Button onClick={() => setIsFormVisible(true)} className="bg-secondary text-black hover:bg-yellow-500">
                        <Plus className="w-4 h-4 mr-2" /> Add Service
                    </Button>
                )}
            </div>

            {isFormVisible && (
                <Card className="animate-in slide-in-from-top-4 duration-300">
                    <CardHeader>
                        <CardTitle>{formData.id ? 'Edit Layanan' : 'Tambah Layanan Baru'}</CardTitle>
                        <CardDescription>Service information details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama Layanan</Label>
                                <Input id="nama" value={formData.nama} onChange={handleInputChange} placeholder="e.g. Pembuatan SKCK" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deskripsi">Deskripsi Singkat</Label>
                                <Textarea id="deskripsi" value={formData.deskripsi} onChange={handleInputChange} placeholder="Service description..." />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="persyaratan">Persyaratan</Label>
                                <Textarea id="persyaratan" value={formData.persyaratan} onChange={handleInputChange} placeholder="- KTP\n- KK..." className="h-32 font-mono text-sm" />
                                <p className="text-xs text-muted-foreground">Pisahkan dengan baris baru.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="prosedur">Prosedur / Langkah-langkah</Label>
                                <Textarea id="prosedur" value={formData.prosedur} onChange={handleInputChange} placeholder="Urutan prosedur..." className="h-32" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="icon">Icon Name (Lucide)</Label>
                                <Input id="icon" value={formData.icon} onChange={handleInputChange} placeholder="e.g. FileText, User, Car..." />
                            </div>

                            <div className="flex justify-end pt-4 gap-2">
                                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                <Button type="submit" disabled={submitLoading} className="bg-secondary text-black hover:bg-yellow-500">
                                    {submitLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Simpan Layanan
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
                <div className="space-y-4">
                    {data.length === 0 ? (
                        <div className="border rounded-lg p-8 text-center text-muted-foreground bg-white">
                            No services data available.
                        </div>
                    ) : (
                        data.map((item) => (
                            <Card key={item.id} className="hover:border-secondary transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-secondary/20 text-yellow-800 rounded-lg shrink-0">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl">{item.nama}</h3>
                                                <p className="text-muted-foreground text-sm mt-1">{item.deskripsi}</p>

                                                {item.persyaratan && (
                                                    <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                                                        <span className="font-semibold text-gray-700">Persyaratan:</span>
                                                        <pre className="whitespace-pre-wrap font-sans text-gray-600 mt-1">{item.persyaratan}</pre>
                                                    </div>
                                                )}

                                                {item.prosedur && (
                                                    <div className="mt-2 text-sm text-gray-600">
                                                        <span className="font-semibold">Prosedur:</span> {item.prosedur.substring(0, 50)}...
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
