"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaHome, FaSyringe, FaSignOutAlt } from "react-icons/fa";
import { GiCow } from "react-icons/gi";
import { useRouter } from "next/navigation";
import axios from "axios";

const menuItems = [
  { icon: <FaHome />, label: "Accueil", href: "/dashboard-admin" },
  { icon: <GiCow />, label: "Animaux", href: "/dashboard-admin/animal" },
  { icon: <FaSyringe />, label: "Vaccination", href: "/dashboard-admin/Vaccination" },
];

export default function DashboardLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/logout", {}, {
        withCredentials: true
      });
      router.push("/login");
    } catch (error) {
      console.error("Erreur de déconnexion", error);
    }
  };

  return (
    <div className="fixed w-64 flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed md:relative z-40 top-0 left-0 w-64 bg-[#2d775c] text-white flex flex-col justify-between p-4">
        <div>
          {/* Logo */}
          <div className="flex items-center space-x-3 bg-green-50 rounded-xl p-3 mb-6">
            <img src="/favicon.ico" alt="Logo" className="w-10 h-10" />
            <span className="font-bold text-[#2d775c] text-sm">Ranche Adarouch</span>
          </div>

          {/* Menu */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`w-64 flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-green-50 text-[#2d775c]"
                    : "hover:bg-green-50 hover:text-[#2d775c]"
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Footer - Logout */}
        <div className="space-y-6">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center px-10 py-2 rounded-xl hover:bg-green-50 hover:text-[#2d775c] transition"
          >
            <FaSignOutAlt className="text-lg mr-3" />
            <span className="text-sm font-medium">Quitter</span>
          </button>
        </div>
      </aside>

      {/* 🔒 Modal de confirmation */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirmer la déconnexion</h2>
            <p className="text-sm text-gray-600 mb-6">Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
