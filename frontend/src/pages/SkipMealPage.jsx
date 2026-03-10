import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import api from '../api/client';

function SkipMealPage() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    skipFrom: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    skipTo: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    meal_type: 'lunch',
  });
  const [message, setMessage] = useState('');

  const load = async () => {
    const { data } = await api.get('/skip-meals');
    setRecords(data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const { data } = await api.post('/skip-meals', form);
      setMessage(`${data.message}. ${data.count} day(s) updated.`);
      await load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not skip meal');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Skip Meal</h1>
      <p className="text-sm text-slate-600">Rule: Skip at least 3 hours before meal time.</p>
      <form onSubmit={submit} className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:grid-cols-4">
        <input type="date" value={form.skipFrom} onChange={(e) => setForm({ ...form, skipFrom: e.target.value })} className="rounded-lg border p-2" />
        <input type="date" value={form.skipTo} onChange={(e) => setForm({ ...form, skipTo: e.target.value })} className="rounded-lg border p-2" />
        <select value={form.meal_type} onChange={(e) => setForm({ ...form, meal_type: e.target.value })} className="rounded-lg border p-2">
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
        <button className="rounded-lg bg-cyan-700 p-2 font-semibold text-white">Submit</button>
      </form>
      {message && <p className="text-sm text-cyan-700">{message}</p>}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-2 font-semibold">Skip History</h2>
        <div className="space-y-2 text-sm">
          {records.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded bg-slate-50 px-3 py-2">
              <span>{r.date}</span>
              <span className="capitalize">{r.meal_type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SkipMealPage;
