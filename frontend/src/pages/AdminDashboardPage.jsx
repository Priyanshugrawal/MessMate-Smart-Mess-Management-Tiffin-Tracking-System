import { useEffect, useState } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../api/client';
import StatCard from '../components/StatCard';

function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [analytics, setAnalytics] = useState({ demandStats: [], revenueStats: [] });

  useEffect(() => {
    const load = async () => {
      const [mRes, aRes] = await Promise.all([api.get('/admin/dashboard'), api.get('/admin/analytics')]);
      setMetrics(mRes.data);
      setAnalytics(aRes.data);
    };
    load();
  }, []);

  if (!metrics) return <p>Loading dashboard...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={metrics.totalStudents} />
        <StatCard title="Meals Prepared Today" value={metrics.mealsPrepared} />
        <StatCard title="Skipped Meals" value={metrics.skippedMeals} />
        <StatCard title="Total Revenue" value={`Rs ${metrics.totalRevenue}`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-3 font-semibold">Food Demand (Skipped Meals)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analytics.demandStats.slice(-10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="skipped" fill="#0e7490" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-3 font-semibold">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={analytics.revenueStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="amount" stroke="#0369a1" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
