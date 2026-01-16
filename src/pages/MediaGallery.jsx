import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Plus, Loader2, PlayCircle, Image as ImageIcon } from 'lucide-react';
import { mediaService, STORAGE_URL } from '@/lib/api';
import { toast } from 'sonner';

export default function MediaGallery() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: null,
        title: '',
        type: 'photo',
        url: '',
        file: null
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await mediaService.getAll();
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

    const handleSelectChange = (value) => {
        setFormData(prev => ({ ...prev, type: value }));
    };

    const resetForm = () => {
        setFormData({
            id: null,
            title: '',
            type: 'photo',
            url: '',
            file: null
        });
        setIsFormVisible(false);
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            title: item.title,
            type: item.type,
            url: item.url || '',
            file: null
        });
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus media ini?')) return;
        try {
            await mediaService.delete(id);
            toast.success('Media berhasil dihapus');
            fetchData();
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Gagal menghapus media');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('type', formData.type);

            if (formData.type === 'video') {
                data.append('url', formData.url);
            }

            if (formData.type === 'photo' && formData.file) {
                data.append('file_path', formData.file);
            }

            if (formData.id) {
                data.append('_method', 'PUT');
                await mediaService.update(formData.id, data);
            } else {
                await mediaService.create(data);
            }

            toast.success('Media berhasil disimpan');
            fetchData();
            resetForm();
        } catch (error) {
            console.error('Submit failed:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
                if (error.response.data.errors) {
                    Object.values(error.response.data.errors).forEach(err => {
                        toast.error(err[0]);
                    });
                }
            } else {
                toast.error('Gagal menyimpan media');
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Media Gallery</h1>
                    <p className="text-muted-foreground">Manage photos and video embeds.</p>
                </div>
                {!isFormVisible && (
                    <Button onClick={() => setIsFormVisible(true)} className="bg-secondary text-black hover:bg-yellow-500">
                        <Plus className="w-4 h-4 mr-2" /> Add Media
                    </Button>
                )}
            </div>

            {isFormVisible && (
                <Card className="animate-in slide-in-from-top-4 duration-300">
                    <CardHeader>
                        <CardTitle>{formData.id ? 'Edit Media' : 'Add New Media'}</CardTitle>
                        <CardDescription>Upload a photo or add a youtube embed link.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Media Title</Label>
                                    <Input id="title" value={formData.title} onChange={handleInputChange} placeholder="Event Name, etc." required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Media Type</Label>
                                    <Select value={formData.type} onValueChange={handleSelectChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="photo">Photo / Gallery</SelectItem>
                                            <SelectItem value="video">Video (Youtube)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {formData.type === 'video' ? (
                                <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                                    <Label htmlFor="url">Youtube URL</Label>
                                    <Input id="url" value={formData.url} onChange={handleInputChange} placeholder="https://youtube.com/watch?v=..." required />
                                </div>
                            ) : (
                                <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                                    <Label htmlFor="file">Photo File {formData.id && '(Leave empty if unchanged)'}</Label>
                                    <Input id="file" type="file" onChange={handleInputChange} accept="image/*" className="cursor-pointer" />
                                </div>
                            )}

                            <div className="flex justify-end pt-4 gap-2">
                                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                <Button type="submit" disabled={submitLoading} className="bg-secondary text-black hover:bg-yellow-500">
                                    {submitLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Save Media
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.length === 0 ? (
                        <div className="col-span-full border rounded-lg p-8 text-center text-muted-foreground bg-white">
                            No media items found.
                        </div>
                    ) : (
                        data.map((item) => (
                            <Card key={item.id} className="overflow-hidden group">
                                <div className="h-48 bg-gray-200 w-full relative">
                                    {item.type === 'video' ? (
                                        <div className="w-full h-full flex items-center justify-center bg-black/10">
                                            <PlayCircle className="w-12 h-12 text-gray-700 opacity-50" />
                                            {/* Could embed thumbnail if available */}
                                        </div>
                                    ) : (
                                        item.file_path ? (
                                            <img src={`${STORAGE_URL}/${item.file_path}`} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <ImageIcon className="w-12 h-12 opacity-50" />
                                            </div>
                                        )
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-1 bg-white/80 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEdit(item)}>
                                            <Edit className="w-3 h-3" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => handleDelete(item.id)}>
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h4 className="font-semibold line-clamp-1">{item.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold
                                            ${item.type === 'video' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {item.type}
                                        </span>
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
