import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, Plus, Loader2, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import { peraturanService, mediaService, STORAGE_URL } from '@/lib/api';
import RichTextEditor from '@/components/RichTextEditor';
import '../styles/tiptap-custom.css';

export default function Peraturan() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: null,
        nomor: '',
        tahun: '',
        tentang: '',
        file_path: null
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await peraturanService.getAll();
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
            nomor: '',
            tahun: '',
            tentang: '',
            file_path: null
        });
        setIsFormVisible(false);
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            nomor: item.nomor || item.nomor_peraturan,
            tahun: item.tahun,
            tentang: item.tentang,
            file_path: null
        });
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus peraturan ini?')) return;
        try {
            await peraturanService.delete(id);
            toast.success('Peraturan berhasil dihapus');
            fetchData();
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Gagal menghapus peraturan');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            const data = new FormData();
            data.append('nomor', formData.nomor);
            data.append('tahun', formData.tahun);
            data.append('tentang', formData.tentang);

            if (formData.file_path) {
                data.append('file_path', formData.file_path);
            }

            if (formData.id) {
                // For file uploads with PUT, use POST + _method: PUT
                data.append('_method', 'PUT');
                await peraturanService.update(formData.id, data);
            } else {
                await peraturanService.create(data);
            }

            toast.success('Peraturan berhasil disimpan');
            fetchData();
            resetForm();
        } catch (error) {
            console.error('Submit failed:', error);
            toast.error('Gagal menyimpan peraturan');
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Data Peraturan</h1>
                    <p className="text-muted-foreground">Manage UU, Perpol, and other regulations.</p>
                </div>
                {!isFormVisible && (
                    <Button onClick={() => setIsFormVisible(true)} className="bg-secondary text-black hover:bg-yellow-500">
                        <Plus className="w-4 h-4 mr-2" /> Add Peraturan
                    </Button>
                )}
            </div>

            {isFormVisible && (
                <Card className="animate-in slide-in-from-top-4 duration-300">
                    <CardHeader>
                        <CardTitle>{formData.id ? 'Edit Peraturan' : 'Upload Peraturan Baru'}</CardTitle>
                        <CardDescription>Share public documents regarding laws and regulations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nomor">Nomor Peraturan</Label>
                                    <Input id="nomor" value={formData.nomor} onChange={handleInputChange} placeholder="No. ... Tahun ..." required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tahun">Tahun</Label>
                                    <Input id="tahun" type="number" value={formData.tahun} onChange={handleInputChange} placeholder="2024" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tentang">Tentang</Label>
                                <RichTextEditor
                                    value={formData.tentang}
                                    onChange={(value) => setFormData(prev => ({ ...prev, tentang: value }))}
                                    placeholder="Peraturan ini mengatur tentang..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="file_path">File PDF {formData.id && '(Kosongkan jika tidak diubah)'}</Label>
                                <Input id="file_path" type="file" onChange={handleInputChange} accept=".pdf" />
                            </div>

                            <div className="flex justify-end pt-4 gap-2">
                                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                <Button type="submit" disabled={submitLoading} className="bg-secondary text-black hover:bg-yellow-500">
                                    {submitLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Upload Document
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
                <div className="space-y-2">
                    {data.length === 0 ? (
                        <div className="border rounded-lg p-8 text-center text-muted-foreground bg-white">
                            No regulations uploaded.
                        </div>
                    ) : (
                        data.map((item) => (
                            <Card key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="bg-red-100 text-red-600 p-3 rounded shrink-0">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-semibold text-sm truncate">{item.nomor}</h4>
                                        <p className="text-xs text-muted-foreground line-clamp-1">{item.tentang}</p>
                                        <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded text-gray-700 mt-1 inline-block">Tahun {item.tahun}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {item.file_url && (
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                                                <Download className="w-4 h-4 mr-1" /> PDF
                                            </a>
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
