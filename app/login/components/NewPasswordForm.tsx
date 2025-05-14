"use client";
export default function NewPasswordForm({ password, setPassword, confirmPassword, setConfirmPassword, handleSubmit, loading }) {
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="password"
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full border p-3 rounded-xl"
        required
      />
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl" disabled={loading}>
        {loading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
      </button>
    </form>
  );
}
