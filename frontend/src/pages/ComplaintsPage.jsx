import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

function ComplaintsPage() {
  const { isAdmin } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState('');

  const load = async () => {
    const { data } = await api.get('/complaints');
    setComplaints(data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/complaints', { message });
    setMessage('');
    await load();
  };

  const resolve = async (id) => {
    await api.patch(`/complaints/${id}`, { status: 'resolved' });
    await load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Complaint Box</h1>
      {!isAdmin && (
        <form onSubmit={submit} className="flex gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <input value={message} onChange={(e) => setMessage(e.target.value)} className="flex-1 rounded-lg border p-2" placeholder="Write your complaint..." required />
          <button className="rounded-lg bg-cyan-700 px-4 py-2 text-white">Submit</button>
        </form>
      )}
      <div className="space-y-3">
        {complaints.map((c) => (
          <div key={c.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm">{c.message}</p>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Status: {c.status}</span>
              {isAdmin && c.status !== 'resolved' && (
                <button onClick={() => resolve(c.id)} className="rounded bg-emerald-600 px-2 py-1 text-white">
                  Resolve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComplaintsPage;
