import { useEffect, useState } from 'react';
import api from '../api/client';

function RatingsPage() {
  const [summary, setSummary] = useState([]);
  const [form, setForm] = useState({ meal_id: 1, taste: 5, quantity: 5, quality: 5 });

  const load = async () => {
    const { data } = await api.get('/ratings');
    setSummary(data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/ratings', form);
    await load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Food Ratings</h1>
      <form onSubmit={submit} className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:grid-cols-5">
        <input type="number" min="1" value={form.meal_id} onChange={(e) => setForm({ ...form, meal_id: Number(e.target.value) })} className="rounded-lg border p-2" />
        <input type="number" min="1" max="5" value={form.taste} onChange={(e) => setForm({ ...form, taste: Number(e.target.value) })} className="rounded-lg border p-2" />
        <input type="number" min="1" max="5" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} className="rounded-lg border p-2" />
        <input type="number" min="1" max="5" value={form.quality} onChange={(e) => setForm({ ...form, quality: Number(e.target.value) })} className="rounded-lg border p-2" />
        <button className="rounded-lg bg-cyan-700 p-2 text-white">Submit</button>
      </form>
      <div className="space-y-2">
        {summary.map((item) => (
          <div key={item.meal_id} className="rounded bg-white p-3 text-sm shadow-sm ring-1 ring-slate-200">
            Meal #{item.meal_id} | Taste: {item.avg_taste} | Quantity: {item.avg_quantity} | Quality: {item.avg_quality}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RatingsPage;
