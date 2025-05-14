'use client';
import AdminDashboardPage from '@/composant/AdminDashboardPage';

import Sidebar from '../login/components/Sidebar';

export default function DashboardPage() {
  return (
   <div className="flex min-h-screen bg-green-50">
             <Sidebar />
             <main className="flex-1 p-6 space-y-8 ml-64 p-6">
             <AdminDashboardPage/>
             
             </main>
           </div>
     );
   }