import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { dpoService, STORAGE_URL } from '@/lib/api';

import { toast } from 'sonner';

export default function DataDPO() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: null,
        nomor_surat: '',
        status: '',
        nama: '',
        alias: '',
        kasus: '',
        ciri_fisik: '',
        foto: null
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await dpoService.getAll();
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
        setFormData(prev => ({ ...prev, status: value }));
    };

    const resetForm = () => {
        setFormData({
            id: null,
            nomor_surat: '',
            status: '',
            nama: '',
            alias: '',
            kasus: '',
            ciri_fisik: '',
            foto: null
        });
        setIsFormVisible(false);
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            nomor_surat: item.nomor_surat,
            status: item.status,
            nama: item.nama,
            alias: item.alias,
            kasus: item.kasus,
            ciri_fisik: item.ciri_fisik,
            foto: null
        });
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus data DPO ini?')) return;
        try {
            await dpoService.delete(id);
            toast.success('Data DPO berhasil dihapus');
            fetchData();
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Gagal menghapus data DPO');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            const data = new FormData();
            data.append('nomor_surat', formData.nomor_surat);
            data.append('status', formData.status);
            data.append('nama', formData.nama);
            data.append('alias', formData.alias);
            data.append('kasus', formData.kasus);
            data.append('ciri_fisik', formData.ciri_fisik);

            if (formData.foto) {
                data.append('foto', formData.foto);
            }

            if (formData.id) {
                data.append('_method', 'PUT');
                await dpoService.update(formData.id, data);
            } else {
                await dpoService.create(data);
            }

            toast.success('Data DPO berhasil disimpan');
            fetchData();
            resetForm();
        } catch (error) {
            console.error('Submit failed:', error);
            toast.error('Gagal menyimpan data DPO');
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Data DPO</h1>
                    <p className="text-muted-foreground">Manage wanted persons list (Daftar Pencarian Orang).</p>
                </div>
                {!isFormVisible && (
                    <Button onClick={() => setIsFormVisible(true)} variant="destructive" className="bg-red-600 hover:bg-red-700">
                        <Plus className="w-4 h-4 mr-2" /> Add DPO
                    </Button>
                )}
            </div>

            {isFormVisible && (
                <Card className="animate-in slide-in-from-top-4 duration-300 border-red-200">
                    <CardHeader>
                        <CardTitle className="text-red-700">{formData.id ? 'Edit Data DPO' : 'Input Data DPO Baru'}</CardTitle>
                        <CardDescription>Input wanted person details carefully.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nomor_surat">Nomor Surat DPO</Label>
                                    <Input id="nomor_surat" value={formData.nomor_surat} onChange={handleInputChange} placeholder="DPO/..." required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status Pencarian</Label>
                                    <Select value={formData.status} onValueChange={handleSelectChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="aktif">Aktif (Masih Buron)</SelectItem>
                                            <SelectItem value="tertangkap">Tertangkap</SelectItem>
                                            <SelectItem value="menyerahkan_diri">Menyerahkan Diri</SelectItem>
                                            <SelectItem value="meninggal">Meninggal Dunia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama">Nama Lengkap</Label>
                                    <Input id="nama" value={formData.nama} onChange={handleInputChange} placeholder="Full name" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="alias">Alias / Nama Panggilan</Label>
                                    <Input id="alias" value={formData.alias} onChange={handleInputChange} placeholder="Nickname" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kasus">Tindak Pidana / Kasus</Label>
                                <Input id="kasus" value={formData.kasus} onChange={handleInputChange} placeholder="e.g. Pencurian dengan kekerasan" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ciri_fisik">Ciri-ciri Fisik Khusus</Label>
                                <Textarea id="ciri_fisik" value={formData.ciri_fisik} onChange={handleInputChange} placeholder="Tinggi badan, warna kulit, tato, dll." />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="foto">Foto Terakhir</Label>
                                <Input id="foto" type="file" onChange={handleInputChange} accept="image/*" />
                            </div>

                            <div className="flex justify-end pt-4 gap-2">
                                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                <Button type="submit" disabled={submitLoading} variant="destructive">
                                    {submitLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Terbitkan DPO
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {loading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {data.length === 0 ? (
                        <div className="col-span-full border rounded-lg p-8 text-center text-muted-foreground bg-white">
                            No DPO data available.
                        </div>
                    ) : (
                        data.map((item) => (
                            <Card key={item.id} className="overflow-hidden border-red-500/20 group hover:shadow-lg transition-all">
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
                                <CardContent className="p-4 bg-red-50 h-full">
                                    <h4 className="font-bold text-red-900 line-clamp-1">{item.nama}</h4>
                                    {item.alias && <p className="text-xs text-red-700 italic mb-1">({item.alias})</p>}
                                    <p className="text-xs font-semibold text-gray-700 mt-2">Kasus:</p>
                                    <p className="text-sm text-gray-800 line-clamp-2">{item.kasus}</p>
                                    <div className="mt-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                            ${item.status === 'aktif' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                            {item.status}
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
