import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../api/client';
import MapTracker from '../components/MapTracker';
import { useAuth } from '../context/AuthContext';

function DeliveryPage() {
  const { isAdmin } = useAuth();
  const [delivery, setDelivery] = useState(null);
  const [form, setForm] = useState({ delivery_person: '', latitude: 22.7196, longitude: 75.8577, status: 'assigned' });

  const socket = useMemo(() => {
    const token = localStorage.getItem('token');
    return io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', { auth: { token } });
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/delivery/latest');
      setDelivery(data);
    };
    load();

    socket.on('deliveryUpdate', (payload) => setDelivery(payload));
    return () => {
      socket.off('deliveryUpdate');
      socket.disconnect();
    };
  }, [socket]);

  const update = async (e) => {
    e.preventDefault();
    await api.post('/delivery/update', form);
    socket.emit('deliveryLocation', form);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Delivery Tracking</h1>
      {isAdmin && (
        <form onSubmit={update} className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:grid-cols-5">
          <input placeholder="Delivery Person" value={form.delivery_person} onChange={(e) => setForm({ ...form, delivery_person: e.target.value })} className="rounded-lg border p-2" />
          <input placeholder="Latitude" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })} className="rounded-lg border p-2" />
          <input placeholder="Longitude" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })} className="rounded-lg border p-2" />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-lg border p-2">
            <option value="assigned">Assigned</option>
            <option value="on_the_way">On The Way</option>
            <option value="delivered">Delivered</option>
          </select>
          <button className="rounded-lg bg-cyan-700 p-2 font-semibold text-white">Update</button>
        </form>
      )}
      <MapTracker latitude={delivery?.latitude} longitude={delivery?.longitude} />
      {delivery && (
        <div className="rounded-2xl bg-white p-4 text-sm shadow-sm ring-1 ring-slate-200">
          <p>Delivery Person: {delivery.delivery_person}</p>
          <p>Status: {delivery.status}</p>
        </div>
      )}
    </div>
  );
}

export default DeliveryPage;
