import api from '../api';

const rawApiBase = import.meta.env.VITE_API_URL || '';
const normalizedApiBase = rawApiBase.replace(/\/+$/, '');
const configuredOrigin = normalizedApiBase.replace(/\/api$/, '');

const runtimeOrigin = (() => {
    if (typeof window === 'undefined') return '';
    const host = window.location.hostname || 'localhost';
    const protocol = window.location.protocol || 'http:';
    if (window.location.port === '5173') {
        return `${protocol}//${host}:5000`;
    }
    return window.location.origin;
})();

const apiOrigin = configuredOrigin || runtimeOrigin;

export const toMediaUrl = (url) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith('/')) return `${apiOrigin}${url}`;
    return `${apiOrigin}/${url}`;
};

const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });

export const uploadFile = async (file, folder) => {
    if (!file) throw new Error('No file selected');
    const dataUrl = await fileToDataUrl(file);
    const { data } = await api.post('/api/uploads', {
        folder,
        filename: file.name,
        dataUrl,
    });
    return data;
};
