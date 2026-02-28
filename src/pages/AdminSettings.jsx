import React, { useState, useEffect } from 'react';
import api from '../api';
import { toMediaUrl } from '../utils/uploads';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        siteTitle: '',
        logoUrl: '',
        bannerImage: '',
        themeColor: '#D4AF37',
        defaultLanguage: 'en',
        bankAccounts: [
            { bankName: 'CBE', accountNumber: '' },
            { bankName: 'Sidama Bank', accountNumber: '' },
        ],
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const { data } = await api.get('/api/config');
                const incomingAccounts = Array.isArray(data?.bankAccounts)
                    ? data.bankAccounts.filter((item) => item?.bankName || item?.accountNumber)
                    : [];
                setSettings((prev) => ({
                    ...prev,
                    ...data,
                    bankAccounts: incomingAccounts.length ? incomingAccounts : prev.bankAccounts,
                }));
            } catch (error) {
                console.error('Error fetching config:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleBankAccountChange = (idx, key, value) => {
        setSettings((prev) => ({
            ...prev,
            bankAccounts: prev.bankAccounts.map((account, i) =>
                i === idx ? { ...account, [key]: value } : account
            ),
        }));
    };

    const addBankAccount = () => {
        setSettings((prev) => ({
            ...prev,
            bankAccounts: [...prev.bankAccounts, { bankName: '', accountNumber: '' }],
        }));
    };

    const removeBankAccount = (idx) => {
        setSettings((prev) => ({
            ...prev,
            bankAccounts: prev.bankAccounts.filter((_, i) => i !== idx),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const bankAccounts = (settings.bankAccounts || [])
                .map((account) => ({
                    bankName: String(account?.bankName || '').trim(),
                    accountNumber: String(account?.accountNumber || '').trim(),
                }))
                .filter((account) => account.bankName && account.accountNumber);
            await api.put('/api/config', { ...settings, bankAccounts });
            alert('Settings saved successfully');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-gold-500">Loading settings...</div>;
    }

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-8 text-gold-500">Site Settings</h1>

            <div className="card">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 mb-2">Site Title</label>
                        <input type="text" name="siteTitle" value={settings.siteTitle} onChange={handleChange} className="input-field" />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Logo URL</label>
                        <input type="text" name="logoUrl" value={settings.logoUrl} onChange={handleChange} className="input-field" placeholder="https://..." />
                        {settings.logoUrl && <img src={toMediaUrl(settings.logoUrl)} alt="Logo preview" className="h-14 mt-3 object-contain bg-white rounded p-1" />}
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Banner Image URL</label>
                        <input type="text" name="bannerImage" value={settings.bannerImage || ''} onChange={handleChange} className="input-field" placeholder="https://..." />
                        {settings.bannerImage && <img src={toMediaUrl(settings.bannerImage)} alt="Banner preview" className="h-32 mt-3 w-full object-cover rounded" />}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-gray-300">Bank Transfer Accounts</label>
                            <button type="button" onClick={addBankAccount} className="text-xs bg-dark-700 px-3 py-2 rounded hover:bg-dark-600">
                                Add Account
                            </button>
                        </div>
                        <div className="space-y-3">
                            {(settings.bankAccounts || []).map((account, idx) => (
                                <div key={`${idx}-${account.bankName || 'bank'}`} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3 rounded border border-dark-700">
                                    <input
                                        type="text"
                                        value={account.bankName || ''}
                                        onChange={(e) => handleBankAccountChange(idx, 'bankName', e.target.value)}
                                        placeholder="Bank name"
                                        className="input-field md:col-span-2"
                                    />
                                    <input
                                        type="text"
                                        value={account.accountNumber || ''}
                                        onChange={(e) => handleBankAccountChange(idx, 'accountNumber', e.target.value)}
                                        placeholder="Account number"
                                        className="input-field md:col-span-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeBankAccount(idx)}
                                        className="text-xs px-3 py-2 rounded bg-red-900/40 hover:bg-red-900/60 text-red-200"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Only rows with both bank name and account number are saved.</p>
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Default Language</label>
                        <select name="defaultLanguage" value={settings.defaultLanguage || 'en'} onChange={handleChange} className="input-field">
                            <option value="en">English</option>
                            <option value="am">Amharic</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Primary Theme Color</label>
                        <div className="flex items-center gap-4">
                            <input type="color" name="themeColor" value={settings.themeColor} onChange={handleChange} className="bg-transparent border-0 w-12 h-12 p-0 cursor-pointer" />
                            <span className="text-gray-400">{settings.themeColor}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-dark-700">
                        <button type="submit" disabled={saving} className="btn-primary w-full md:w-auto disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save Configuration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminSettings;
