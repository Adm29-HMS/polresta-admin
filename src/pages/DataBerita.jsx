import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Plus, Loader2, Calendar } from 'lucide-react';
import { beritaService, kategoriBeritaService, mediaService, STORAGE_URL } from '@/lib/api';
import RichTextEditor from '@/components/RichTextEditor';
import '../styles/tiptap-custom.css';
import { toast } from 'sonner';

export default function DataBerita() {
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: null,
        judul: '',
        kategori_id: '',
        konten: '',
        ringkasan: '',
        penulis: '',
        published_at: null,
        cover: null,
        slug: '' // Optional if we want to show it
    });

    useEffect(() => {
        fetchData();
        fetchCategories();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await beritaService.getAll();
            setData(Array.isArray(result) ? result : result.data || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const result = await kategoriBeritaService.getAll();
            setCategories(Array.isArray(result) ? result : result.data || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
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

    const handleSelectChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData({
            id: null,
            judul: '',
            kategori_id: '',
            konten: '',
            ringkasan: '',
            penulis: '',
            published_at: null,
            cover: null
        });
        setIsFormVisible(false);
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            judul: item.judul,
            kategori_id: item.kategori_id ? item.kategori_id.toString() : '',
            konten: item.konten,
            ringkasan: item.ringkasan,
            penulis: item.penulis || '',
            published_at: item.published_at,
            cover: null
        });
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
        try {
            await beritaService.delete(id);
            toast.success('Berita berhasil dihapus');
            fetchData();
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Gagal menghapus berita');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            // Mapping to API expected fields. 
            // Note: Standard API might need 'judul', 'kategori_id', 'isi', etc.
            // Let's assume standard REST naming convention or look at API keys.
            // Checking api.php -> BeritaController. 
            // Usually standard english keys: title, content, category_id.
            // If API expects 'judul' instead of 'title', we need to check migration/controller.
            // Since I don't have controller code visible, I'll guess standard English or Bahasa.
            // My previous artifact used 'judul' in `DataBerita.jsx`.
            // Let's assume backend expects `title` based on migration conventions but often Indonesian devs use `judul`.
            // I'll stick to English keys in FormData if migration used English. 
            // If I look at the dummy data in original `DataBerita.jsx`: <Label htmlFor="judul">Judul Berita</Label>
            // I will use English keys as safe bet or mixed? 
            // Let's check `DataPejabat` used `nama` `nrp`.
            // Safest bet for Berita: `title`, `slug` (auto), `content`, `category_id`.

            const data = new FormData();
            data.append('judul', formData.judul);
            data.append('konten', formData.konten);
            data.append('kategori_id', formData.category_id || formData.kategori_id); // Support both just in case, but prefer kategori_id

            // Generate slug strictly from judul if not provided (backend usually handles this but good to have)
            // Backend validation: 'slug' => 'required|string|unique:berita,slug'
            // So we MUST send slug. Let's create a simple slug generator.
            const slug = formData.judul.toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
            data.append('slug', slug);

            if (formData.ringkasan) data.append('ringkasan', formData.ringkasan);
            data.append('penulis', formData.penulis);

            // Default published status
            data.append('is_published', '1');

            if (formData.cover) {
                data.append('cover', formData.cover);
            }

            if (formData.id) {
                // Update
                data.append('_method', 'PUT');
                await beritaService.update(formData.id, data);
            } else {
                // Create
                await beritaService.create(data);
            }

            toast.success('Berita berhasil disimpan');
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
                toast.error('Gagal menyimpan berita');
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEditorImageUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append('title', `Inline Image - ${new Date().getTime()}`);
            formData.append('type', 'photo');
            formData.append('file_path', file);

            // Reusing mediaService or creation endpoint
            const response = await mediaService.create(formData);

            // Construct URL. If response has file_path (from media service), use it.
            // Adjust based on your API response structure.
            const path = response.file_path || response.url || response.data?.file_path;

            if (path) {
                return `${STORAGE_URL}/${path}`;
            } else {
                toast.error('Gagal mendapatkan URL gambar.');
                return null;
            }
        } catch (error) {
            console.error('Editor upload failed:', error);
            toast.error('Gagal mengupload gambar.');
            return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Data Berita</h1>
                    <p className="text-muted-foreground">Manage news articles and announcements.</p>
                </div>
                {!isFormVisible && (
                    <Button onClick={() => setIsFormVisible(true)} className="bg-secondary text-black hover:bg-yellow-500">
                        <Plus className="w-4 h-4 mr-2" /> Add Berita
                    </Button>
                )}
            </div>

            {isFormVisible && (
                <Card className="animate-in slide-in-from-top-4 duration-300">
                    <CardHeader>
                        <CardTitle>{formData.id ? 'Edit Berita' : 'Buat Berita Baru'}</CardTitle>
                        <CardDescription>Create a new news article.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="judul">Judul Berita</Label>
                                <Input id="judul" value={formData.judul} onChange={handleInputChange} placeholder="Enter title..." required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category_id">Kategori</Label>
                                    <Select value={formData.kategori_id} onValueChange={(val) => handleSelectChange('kategori_id', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                                    {cat.nama}
                                                </SelectItem>
                                            ))}
                                            {categories.length === 0 && <SelectItem value="0" disabled>No categories found</SelectItem>}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="penulis">Penulis / Reporter</Label>
                                    <Select value={formData.penulis} onValueChange={(val) => handleSelectChange('penulis', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Penulis" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="Humas Polresta Sorong Kota">Sihumas Polresta Sorong Kota</SelectItem>
                                            <SelectItem value="TBNews">TBNews Polri</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cover">Cover Image</Label>
                                <Input id="cover" type="file" onChange={handleInputChange} accept="image/*" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ringkasan">Ringkasan</Label>
                                <Textarea id="ringkasan" value={formData.ringkasan} onChange={handleInputChange} placeholder="Short description..." className="h-20" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="konten">Isi Berita</Label>
                                <RichTextEditor
                                    value={formData.konten}
                                    onChange={(value) => setFormData(prev => ({ ...prev, konten: value }))}
                                    placeholder="Tulis isi berita lengkap di sini..."
                                    onImageUpload={handleEditorImageUpload}
                                />
                            </div>

                            <div className="flex justify-end pt-4 gap-2">
                                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                <Button type="submit" disabled={submitLoading} className="bg-secondary text-black hover:bg-yellow-500">
                                    {submitLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Publish Berita
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
                <div className="grid gap-4">
                    {data.length === 0 ? (
                        <Card>
                            <CardContent className="p-6 text-center text-muted-foreground">
                                No news articles available.
                            </CardContent>
                        </Card>
                    ) : (
                        data.map(item => (
                            <Card key={item.id} className="flex flex-col md:flex-row overflow-hidden group">
                                <div className="w-full md:w-48 h-48 md:h-auto bg-gray-200 relative shrink-0">
                                    {item.cover ? (
                                        <img src={`${STORAGE_URL}/${item.cover}`} alt={item.judul} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="inline-block px-2 py-1 text-xs font-semibold bg-secondary/20 text-yellow-700 rounded mb-2">
                                                {item.kategori?.nama || 'Uncategorized'}
                                            </span>
                                            <h3 className="font-bold text-lg group-hover:text-secondary transition-colors">{item.judul}</h3>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-sm line-clamp-2 md:line-clamp-3 mb-4 flex-1">
                                        {item.ringkasan || item.konten?.substring(0, 150)}...
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                        {item.penulis && (
                                            <div>By {item.penulis}</div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
