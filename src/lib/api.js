import apiClient from './axios';

export const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage';

/**
 * API Service untuk Dashboard Statistics
 */
export const dashboardService = {
    getStats: async () => {
        const response = await apiClient.get('/api/dashboard/stats');
        return response.data;
    },
};

/**
 * API Service untuk Kategori Berita
 */
export const kategoriBeritaService = {
    getAll: async () => {
        const response = await apiClient.get('/api/kategori-berita');
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/api/kategori-berita', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.put(`/api/kategori-berita/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/api/kategori-berita/${id}`);
        return response.data;
    },
};

/**
 * API Service untuk Pejabat
 */
export const pejabatService = {
    getAll: async () => {
        const response = await apiClient.get('/api/pejabat');
        return response.data;
    },
    getById: async (id) => {
        const response = await apiClient.get(`/api/pejabat/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/api/pejabat', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.post(`/api/pejabat/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/api/pejabat/${id}`);
        return response.data;
    },
};

/**
 * API Service untuk Berita
 */
export const beritaService = {
    getAll: async () => {
        const response = await apiClient.get('/api/berita');
        return response.data;
    },
    getById: async (id) => {
        const response = await apiClient.get(`/api/berita/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/api/berita', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.post(`/api/berita/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/api/berita/${id}`);
        return response.data;
    },
};

/**
 * API Service untuk Kriminal
 */
export const kriminalService = {
    getAll: async () => {
        const response = await apiClient.get('/api/kriminal');
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/api/kriminal', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.put(`/api/kriminal/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/api/kriminal/${id}`);
        return response.data;
    },
};

/**
 * API Service untuk DPO
 */
export const dpoService = {
    getAll: async () => {
        const response = await apiClient.get('/api/dpo');
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/api/dpo', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.post(`/api/dpo/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/api/dpo/${id}`);
        return response.data;
    },
};

/**
 * API Service untuk Orang Hilang
 */
export const orangHilangService = {
    getAll: async () => {
        const response = await apiClient.get('/api/orang-hilang');
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/api/orang-hilang', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.post(`/api/orang-hilang/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/api/orang-hilang/${id}`);
        return response.data;
    },
};

/**
 * API Service untuk Peringatan Darurat
 */
export const peringatanDaruratService = {
    getAll: async () => {
        const response = await apiClient.get('/api/peringatan-darurat');
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/api/peringatan-darurat', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.put(`/api/peringatan-darurat/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/api/peringatan-darurat/${id}`);
        return response.data;
    },
};

/**
 * API Service untuk Peraturan
 */
export const peraturanService = {
    getAll: async () => {
        const response = await apiClient.get('/api/peraturan');
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/api/peraturan', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.post(`/api/peraturan/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/api/peraturan/${id}`);
        return response.data;
    },
};

/**
 * API Service untuk Media
 */
export const mediaService = {
    getAll: async () => {
        const response = await apiClient.get('/api/media');
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/api/media', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.post(`/api/media/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/api/media/${id}`);
        return response.data;
    },
};

/**
 * API Service untuk Kantor Polisi
 */
export const kantorPolisiService = {
    getAll: async () => {
        const response = await apiClient.get('/api/kantor-polisi');
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/api/kantor-polisi', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.put(`/api/kantor-polisi/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/api/kantor-polisi/${id}`);
        return response.data;
    },
};

/**
 * API Service untuk Layanan
 */
export const layananService = {
    getAll: async () => {
        const response = await apiClient.get('/api/layanan');
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/api/layanan', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.put(`/api/layanan/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/api/layanan/${id}`);
        return response.data;
    },
};

/**
 * API Service untuk Profil
 */
export const profilService = {
    getAll: async () => {
        const response = await apiClient.get('/api/profil');
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/api/profil', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.post(`/api/profil/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/api/profil/${id}`);
        return response.data;
    },
};

/**
 * API Service untuk Statistik Lalu Lintas
 */
export const statistikLalulintasService = {
    getAll: async () => {
        const response = await apiClient.get('/api/statistik-lalulintas');
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/api/statistik-lalulintas', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.put(`/api/statistik-lalulintas/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/api/statistik-lalulintas/${id}`);
        return response.data;
    },
};

/**
 * API Service untuk Statistik Kriminal
 */
export const statistikKriminalService = {
    getAll: async () => {
        const response = await apiClient.get('/api/statistik-kriminal');
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/api/statistik-kriminal', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.put(`/api/statistik-kriminal/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/api/statistik-kriminal/${id}`);
        return response.data;
    },
};

/**
 * API Service untuk Data Prestasi
 */
export const prestasiService = {
    getAll: async () => {
        const response = await apiClient.get('/api/prestasi');
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/api/prestasi', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.post(`/api/prestasi/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/api/prestasi/${id}`);
        return response.data;
    },
};

/**
 * API Service untuk Data Program
 */
export const programService = {
    getAll: async () => {
        const response = await apiClient.get('/api/programs');
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/api/programs', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.post(`/api/programs/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/api/programs/${id}`);
        return response.data;
    },
};

// Export semua services
export default {
    dashboard: dashboardService,
    kategoriBerita: kategoriBeritaService,
    pejabat: pejabatService,
    berita: beritaService,
    kriminal: kriminalService,
    dpo: dpoService,
    orangHilang: orangHilangService,
    peringatanDarurat: peringatanDaruratService,
    peraturan: peraturanService,
    media: mediaService,
    kantorPolisi: kantorPolisiService,
    layanan: layananService,
    profil: profilService,
    statistikLalulintas: statistikLalulintasService,
    statistikKriminal: statistikKriminalService,
    prestasi: prestasiService,
    program: programService,
};
