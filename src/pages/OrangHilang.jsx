import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { orangHilangService, mediaService, STORAGE_URL } from '@/lib/api';
import RichTextEditor from '@/components/RichTextEditor';
import '../styles/tiptap-custom.css';
import { toast } from 'sonner';

export default function OrangHilang() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: null,
        nama: '',
        jenis_kelamin: '',
        usia: '',
        tanggal_hilang: '',
        lokasi_terakhir: '',
        lokasi_terakhir: '',
        ciri: '',
        kontak: '',
        status: 'dicari',
        foto: null
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await orangHilangService.getAll();
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

    const handleSelectChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData({
            id: null,
            nama: '',
            jenis_kelamin: '',
            usia: '',
            tanggal_hilang: '',
            lokasi_terakhir: '',
            ciri: '',
            kontak: '',
            status: 'dicari',
            foto: null
        });
        setIsFormVisible(false);
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            nama: item.nama,
            jenis_kelamin: item.jenis_kelamin,
            usia: item.usia,
            tanggal_hilang: item.tanggal_hilang,
            lokasi_terakhir: item.lokasi_terakhir,
            ciri: item.ciri,
            kontak: item.kontak,
            status: item.status || 'dicari',
            foto: null
        });
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
        try {
            await orangHilangService.delete(id);
            toast.success('Data Orang Hilang berhasil dihapus');
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
            const data = new FormData();
            data.append('nama', formData.nama);
            data.append('jenis_kelamin', formData.jenis_kelamin);
            data.append('usia', formData.usia);
            data.append('tanggal_hilang', formData.tanggal_hilang);
            data.append('lokasi_terakhir', formData.lokasi_terakhir);
            data.append('ciri', formData.ciri);
            data.append('kontak', formData.kontak);
            data.append('status', formData.status);

            if (formData.foto) {
                data.append('foto', formData.foto);
            }

            if (formData.id) {
                data.append('_method', 'PUT');
                await orangHilangService.update(formData.id, data);
            } else {
                await orangHilangService.create(data);
            }

            toast.success('Data berhasil disimpan');
            fetchData();
            resetForm();
        } catch (error) {
            console.error('Submit failed:', error);
            toast.error('Gagal menyimpan data');
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Data Orang Hilang</h1>
                    <p className="text-muted-foreground">Manage missing persons reports.</p>
                </div>
                {!isFormVisible && (
                    <Button onClick={() => setIsFormVisible(true)} className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="w-4 h-4 mr-2" /> Lapor Orang Hilang
                    </Button>
                )}
            </div>

            {isFormVisible && (
                <Card className="animate-in slide-in-from-top-4 duration-300 border-orange-200">
                    <CardHeader>
                        <CardTitle className="text-orange-700">{formData.id ? 'Edit Laporan' : 'Form Laporan Orang Hilang'}</CardTitle>
                        <CardDescription>Input details of the missing person.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama">Nama Lengkap</Label>
                                    <Input id="nama" value={formData.nama} onChange={handleInputChange} placeholder="Full name" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                    <Select value={formData.jenis_kelamin} onValueChange={(val) => handleSelectChange('jenis_kelamin', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="laki-laki">Laki-laki</SelectItem>
                                            <SelectItem value="perempuan">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="dicari">Dicari</SelectItem>
                                            <SelectItem value="ditemukan">Ditemukan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="usia">Usia</Label>
                                    <Input id="usia" type="number" value={formData.usia} onChange={handleInputChange} placeholder="Age" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_hilang">Tanggal Hilang</Label>
                                    <Input id="tanggal_hilang" type="date" value={formData.tanggal_hilang} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lokasi_terakhir">Lokasi Terakhir Dilihat</Label>
                                <Input id="lokasi_terakhir" value={formData.lokasi_terakhir} onChange={handleInputChange} placeholder="Last seen location..." required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ciri">Ciri-ciri Fisik / Pakaian Terakhir</Label>
                                <RichTextEditor
                                    value={formData.ciri}
                                    onChange={(value) => setFormData(prev => ({ ...prev, ciri: value }))}
                                    placeholder="Describe clothing, physical features, etc."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kontak">Kontak Keluarga (Hubungi)</Label>
                                <Input id="kontak" value={formData.kontak} onChange={handleInputChange} placeholder="Phone number to contact" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="foto">Foto Terbaru</Label>
                                <Input id="foto" type="file" onChange={handleInputChange} accept="image/*" />
                            </div>

                            <div className="flex justify-end pt-4 gap-2">
                                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                <Button type="submit" disabled={submitLoading} className="bg-orange-600 hover:bg-orange-700">
                                    {submitLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Terbitkan Laporan
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {data.length === 0 ? (
                        <div className="col-span-full border rounded-lg p-8 text-center text-muted-foreground bg-white">
                            No missing persons reports available.
                        </div>
                    ) : (
                        data.map((item) => (
                            <Card key={item.id} className="overflow-hidden border-orange-500/20 group hover:shadow-lg transition-all">
                                <div className="h-56 bg-gray-200 w-full relative">
                                    {item.foto ? (
                                        <img src={`${STORAGE_URL}/${item.foto}`} alt={item.nama} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Photo</div>
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
                                <CardContent className="p-4 bg-orange-50 h-full">
                                    <h4 className="font-bold text-orange-900 line-clamp-1">{item.nama}</h4>
                                    <p className="text-xs text-orange-800">Hilang: {new Date(item.tanggal_hilang).toLocaleDateString()}</p>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">Lokasi: {item.lokasi_terakhir}</p>
                                    <div className="mt-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${item.status === 'dicari'
                                            ? 'bg-red-100 text-red-700 border-red-200'
                                            : 'bg-green-100 text-green-700 border-green-200'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-orange-200">
                                        <p className="text-xs font-bold text-orange-800">Hubungi:</p>
                                        <p className="text-sm font-mono text-gray-800">{item.kontak}</p>
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
