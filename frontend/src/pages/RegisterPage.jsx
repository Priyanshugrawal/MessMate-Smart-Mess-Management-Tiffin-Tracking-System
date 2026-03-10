import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    room_no: '',
    password: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const { data } = await api.post('/auth/register', form);
      localStorage.setItem('token', data.token);
      setSuccess(true);
      setTimeout(() => {
        navigate(data.user.role === 'admin' ? '/admin' : '/student');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,_#0e7490,_#f8fafc_45%)] px-4 py-8">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
        <p className="mt-1 text-sm text-slate-500">Join MessMate today</p>
        
        {error && <p className="mt-3 rounded bg-rose-50 p-2 text-sm text-rose-600">{error}</p>}
        {success && <p className="mt-3 rounded bg-emerald-50 p-2 text-sm text-emerald-600">Account created! Redirecting...</p>}
        
        <div className="mt-4 space-y-3">
          <input
            required
            type="text"
            placeholder="Full Name"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          />
          <input
            required
            type="tel"
            placeholder="Phone Number"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Room No (optional)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.room_no}
            onChange={(e) => setForm((prev) => ({ ...prev, room_no: e.target.value }))}
          />
          <input
            required
            type="password"
            placeholder="Password (min 6 characters)"
            minLength={6}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          />
          <div>
            <label className="mb-1 block text-sm text-slate-600">Register as:</label>
            <select
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="student">Student</option>
              <option value="admin">Mess Owner / Admin</option>
            </select>
          </div>
          <button className="w-full rounded-lg bg-cyan-700 px-3 py-2 font-semibold text-white hover:bg-cyan-800">
            Create Account
          </button>
        </div>
        
        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-cyan-700 hover:text-cyan-800">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
