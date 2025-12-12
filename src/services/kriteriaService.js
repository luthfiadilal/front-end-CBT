import api from './api';

const kriteriaService = {
    // Master Kriteria
    getAllKriteria: async () => {
        const response = await api.get('/kriteria');
        return response.data;
    },
    getKriteriaById: async (id) => {
        const response = await api.get(`/kriteria/${id}`);
        return response.data;
    },
    createKriteria: async (data) => {
        const response = await api.post('/kriteria', data);
        return response.data;
    },
    updateKriteria: async (id, data) => {
        const response = await api.put(`/kriteria/${id}`, data);
        return response.data;
    },
    deleteKriteria: async (id) => {
        const response = await api.delete(`/kriteria/${id}`);
        return response.data;
    },

    // Sub Kriteria: Waktu Pengerjaan
    getAllWaktuPengerjaan: async () => {
        const response = await api.get('/waktu-pengerjaan');
        return response.data;
    },
    createWaktuPengerjaan: async (data) => {
        const response = await api.post('/waktu-pengerjaan', data);
        return response.data;
    },
    updateWaktuPengerjaan: async (id, data) => {
        const response = await api.put(`/waktu-pengerjaan/${id}`, data);
        return response.data;
    },
    deleteWaktuPengerjaan: async (id) => {
        const response = await api.delete(`/waktu-pengerjaan/${id}`);
        return response.data;
    },

    // Sub Kriteria: Tingkat Kesulitan
    getAllTingkatKesulitan: async () => {
        const response = await api.get('/tingkat-kesulitan');
        return response.data;
    },
    createTingkatKesulitan: async (data) => {
        const response = await api.post('/tingkat-kesulitan', data);
        return response.data;
    },
    updateTingkatKesulitan: async (id, data) => {
        const response = await api.put(`/tingkat-kesulitan/${id}`, data);
        return response.data;
    },
    deleteTingkatKesulitan: async (id) => {
        const response = await api.delete(`/tingkat-kesulitan/${id}`);
        return response.data;
    },

    // Sub Kriteria: Konsistensi Jawaban
    getAllKonsistensiJawaban: async () => {
        const response = await api.get('/konsistensi-jawaban');
        return response.data;
    },
    createKonsistensiJawaban: async (data) => {
        const response = await api.post('/konsistensi-jawaban', data);
        return response.data;
    },
    updateKonsistensiJawaban: async (id, data) => {
        const response = await api.put(`/konsistensi-jawaban/${id}`, data);
        return response.data;
    },
    deleteKonsistensiJawaban: async (id) => {
        const response = await api.delete(`/konsistensi-jawaban/${id}`);
        return response.data;
    },

    // Sub Kriteria: Ketepatan Jawaban
    getAllKetepatanJawaban: async () => {
        const response = await api.get('/ketepatan-jawaban');
        return response.data;
    },
    createKetepatanJawaban: async (data) => {
        const response = await api.post('/ketepatan-jawaban', data);
        return response.data;
    },
    updateKetepatanJawaban: async (id, data) => {
        const response = await api.put(`/ketepatan-jawaban/${id}`, data);
        return response.data;
    },
    deleteKetepatanJawaban: async (id) => {
        const response = await api.delete(`/ketepatan-jawaban/${id}`);
        return response.data;
    },
};

export default kriteriaService;
