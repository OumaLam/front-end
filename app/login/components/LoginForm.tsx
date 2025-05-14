// app/login/components/LoginForm.jsx
"use client";
export default function LoginForm({ email, setEmail, motDePasse, setMotDePasse, role, setRole, handleSubmit, loading }) {
  const roles = [
    { label: 'Admin', value: 'Admin' },
    { label: 'Vétérinaire', value: 'Veterinaire' },
    { label: 'Gestionnaire', value: 'Gestionnaire' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
        className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {roles.map((r) => (
          <div
            key={r.value}
            onClick={() => setRole(r.value)}
            className={`cursor-pointer rounded-xl border p-4 text-center transition-all duration-300 
              ${role === r.value
                ? 'bg-green-600 text-white shadow-lg scale-105 border-green-600'
                : 'hover:shadow border-gray-300 hover:scale-105'}`}
          >
            {r.label}
          </div>
        ))}
      </div>
      <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg">
        {loading ? "Chargement..." : "Se connecter"}
      </button>
    </form>
  );
}
