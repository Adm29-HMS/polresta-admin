import React from 'react';

const PagePlaceholder = ({ title }) => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-heading font-bold text-gray-900">{title}</h1>
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                + Tambah Data
            </button>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 min-h-[500px] flex items-center justify-center flex-col gap-4">
            <div className="text-gray-300 text-6xl">🚧</div>
            <p className="text-gray-500 font-medium">Halaman {title} sedang dalam pengembangan</p>
        </div>
    </div>
);

export const MediaGallery = () => <PagePlaceholder title="Media Gallery" />;
export const DataPejabat = () => <PagePlaceholder title="Data Pejabat" />;
export const DataBerita = () => <PagePlaceholder title="Data Berita" />;
export const DataKriminal = () => <PagePlaceholder title="Data Kriminal" />;
export const DataDPO = () => <PagePlaceholder title="Data DPO" />;
export const PeringatanDarurat = () => <PagePlaceholder title="Peringatan Darurat" />;
export const Peraturan = () => <PagePlaceholder title="Data Peraturan" />;
