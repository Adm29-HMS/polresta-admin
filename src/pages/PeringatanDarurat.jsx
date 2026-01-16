import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { peringatanDaruratService } from '@/lib/api';

import { toast } from 'sonner';

export default function PeringatanDarurat() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: null,
        judul: '',
        level: '',
        lokasi: '',
        deskripsi: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await peringatanDaruratService.getAll();
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

    const handleSelectChange = (value) => {
        setFormData(prev => ({ ...prev, level: value }));
    };

    const resetForm = () => {
        setFormData({
            id: null,
            judul: '',
            level: '',
            lokasi: '',
            deskripsi: ''
        });
        setIsFormVisible(false);
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            judul: item.judul,
            level: item.level,
            lokasi: item.lokasi,
            deskripsi: item.deskripsi
        });
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus peringatan ini?')) return;
        try {
            await peringatanDaruratService.delete(id);
            toast.success('Peringatan berhasil dihapus');
            fetchData();
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Gagal menghapus peringatan');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            if (formData.id) {
                await peringatanDaruratService.update(formData.id, formData);
            } else {
                await peringatanDaruratService.create(formData);
            }
            toast.success('Peringatan berhasil dibroadcast');
            fetchData();
            resetForm();
        } catch (error) {
            console.error('Submit failed:', error);
            toast.error('Gagal broadcast peringatan');
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Peringatan Darurat</h1>
                    <p className="text-muted-foreground">Broadcast emergency alerts or warnings.</p>
                </div>
                {!isFormVisible && (
                    <Button onClick={() => setIsFormVisible(true)} className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="w-4 h-4 mr-2" /> Create Alert
                    </Button>
                )}
            </div>

            {isFormVisible && (
                <Card className="animate-in slide-in-from-top-4 duration-300 border-orange-200">
                    <CardHeader>
                        <CardTitle className="text-orange-700">{formData.id ? 'Edit Alert' : 'New Emergency Alert'}</CardTitle>
                        <CardDescription>This will be broadcasted to public channels.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="judul">Judul Peringatan</Label>
                                <Input id="judul" value={formData.judul} onChange={handleInputChange} placeholder="e.g. SIAGA BANJIR" required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="level">Level Bahaya</Label>
                                    <Select value={formData.level} onValueChange={handleSelectChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="info">Informasi (Hijau)</SelectItem>
                                            <SelectItem value="waspada">Waspada (Kuning)</SelectItem>
                                            <SelectItem value="bahaya">Bahaya (Merah)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lokasi">Lokasi Terdampak</Label>
                                    <Input id="lokasi" value={formData.lokasi} onChange={handleInputChange} placeholder="Area..." required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deskripsi">Deskripsi & Instruksi</Label>
                                <Textarea id="deskripsi" value={formData.deskripsi} onChange={handleInputChange} placeholder="Describe the situation and what citizens should do..." className="h-32" required />
                            </div>

                            <div className="flex justify-end pt-4 gap-2">
                                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                <Button type="submit" disabled={submitLoading} className="bg-orange-600 hover:bg-orange-700">
                                    {submitLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Broadcast Alert
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {loading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                </div>
            ) : (
                <div className="space-y-4">
                    {data.length === 0 ? (
                        <div className="border rounded-lg p-8 text-center text-muted-foreground bg-white">
                            No active alerts.
                        </div>
                    ) : (
                        data.map((item) => (
                            <Card key={item.id} className={`border-l-4 ${item.level === 'bahaya' ? 'border-l-red-600' :
                                item.level === 'waspada' ? 'border-l-yellow-500' : 'border-l-green-500'
                                }`}>
                                <CardContent className="p-4 flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">{item.judul}</h3>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase text-white ${item.level === 'bahaya' ? 'bg-red-600' :
                                                item.level === 'waspada' ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}>{item.level}</span>
                                            <span className="text-xs text-muted-foreground">{item.lokasi}</span>
                                        </div>
                                        <p className="text-sm">{item.deskripsi}</p>
                                    </div>
                                    <div className="flex gap-1 ml-4">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
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
