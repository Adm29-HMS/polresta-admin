import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { kriminalService, mediaService, STORAGE_URL } from '@/lib/api';
import RichTextEditor from '@/components/RichTextEditor';
import '../styles/tiptap-custom.css';
import { toast } from 'sonner';

export default function DataKriminal() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: null,
        no_laporan: '',
        tanggal: '',
        jenis: '',
        status: '',
        lokasi: '',
        kronologi: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await kriminalService.getAll();
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

    const handleSelectChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData({
            id: null,
            no_laporan: '',
            tanggal: '',
            jenis: '',
            status: '',
            lokasi: '',
            kronologi: ''
        });
        setIsFormVisible(false);
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            no_laporan: item.no_laporan,
            tanggal: item.tanggal,
            jenis: item.jenis,
            status: item.status,
            lokasi: item.lokasi,
            kronologi: item.kronologi
        });
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) return;
        try {
            await kriminalService.delete(id);
            toast.success('Laporan berhasil dihapus');
            fetchData();
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Gagal menghapus laporan');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            if (formData.id) {
                await kriminalService.update(formData.id, formData);
            } else {
                await kriminalService.create(formData);
            }
            toast.success('Laporan berhasil disimpan');
            fetchData();
            resetForm();
        } catch (error) {
            console.error('Submit failed:', error);
            toast.error('Gagal menyimpan laporan');
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Data Kriminal</h1>
                    <p className="text-muted-foreground">Manage crime reports and statistics.</p>
                </div>
                {!isFormVisible && (
                    <Button onClick={() => setIsFormVisible(true)} className="bg-secondary text-black hover:bg-yellow-500">
                        <Plus className="w-4 h-4 mr-2" /> Add Laporan
                    </Button>
                )}
            </div>

            {isFormVisible && (
                <Card className="animate-in slide-in-from-top-4 duration-300">
                    <CardHeader>
                        <CardTitle>{formData.id ? 'Edit Laporan' : 'Input Laporan Baru'}</CardTitle>
                        <CardDescription>Record crime incident details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="no_laporan">Nomor Laporan</Label>
                                    <Input id="no_laporan" value={formData.no_laporan} onChange={handleInputChange} placeholder="LP/..." required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal">Tanggal Kejadian</Label>
                                    <Input id="tanggal" type="date" value={formData.tanggal} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="jenis">Jenis Kejahatan</Label>
                                    <Select value={formData.jenis} onValueChange={(val) => handleSelectChange('jenis', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pencurian">Pencurian</SelectItem>
                                            <SelectItem value="narkoba">Narkoba</SelectItem>
                                            <SelectItem value="kekerasan">Kekerasan</SelectItem>
                                            <SelectItem value="pembunuhan">Pembunuhan</SelectItem>
                                            <SelectItem value="penipuan">Penipuan</SelectItem>
                                            <SelectItem value="lainnya">Lainnya</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status Kasus</Label>
                                    <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="penyelidikan">Penyelidikan</SelectItem>
                                            <SelectItem value="penyidikan">Penyidikan</SelectItem>
                                            <SelectItem value="selesai">Selesai (P21)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lokasi">Lokasi Kejadian (TKP)</Label>
                                <Input id="lokasi" value={formData.lokasi} onChange={handleInputChange} placeholder="Jl. ..." required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kronologi">Kronologi Singkat</Label>
                                <RichTextEditor
                                    value={formData.kronologi}
                                    onChange={(value) => setFormData(prev => ({ ...prev, kronologi: value }))}
                                    placeholder="Tuliskan kronologi kejadian..."
                                />
                            </div>

                            <div className="flex justify-end pt-4 gap-2">
                                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                <Button type="submit" disabled={submitLoading} className="bg-secondary text-black hover:bg-yellow-500">
                                    {submitLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Simpan Laporan
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
                                <TableHead>Tanggal</TableHead>
                                <TableHead>No. Laporan</TableHead>
                                <TableHead>Jenis & Lokasi</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No crime reports available.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.tanggal}</TableCell>
                                        <TableCell className="font-medium">{item.no_laporan}</TableCell>
                                        <TableCell>
                                            <div className="font-semibold">{item.jenis}</div>
                                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">{item.lokasi}</div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-semibold
                                                ${item.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                                                    item.status === 'Penyidikan' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'}`}>
                                                {item.status}
                                            </span>
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
