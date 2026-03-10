import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

function TransactionsPage() {
  const { isAdmin } = useAuth();
  const [transactions, setTransactions] = useState([]);

  const load = async () => {
    const { data } = await api.get('/transactions');
    setTransactions(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Transactions</h1>
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="grid grid-cols-4 border-b pb-2 text-sm font-semibold text-slate-600">
          <span>Date</span>
          <span>User</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        <div className="space-y-2 pt-2 text-sm">
          {transactions.map((t) => (
            <div key={t.id} className="grid grid-cols-4 rounded bg-slate-50 px-2 py-2">
              <span>{new Date(t.date).toLocaleDateString()}</span>
              <span>{isAdmin ? t.name : 'You'}</span>
              <span>Rs {t.amount}</span>
              <span className="capitalize">{t.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TransactionsPage;
