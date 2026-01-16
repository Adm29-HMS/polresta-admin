import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Plus, Loader2, MapPin, Phone } from 'lucide-react';
import { kantorPolisiService } from '@/lib/api';
import { toast } from 'sonner';

export default function KantorPolisi() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: null,
        nama: '',
        tipe: 'Polsek', // Default
        alamat: '',
        telepon: '',
        latitude: '',
        longitude: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await kantorPolisiService.getAll();
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
            tipe: 'Polsek',
            alamat: '',
            telepon: '',
            latitude: '',
            longitude: ''
        });
        setIsFormVisible(false);
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            nama: item.nama,
            tipe: item.tipe || 'Polsek',
            alamat: item.alamat,
            telepon: item.telepon || item.kontak,
            latitude: item.latitude,
            longitude: item.longitude
        });
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus kantor polisi ini?')) return;
        try {
            await kantorPolisiService.delete(id);
            toast.success('Kantor Polisi berhasil dihapus');
            fetchData();
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Gagal menghapus kantor polisi');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            if (formData.id) {
                await kantorPolisiService.update(formData.id, formData);
            } else {
                await kantorPolisiService.create(formData);
            }
            toast.success('Kantor Polisi berhasil disimpan');
            fetchData();
            resetForm();
        } catch (error) {
            console.error('Submit failed:', error);
            toast.error('Gagal menyimpan kantor polisi');
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Kantor Polisi</h1>
                    <p className="text-muted-foreground">Manage police station locations and contacts.</p>
                </div>
                {!isFormVisible && (
                    <Button onClick={() => setIsFormVisible(true)} className="bg-secondary text-black hover:bg-yellow-500">
                        <Plus className="w-4 h-4 mr-2" /> Add Office
                    </Button>
                )}
            </div>

            {isFormVisible && (
                <Card className="animate-in slide-in-from-top-4 duration-300">
                    <CardHeader>
                        <CardTitle>{formData.id ? 'Edit Kantor Polisi' : 'Tambah Kantor Polisi'}</CardTitle>
                        <CardDescription>Enter station details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama Kantor</Label>
                                <Input id="nama" value={formData.nama} onChange={handleInputChange} placeholder="e.g. Polsek Aimas" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tipe">Tipe Kantor</Label>
                                <Select value={formData.tipe} onValueChange={(val) => setFormData(prev => ({ ...prev, tipe: val }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Tipe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Polresta">Polresta</SelectItem>
                                        <SelectItem value="Polsek">Polsek</SelectItem>
                                        <SelectItem value="Satuan">Satuan / Pos</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="alamat">Alamat Lengkap</Label>
                                <Textarea id="alamat" value={formData.alamat} onChange={handleInputChange} placeholder="Address details..." required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telepon">Kontak / Telepon</Label>
                                <Input id="telepon" value={formData.telepon} onChange={handleInputChange} placeholder="Phone number" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="latitude">Latitude</Label>
                                    <Input id="latitude" value={formData.latitude} onChange={handleInputChange} placeholder="-0.875..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="longitude">Longitude</Label>
                                    <Input id="longitude" value={formData.longitude} onChange={handleInputChange} placeholder="131.25..." />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 gap-2">
                                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.length === 0 ? (
                        <div className="col-span-full border rounded-lg p-8 text-center text-muted-foreground bg-white">
                            No police stations data available.
                        </div>
                    ) : (
                        data.map((item) => (
                            <Card key={item.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{item.nama}</h3>
                                    <p className="text-sm text-muted-foreground mb-4 h-10 line-clamp-2">{item.alamat}</p>

                                    <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span className="font-medium">{item.telepon || item.kontak || '-'}</span>
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
