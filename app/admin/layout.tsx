// app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, Bell, Search, LogOut, Menu, Sun, Moon } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/admin/login');
    };
    checkAuth();
  }, [router]);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Quản lý Sản phẩm", href: "/admin/products", icon: Package },
    { name: "Quản lý Đơn hàng", href: "/admin/orders", icon: ShoppingCart },
    { name: "Khách hàng", href: "/admin/customers", icon: Users },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col`}>
        <div className="px-6 py-8 flex items-center gap-3 border-b">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">S</div>
          {sidebarOpen && <span className="font-semibold text-2xl tracking-tight">ShopAdmin</span>}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3.5 px-5 py-4 rounded-2xl text-[15px] font-medium transition-all ${isActive ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                <item.icon size={22} />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white dark:bg-gray-900 border-b px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
              <Menu size={24} />
            </button>
            <div className="relative w-96">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input type="text" placeholder="Tìm kiếm..." className="w-full bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-gray-300 pl-11 py-3 rounded-2xl text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl">
              {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l">
              <div>
                <p className="font-medium text-sm">Admin</p>
                <p className="text-xs text-gray-500">Quản trị viên</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-semibold">A</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 bg-gray-50 dark:bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  );
}