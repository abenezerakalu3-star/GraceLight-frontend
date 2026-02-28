import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import api from '../api';

const Give = () => {
    const [loading, setLoading] = useState(false);
    const [accountsLoading, setAccountsLoading] = useState(true);

    const [amount, setAmount] = useState('');
    const [type, setType] = useState('offering');
    const [donorName, setDonorName] = useState('');
    const [email, setEmail] = useState('');
    const [bankAccounts, setBankAccounts] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [refNo, setRefNo] = useState('');
    const [message, setMessage] = useState('');

    const parsedAmount = useMemo(() => Number(amount), [amount]);

    const isValidAmount = Number.isFinite(parsedAmount) && parsedAmount > 0;

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const { data } = await api.get('/api/config');
                const accounts = Array.isArray(data?.bankAccounts)
                    ? data.bankAccounts.filter((account) => account?.bankName && account?.accountNumber)
                    : [];
                setBankAccounts(accounts);
                if (accounts.length) {
                    setPaymentMethod(`${accounts[0].bankName} Bank Transfer`);
                }
            } catch (_error) {
                setBankAccounts([]);
                setPaymentMethod('');
            } finally {
                setAccountsLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleManualSubmit = async (e) => {
        e.preventDefault();

        if (!isValidAmount) {
            setMessage('Please enter a valid donation amount.');
            return;
        }

        if (!paymentMethod.trim()) {
            setMessage('Please select a bank transfer method.');
            return;
        }

        if (!refNo.trim()) {
            setMessage('Transaction reference is required for bank transfer verification.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await api.post('/api/payment/manual-record', {
                amount: parsedAmount,
                type,
                donorName,
                email,
                transactionId: refNo,
                paymentMethod,
            });
            setMessage('Thank you. Your transfer has been submitted for verification.');
            setRefNo('');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error submitting transfer record.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 min-h-screen text-white">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-gold-500 mb-2">Giving & Tithes</h1>
                <p className="text-gray-400">Submit your bank transfer details for verification.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-dark-800 p-6 rounded-2xl border border-gray-700">
                        <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Gift Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-dark-900 border border-gray-600 rounded-lg p-3 text-gold-500 font-bold focus:border-gold-500 outline-none"
                        >
                            <option value="offering">General Offering</option>
                            <option value="tithe">Tithe (10%)</option>
                            <option value="project">Church Project</option>
                        </select>

                        <div className="mt-6">
                            <label className="block text-gray-400 text-sm mb-2 font-bold uppercase">Amount (ETB)</label>
                            <input
                                type="number"
                                min="1"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-dark-900 border border-gray-600 rounded-lg p-4 text-2xl font-mono focus:ring-2 focus:ring-gold-500 outline-none"
                            />
                        </div>

                        <div className="mt-4 space-y-3">
                            <input
                                type="text"
                                value={donorName}
                                onChange={(e) => setDonorName(e.target.value)}
                                placeholder="Full Name (Optional)"
                                className="w-full bg-dark-900 border border-gray-600 rounded-lg p-3"
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email (Optional)"
                                className="w-full bg-dark-900 border border-gray-600 rounded-lg p-3"
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {accountsLoading ? (
                            <div className="bg-dark-800 p-8 rounded-2xl border border-gray-700 text-gray-400">Loading bank accounts...</div>
                        ) : bankAccounts.length === 0 ? (
                            <div className="bg-dark-800 p-8 rounded-2xl border border-red-500/30 text-red-200">
                                No bank account is configured yet. Please ask an admin to add bank transfer account details.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {bankAccounts.map((account) => (
                                    <BankCard key={`${account.bankName}-${account.accountNumber}`} bank={account.bankName} acc={account.accountNumber} />
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleManualSubmit} className="bg-dark-800 p-8 rounded-2xl border border-gold-500/30">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <FaCheckCircle className="text-gold-500" /> Confirm Your Transfer
                            </h3>
                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Payment Method</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="bg-dark-900 border border-gray-600 p-3 rounded-lg w-full mb-4 text-gold-500 font-bold"
                            >
                                {bankAccounts.length === 0 ? (
                                    <option value="">No account available</option>
                                ) : (
                                    bankAccounts.map((account) => {
                                        const label = `${account.bankName} Bank Transfer`;
                                        return (
                                            <option key={label} value={label}>{label}</option>
                                        );
                                    })
                                )}
                            </select>
                            <input
                                required
                                type="text"
                                value={refNo}
                                placeholder="Transaction Reference #"
                                className="bg-dark-900 border border-gray-600 p-3 rounded-lg w-full mb-4"
                                onChange={(e) => setRefNo(e.target.value)}
                            />
                            <button disabled={loading || bankAccounts.length === 0} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors w-full disabled:opacity-50">
                                {loading ? 'Submitting...' : 'Submit for Verification'}
                            </button>
                        </form>
                    </motion.div>

                    {message && <p className="mt-4 text-sm text-gold-500">{message}</p>}
                </div>
            </div>
        </div>
    );
};

const BankCard = ({ bank, acc }) => (
    <div className="p-5 rounded-xl border border-gray-700 bg-dark-800 hover:border-gold-500 transition-colors">
        <p className="text-gold-500 font-bold text-xs uppercase">{bank}</p>
        <p className="text-xl font-mono mt-1">{acc}</p>
        <button
            onClick={() => {
                navigator.clipboard.writeText(acc);
                alert('Copied account number');
            }}
            className="mt-3 text-xs bg-dark-700 px-3 py-1 rounded hover:bg-gold-500 hover:text-black transition-all"
        >
            Copy
        </button>
    </div>
);

export default Give;
