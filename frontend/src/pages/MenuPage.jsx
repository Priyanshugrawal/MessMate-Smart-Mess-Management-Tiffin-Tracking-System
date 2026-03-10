import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

function MenuPage() {
  const { isAdmin } = useAuth();
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({ date: dayjs().format('YYYY-MM-DD'), breakfast: '', lunch: '', dinner: '', image_url: '' });

  const loadMenus = async () => {
    const { data } = await api.get('/menu');
    setMenus(data);
  };

  useEffect(() => {
    loadMenus();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/menu', form);
    await loadMenus();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Menu Management</h1>
      {isAdmin && (
        <form onSubmit={submit} className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:grid-cols-5">
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-lg border p-2" />
          <input placeholder="Breakfast" value={form.breakfast} onChange={(e) => setForm({ ...form, breakfast: e.target.value })} className="rounded-lg border p-2" />
          <input placeholder="Lunch" value={form.lunch} onChange={(e) => setForm({ ...form, lunch: e.target.value })} className="rounded-lg border p-2" />
          <input placeholder="Dinner" value={form.dinner} onChange={(e) => setForm({ ...form, dinner: e.target.value })} className="rounded-lg border p-2" />
          <button className="rounded-lg bg-cyan-700 p-2 font-semibold text-white">Save</button>
        </form>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {menus.map((menu) => (
          <div key={menu.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="font-semibold">{menu.date}</p>
            <p className="text-sm text-slate-600">Breakfast: {menu.breakfast}</p>
            <p className="text-sm text-slate-600">Lunch: {menu.lunch}</p>
            <p className="text-sm text-slate-600">Dinner: {menu.dinner}</p>
            {menu.image_url && <img src={`${import.meta.env.VITE_API_ORIGIN || 'http://localhost:5000'}${menu.image_url}`} alt="Meal" className="mt-3 h-40 w-full rounded-lg object-cover" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuPage;
