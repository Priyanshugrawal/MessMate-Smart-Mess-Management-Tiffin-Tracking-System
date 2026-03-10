import { useEffect, useState } from 'react';
import api from '../api/client';
import StatCard from '../components/StatCard';

function StudentDashboardPage() {
  const [menu, setMenu] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [menuRes, txRes, cRes] = await Promise.all([
        api.get('/menu/today'),
        api.get('/transactions'),
        api.get('/complaints'),
      ]);
      setMenu(menuRes.data);
      setTransactions(txRes.data.slice(0, 3));
      setComplaints(cRes.data.slice(0, 3));
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Student Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Today's Breakfast" value={menu?.breakfast || 'Not set'} />
        <StatCard title="Today's Lunch" value={menu?.lunch || 'Not set'} />
        <StatCard title="Today's Dinner" value={menu?.dinner || 'Not set'} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-2 font-semibold">Recent Transactions</h2>
          <div className="space-y-2 text-sm">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded bg-slate-50 px-3 py-2">
                <span>{new Date(t.date).toLocaleDateString()}</span>
                <span>Rs {t.amount}</span>
                <span className="capitalize">{t.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-2 font-semibold">Recent Complaints</h2>
          <div className="space-y-2 text-sm">
            {complaints.map((c) => (
              <div key={c.id} className="rounded bg-slate-50 px-3 py-2">
                <p>{c.message}</p>
                <p className="mt-1 text-xs text-slate-500">Status: {c.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboardPage;
