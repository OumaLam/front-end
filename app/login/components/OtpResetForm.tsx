"use client";
export default function OtpResetForm({ otp, setOtp, handleSubmit, loading }) {
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="text"
        placeholder="Code OTP reçu"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl" disabled={loading}>
        {loading ? "Vérification..." : "Vérifier le code"}
      </button>
    </form>
  );
}
