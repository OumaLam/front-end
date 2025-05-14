"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

export default function LoginPage() {
  const [step, setStep] = useState("login"); // login | otp | forgotPassword | newPassword
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [otp, setOtp] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(0);

  const router = useRouter();

  const getDeviceId = () => Cookies.get('deviceId');
  const CreateDeviceId = () => {
    let deviceId = Cookies.get('deviceId');
    if (!deviceId) {
      deviceId = uuidv4();
      Cookies.set('deviceId', deviceId, { expires: 365 });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const deviceId = getDeviceId();
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, motDePasse, fonction: role, deviceId },
        { withCredentials: true }
      );

      const { message } = response.data;
      if (message.includes("Connexion sans OTP")) {
        router.push('/');
      } else {
        setMessage("✅ " + message);
        setStep("otp");
      }
    } catch (err) {
      setMessage("Erreur : " + (err.response?.data || "Erreur serveur"));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/verifier-otp",
        { email, otp },
        { withCredentials: true }
      );
      setMessage("✅ Connexion réussie");
      CreateDeviceId();
      router.push('/');
    } catch (err) {
      const errorMsg = err.response?.data || "Erreur serveur";
      setMessage("Erreur OTP : " + errorMsg);
      if (errorMsg.includes("expiré")) setCanResend(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/resend-otp",
        { email },
        { withCredentials: true }
      );
      setMessage("✅ " + res.data);
      setCanResend(false);
      setTimer(120);
      CreateDeviceId();
    } catch (err) {
      setMessage("❌ " + (err.response?.data || "Erreur serveur"));
    }
  };

  const handleForgotPasswordRequest = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/mot-de-passe-oublie", { email });
      setMessage("✅ Code envoyé à votre email.");
      setStep("newPassword");
      setTimer(120);
      setCanResend(false);
    } catch (err) {
      setMessage("❌ " + (err.response?.data || "Erreur serveur"));
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/nouveau-mot-de-passe", {
        email,
        otp: resetOtp,
        newPassword
      });
      setMessage("✅ Mot de passe réinitialisé avec succès.");
      setStep("login");
      CreateDeviceId();
      
    } catch (err) {
      setMessage("❌ " + (err.response?.data || "Erreur serveur"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (step === "otp") {
      setCanResend(true);
    }
  }, [timer, step]);

  useEffect(() => {
    if (step === "otp") {
      setTimer(120);
      setCanResend(false);
    }
  }, [step]);

  const roles = [
    { label: 'Admin', value: 'Admin' },
    { label: 'Vétérinaire', value: 'Veterinaire' },
    { label: 'Gestionnaire', value: 'Gestionnaire' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden w-full max-w-5xl">
        <div className="md:w-1/2 bg-green-100 p-6 flex flex-col justify-center items-center">
          <img src="/logo-ranch.png" alt="logo" className="w-24 md:w-32 mb-4" />
          <img src="/vaches-illustration.png" alt="illustration" className="w-full object-contain" />
        </div>

        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
            {step === "login" && "Connexion"}
            {step === "otp" && "Vérification OTP"}
            {step === "forgotPassword" && "Mot de passe oublié"}
            {step === "newPassword" && "Nouveau mot de passe"}
          </h2>

          {/* Formulaire Connexion */}
          {step === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-3 rounded-xl" required />
              <input type="password" placeholder="Mot de passe" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} className="w-full border p-3 rounded-xl" required />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {roles.map((r) => (
                  <div key={r.value} onClick={() => setRole(r.value)} className={`cursor-pointer rounded-xl border p-4 text-center ${role === r.value ? 'bg-green-600 text-white border-green-600' : 'hover:shadow border-gray-300'}`}>
                    {r.label}
                  </div>
                ))}
              </div>

              <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 text-white py-3 rounded-xl shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Chargement..." : "Se connecter"}
              </button>

              <p onClick={() => setStep("forgotPassword")} className="text-sm text-blue-600 hover:underline cursor-pointer text-center mt-2">Mot de passe oublié ?</p>
            </form>
          )}

          {/* Formulaire OTP */}
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <input type="text" placeholder="Code OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full border p-3 rounded-xl" required />
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl shadow">✅ Vérifier le code</button>

              {timer > 0 && (
                <div className="text-center mt-4 p-2 rounded-xl text-yellow-700">Vous pouvez renvoyer le code dans {timer} secondes.</div>
              )}
              {canResend && timer === 0 && (
                <button type="button" onClick={handleResendOtp} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-xl shadow mt-4">🔄 Renvoyer le code</button>
              )}
            </form>
          )}

          {/* Formulaire Email - Mot de passe oublié */}
          {step === "forgotPassword" && (
            <div className="space-y-4">
              <input type="email" placeholder="Entrez votre email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-3 rounded-xl" required />
              <button onClick={handleForgotPasswordRequest} className="w-full bg-blue-600 text-white py-3 rounded-xl">📩 Envoyer le code OTP</button>
              <p onClick={() => setStep("login")} className="text-sm text-gray-500 hover:underline cursor-pointer text-center mt-2">← Retour à la connexion</p>
            </div>
          )}

          {/* Formulaire Nouveau mot de passe */}
          {step === "newPassword" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <input type="text" placeholder="Code OTP" value={resetOtp} onChange={(e) => setResetOtp(e.target.value)} className="w-full border p-3 rounded-xl" required />
              <input type="password" placeholder="Nouveau mot de passe" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border p-3 rounded-xl" required />
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl shadow">🔒 Réinitialiser le mot de passe</button>
            </form>
          )}

          {/* Affichage message */}
          {message && (
            <div className={`mt-4 text-sm text-center px-4 py-2 transition-all duration-300 ${message.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
