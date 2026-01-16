import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { profilService } from '@/lib/api';
import { toast } from 'sonner';

export default function Profil() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: null,
        key: '',
        value: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await profilService.getAll();
            setData(Array.isArray(result) ? result : result.data || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { id, value, files } = e.target;
        if (files) {
            setFormData(prev => ({ ...prev, [id]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            key: '',
            value: ''
        });
        setIsFormVisible(false);
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            key: item.key,
            value: item.value
        });
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus bagian profil ini?')) return;
        try {
            await profilService.delete(id);
            toast.success('Bagian profil berhasil dihapus');
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
            // FormData not strictly needed if no files, but consistent
            const payload = {
                key: formData.key,
                value: formData.value
            };

            if (formData.id) {
                await profilService.update(formData.id, payload);
            } else {
                await profilService.create(payload);
            }

            toast.success('Profil berhasil disimpan');
            fetchData();
            resetForm();
        } catch (error) {
            console.error('Submit failed:', error);
            toast.error('Gagal menyimpan profil');
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Profil Polres</h1>
                    <p className="text-muted-foreground">Manage profile sections (History, Vision, Mission).</p>
                </div>
                {!isFormVisible && (
                    <Button onClick={() => setIsFormVisible(true)} className="bg-secondary text-black hover:bg-yellow-500">
                        <Plus className="w-4 h-4 mr-2" /> Add Section
                    </Button>
                )}
            </div>

            {isFormVisible && (
                <Card className="animate-in slide-in-from-top-4 duration-300">
                    <CardHeader>
                        <CardTitle>{formData.id ? 'Edit Section' : 'Add New Section'}</CardTitle>
                        <CardDescription>Create a new profile section.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="key">Judul Bagian (Key)</Label>
                                <Input id="key" value={formData.key} onChange={handleInputChange} placeholder="e.g. Visi & Misi" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="value">Konten Profil</Label>
                                <Textarea id="value" value={formData.value} onChange={handleInputChange} placeholder="Write content here..." className="h-64" required />
                            </div>

                            <div className="flex justify-end pt-4 gap-2">
                                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                <Button type="submit" disabled={submitLoading} className="bg-secondary text-black hover:bg-yellow-500">
                                    {submitLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Simpan
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
                <div className="space-y-8">
                    {data.length === 0 ? (
                        <div className="border rounded-lg p-8 text-center text-muted-foreground bg-white">
                            No profile data available.
                        </div>
                    ) : (
                        data.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                {item.foto_url && (
                                    <div className="h-48 md:h-64 bg-gray-100 w-full">
                                        <img src={item.foto_url} alt={item.judul} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="p-6 md:p-8 relative group">
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 backdrop-blur rounded p-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(item.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4 border-b pb-4">{item.key}</h2>
                                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                                        {item.value}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
