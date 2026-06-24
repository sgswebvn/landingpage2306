// app/admin/page.tsx
import { createClient } from '@supabase/supabase-js';
import { ShoppingBag, TrendingUp, Users, DollarSign, ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";

type Order = {
  id: string;
  name: string;
  phone: string;
  product: string;
  price: number;
  quantity: number;
  status: string;
  created_at: string;
};

export default async function AdminDashboard() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch count of products
  const { count: productsCount } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true });

  // Fetch all orders to compute aggregate metrics
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const ordersList: Order[] = orders || [];
  
  // Computations
  const totalOrders = ordersList.length;
  const completedOrders = ordersList.filter(o => o.status === "completed");
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.price * o.quantity), 0);
  
  const uniqueCustomerPhones = new Set(ordersList.map(o => o.phone));
  const totalCustomers = uniqueCustomerPhones.size;

  const recentOrders = ordersList.slice(0, 5);

  const stats = [
    { name: "Tổng Doanh Thu", value: `${totalRevenue.toLocaleString('vi-VN')}đ`, icon: DollarSign, color: "text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400" },
    { name: "Đơn Hàng Thành Công", value: completedOrders.length, icon: TrendingUp, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400" },
    { name: "Sản Phẩm Trưng Bày", value: productsCount || 0, icon: ShoppingBag, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400" },
    { name: "Tổng Số Khách Hàng", value: totalCustomers, icon: Users, color: "text-orange-600 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-400" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Tổng quan quản trị</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Dưới đây là thống kê tình hình kinh doanh của shop.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 p-6 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between hover:shadow-md transition duration-300">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-[28px] border border-gray-100 dark:border-gray-800 p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Đơn hàng mới nhận</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
              Xem tất cả <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-sm font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-4">Khách hàng</th>
                  <th className="pb-4">Mặt hàng</th>
                  <th className="pb-4 text-right">Tổng tiền</th>
                  <th className="pb-4 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                      <td className="py-4">
                        <p className="font-bold text-gray-900 dark:text-white">{order.name}</p>
                        <p className="text-xs text-gray-400">{order.phone}</p>
                      </td>
                      <td className="py-4">
                        <p className="text-gray-700 dark:text-gray-300 line-clamp-1">{order.product}</p>
                      </td>
                      <td className="py-4 text-right font-extrabold text-gray-900 dark:text-white">
                        {(order.price * order.quantity).toLocaleString('vi-VN')}đ
                      </td>
                      <td className="py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          order.status === "completed" ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" :
                          order.status === "processing" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400" :
                          order.status === "cancelled" ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400" :
                          "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">Chưa có đơn hàng nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links / Overview info */}
        <div className="bg-white dark:bg-gray-900 rounded-[28px] border border-gray-100 dark:border-gray-800 p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold">Thao tác nhanh</h2>
          <div className="space-y-4">
            <Link 
              href="/admin/products/new" 
              className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-black dark:hover:border-white transition group"
            >
              <div>
                <p className="font-bold">Đăng sản phẩm mới</p>
                <p className="text-xs text-gray-500 mt-0.5">Tải lên hình ảnh, đặt tên và giá sản phẩm</p>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-black dark:group-hover:text-white transition" />
            </Link>

            <Link 
              href="/admin/products" 
              className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-black dark:hover:border-white transition group"
            >
              <div>
                <p className="font-bold">Quản lý kho hàng</p>
                <p className="text-xs text-gray-500 mt-0.5">Cập nhật thông tin, thay thế mô tả sản phẩm</p>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-black dark:group-hover:text-white transition" />
            </Link>

            <Link 
              href="/admin/orders" 
              className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-black dark:hover:border-white transition group"
            >
              <div>
                <p className="font-bold">Xử lý đơn hàng</p>
                <p className="text-xs text-gray-500 mt-0.5">Cập nhật trạng thái giao nhận và kiểm tra</p>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-black dark:group-hover:text-white transition" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}