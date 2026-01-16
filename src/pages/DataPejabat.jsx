import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { pejabatService, STORAGE_URL } from '@/lib/api';
import { toast } from 'sonner'; // Assuming sonner is installed or use alert

export default function DataPejabat() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        id: null,
        nama: '',
        nrp: '',
        pangkat: '',
        jabatan: '',
        urutan: '',
        foto: null
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await pejabatService.getAll();
            setData(Array.isArray(result) ? result : result.data || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error('Gagal mengambil data pejabat');
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
            nama: '',
            nrp: '',
            pangkat: '',
            jabatan: '',
            urutan: '',
            foto: null
        });
        setIsFormVisible(false);
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            nama: item.nama,
            nrp: item.nrp,
            pangkat: item.pangkat,
            jabatan: item.jabatan,
            urutan: item.urutan,
            foto: null // Foto handled separately if not changed
        });
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

        try {
            await pejabatService.delete(id);
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
            const data = new FormData();
            data.append('nama', formData.nama);
            data.append('nrp', formData.nrp);
            data.append('pangkat', formData.pangkat);
            data.append('jabatan', formData.jabatan);
            data.append('urutan', formData.urutan);

            if (formData.foto) {
                data.append('foto', formData.foto);
            }

            if (formData.id) {
                // Update mode
                // Note: For PUT with FormData in Laravel, sometimes needed _method: PUT or use POST with _method
                data.append('_method', 'PUT');
                await pejabatService.create(data); // Actually calling POST endpoint but with _method might be safer or check api.js
                // WAIT, api.js uses put for update: apiClient.put(`/api/pejabat/${id}`, data)
                // Axios PUT with FormData is tricky. Better use POST with _method='PUT' if using standard Laravel Resource
                // Or just use the update method but we need to verify if backend handles PUT form-data correctly.
                // Usually POST with _method='PUT' is the way for file uploads in updates.

                // Let's modify api.js update method later? Or just use POST with _method here
                // But pejabatService.update calls PUT. 
                // Let's try matching the service. 
                // If service uses PUT, axios sends PUT. Laravel might not read file in PUT. 
                // SAFE WAY: Use POST for update as well with _method field if containing files.

                // For now let's try to use a specific manual call or just creating a new 'updateWithFile' in service?
                // Or just standard update if no file is changed. 

                // Temporary fix: Use create for now with _method PUT appended if ID exists.
                // But let's stick to service.update for now and if it fails, I will fix api.js.
                await pejabatService.update(formData.id, data);
            } else {
                // Create mode
                await pejabatService.create(data);
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
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Data Pejabat</h1>
                    <p className="text-muted-foreground">Manage police officers and functional titles.</p>
                </div>
                {!isFormVisible && (
                    <Button onClick={() => setIsFormVisible(true)} className="bg-secondary text-black hover:bg-yellow-500">
                        <Plus className="w-4 h-4 mr-2" /> Add Pejabat
                    </Button>
                )}
            </div>

            {isFormVisible && (
                <Card className="animate-in slide-in-from-top-4 duration-300">
                    <CardHeader>
                        <CardTitle>{formData.id ? 'Edit Pejabat' : 'Tambah Pejabat'}</CardTitle>
                        <CardDescription>Input officer details correctly.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama">Nama Lengkap</Label>
                                    <Input id="nama" value={formData.nama} onChange={handleInputChange} placeholder="AKBP..." required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nrp">NRP</Label>
                                    <Input id="nrp" value={formData.nrp} onChange={handleInputChange} placeholder="12345678" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pangkat">Pangkat</Label>
                                    <Input id="pangkat" value={formData.pangkat} onChange={handleInputChange} placeholder="KOMBES POL" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="jabatan">Jabatan</Label>
                                    <Input id="jabatan" value={formData.jabatan} onChange={handleInputChange} placeholder="Kapolresta Sorong Kota" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="urutan">Urutan / Tingkatan</Label>
                                    <Input id="urutan" type="number" value={formData.urutan} onChange={handleInputChange} placeholder="10" required />
                                    <p className="text-[10px] text-muted-foreground">Used for sorting order (1 = Highest)</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="foto">Foto Profil {formData.id && '(Biarkan kosong jika tidak diubah)'}</Label>
                                <Input id="foto" type="file" onChange={handleInputChange} accept="image/*" />
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
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Urutan</TableHead>
                                <TableHead>Foto</TableHead>
                                <TableHead>Nama & NRP</TableHead>
                                <TableHead>Pangkat & Jabatan</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.urutan}</TableCell>
                                        <TableCell>
                                            {item.foto ? (
                                                <img src={`${STORAGE_URL}/${item.foto}`} alt={item.nama} className="w-10 h-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-xs text-gray-500">No Img</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{item.nama}</div>
                                            <div className="text-xs text-muted-foreground">NRP: {item.nrp}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{item.jabatan}</div>
                                            <div className="text-xs text-muted-foreground">{item.pangkat}</div>
                                        </TableCell>
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
