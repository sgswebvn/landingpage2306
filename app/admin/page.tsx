// app/admin/page.tsx
import { createClient } from "@/lib/supabase";

export default async function AdminDashboard() {
  const supabase = createClient();

  const [pRes, oRes] = await Promise.all([
    supabase.from("products").select("id", { count: "exact" }),
    supabase.from("orders").select("id", { count: "exact" }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl">
          <p className="text-gray-500">Tổng sản phẩm</p>
          <p className="text-5xl font-bold mt-4">{pRes.count || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl">
          <p className="text-gray-500">Tổng đơn hàng</p>
          <p className="text-5xl font-bold mt-4 text-blue-600">{oRes.count || 0}</p>
        </div>
      </div>
    </div>
  );
}