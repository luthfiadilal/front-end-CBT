import api from './api';

const kriteriaService = {
    // Master Kriteria
    getAllKriteria: async () => {
        const response = await api.get('cbt/kriteria');
        return response.data;
    },
    getKriteriaById: async (id) => {
        const response = await api.get(`cbt/kriteria/${id}`);
        return response.data;
    },
    createKriteria: async (data) => {
        const response = await api.post('cbt/kriteria', data);
        return response.data;
    },
    updateKriteria: async (id, data) => {
        const response = await api.put(`cbt/kriteria/${id}`, data);
        return response.data;
    },
    deleteKriteria: async (id) => {
        const response = await api.delete(`cbt/kriteria/${id}`);
        return response.data;
    },

    // Sub Kriteria: Waktu Pengerjaan
    getAllWaktuPengerjaan: async () => {
        const response = await api.get('cbt/waktu-pengerjaan');
        return response.data;
    },
    createWaktuPengerjaan: async (data) => {
        const response = await api.post('cbt/waktu-pengerjaan', data);
        return response.data;
    },
    updateWaktuPengerjaan: async (id, data) => {
        const response = await api.put(`cbt/waktu-pengerjaan/${id}`, data);
        return response.data;
    },
    deleteWaktuPengerjaan: async (id) => {
        const response = await api.delete(`cbt/waktu-pengerjaan/${id}`);
        return response.data;
    },

    // Sub Kriteria: Tingkat Kesulitan
    getAllTingkatKesulitan: async () => {
        const response = await api.get('cbt/tingkat-kesulitan');
        return response.data;
    },
    createTingkatKesulitan: async (data) => {
        const response = await api.post('cbt/tingkat-kesulitan', data);
        return response.data;
    },
    updateTingkatKesulitan: async (id, data) => {
        const response = await api.put(`cbt/tingkat-kesulitan/${id}`, data);
        return response.data;
    },
    deleteTingkatKesulitan: async (id) => {
        const response = await api.delete(`cbt/tingkat-kesulitan/${id}`);
        return response.data;
    },

    // Sub Kriteria: Konsistensi Jawaban
    getAllKonsistensiJawaban: async () => {
        const response = await api.get('cbt/konsistensi-jawaban');
        return response.data;
    },
    createKonsistensiJawaban: async (data) => {
        const response = await api.post('cbt/konsistensi-jawaban', data);
        return response.data;
    },
    updateKonsistensiJawaban: async (id, data) => {
        const response = await api.put(`cbt/konsistensi-jawaban/${id}`, data);
        return response.data;
    },
    deleteKonsistensiJawaban: async (id) => {
        const response = await api.delete(`cbt/konsistensi-jawaban/${id}`);
        return response.data;
    },

    // Sub Kriteria: Ketepatan Jawaban
    getAllKetepatanJawaban: async () => {
        const response = await api.get('cbt/ketepatan-jawaban');
        return response.data;
    },
    createKetepatanJawaban: async (data) => {
        const response = await api.post('cbt/ketepatan-jawaban', data);
        return response.data;
    },
    updateKetepatanJawaban: async (id, data) => {
        const response = await api.put(`cbt/ketepatan-jawaban/${id}`, data);
        return response.data;
    },
    deleteKetepatanJawaban: async (id) => {
        const response = await api.delete(`cbt/ketepatan-jawaban/${id}`);
        return response.data;
    },
};

export default kriteriaService;
