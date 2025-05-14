"use client";
export default function ForgotPasswordForm({ email, setEmail, handleSubmit, loading }) {
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="email"
        placeholder="Entrez votre email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl" disabled={loading}>
        {loading ? "Envoi..." : "Recevoir un code OTP"}
      </button>
    </form>
  );
}
