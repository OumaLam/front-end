// app/login/components/OtpForm.jsx
"use client";
export default function OtpForm({ otp, setOtp, handleSubmit, canResend, handleResendOtp, resendMessage, loading }) {
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="text"
        placeholder="Code OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />
      <button type="submit"
        className="w-full bg-green-600 hover:bg-green-700 transition duration-300 text-white font-medium py-3 rounded-xl text-lg shadow-md hover:shadow-lg"
        disabled={loading}
      >
        ✅ Vérifier le code
      </button>

      {canResend && (
        <button
          type="button"
          onClick={handleResendOtp}
          className="w-full bg-yellow-500 hover:bg-yellow-600 transition duration-300 text-white font-medium py-2 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          🔄 Renvoyer le code
        </button>
      )}

      {resendMessage && (
        <p className="text-sm text-center mt-2 text-gray-700 italic">{resendMessage}</p>
      )}
    </form>
  );
}
