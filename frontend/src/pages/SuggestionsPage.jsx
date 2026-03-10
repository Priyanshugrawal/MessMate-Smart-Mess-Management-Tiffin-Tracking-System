import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

function SuggestionsPage() {
  const { isAdmin } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [suggestion, setSuggestion] = useState('');

  const load = async () => {
    const { data } = await api.get('/suggestions');
    setSuggestions(data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/suggestions', { suggestion });
    setSuggestion('');
    await load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Food Suggestions</h1>
      {!isAdmin && (
        <form onSubmit={submit} className="flex gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <input value={suggestion} onChange={(e) => setSuggestion(e.target.value)} className="flex-1 rounded-lg border p-2" placeholder="Suggest a dish..." required />
          <button className="rounded-lg bg-cyan-700 px-4 py-2 text-white">Add</button>
        </form>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {suggestions.map((item) => (
          <div key={item.suggestion} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="font-semibold">{item.suggestion}</p>
            <p className="text-sm text-slate-500">Requests: {item.requests}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuggestionsPage;
