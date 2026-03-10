import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      const tokenPayload = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
      navigate(tokenPayload.role === 'admin' ? '/admin' : '/student');
    } catch (_err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,_#0e7490,_#f8fafc_45%)] px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">MessMate Login</h1>
        <p className="mt-1 text-sm text-slate-500">Admin / Student access</p>
        {error && <p className="mt-3 rounded bg-rose-50 p-2 text-sm text-rose-600">{error}</p>}
        <div className="mt-4 space-y-3">
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
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          />
          <button className="w-full rounded-lg bg-cyan-700 px-3 py-2 font-semibold text-white hover:bg-cyan-800">Sign In</button>
        </div>
        
        <p className="mt-4 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-cyan-700 hover:text-cyan-800">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
