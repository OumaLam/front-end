// DashboardLayout.jsx
import { FaHome, FaUsers, FaLock, FaUserShield, FaCogs, FaHeadset, FaSignOutAlt } from "react-icons/fa";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-green-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2d775c] text-white flex flex-col p-4 space-y-6">
        <h1 className="text-2xl font-bold">M - SoftTech</h1>
        <nav className="flex-1 space-y-4">
          <NavItem icon={<FaHome />} label="Home" />
          <NavItem icon={<FaUsers />} label="User Control" />
          <NavItem icon={<FaLock />} label="Access Request" />
          <NavItem icon={<FaUserShield />} label="Admin" />
          <NavItem icon={<FaCogs />} label="Settings" />
          <NavItem icon={<FaHeadset />} label="Support" />
        </nav>
        <NavItem icon={<FaSignOutAlt />} label="Quit" />
        <div className="mt-8 text-center">
          <img src="/agent.png" alt="Support" className="mx-auto w-24" />
          <p className="text-sm mt-2">24/7 Support</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

function NavItem({ icon, label }) {
  return (
    <a href="#" className="flex items-center space-x-3 hover:bg-white hover:text-[#2d775c] px-4 py-2 rounded-lg transition">
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </a>
  );
}
