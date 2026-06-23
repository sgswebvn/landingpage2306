// app/admin/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Order = {
  id: string;
  name: string;
  phone: string;
  address: string;
  product: string;
  price: number;
  quantity: number;
  note?: string;
  status: string;
  created_at: string;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const supabase = createClient();

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    fetchOrders();
  };

  const filteredOrders = orders.filter(order => 
    statusFilter === "all" || order.status === statusFilter
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Đơn hàng</h1>
        <div className="flex gap-3">
          {["all", "pending", "processing", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-5 py-2 rounded-2xl text-sm font-medium capitalize transition ${
                statusFilter === status 
                  ? "bg-black text-white dark:bg-white dark:text-black" 
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
              }`}
            >
              {status === "all" ? "Tất cả" : status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-6">Khách hàng</th>
              <th className="text-left p-6">Sản phẩm</th>
              <th className="text-right p-6">Tổng tiền</th>
              <th className="text-center p-6">Trạng thái</th>
              <th className="text-center p-6">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="p-6">
                  <p className="font-medium">{order.name}</p>
                  <p className="text-sm text-gray-500">{order.phone}</p>
                </td>
                <td className="p-6">
                  <p>{order.product} × {order.quantity}</p>
                </td>
                <td className="p-6 text-right font-semibold">
                  {(order.price * order.quantity).toLocaleString('vi-VN')}đ
                </td>
                <td className="p-6 text-center">
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-2xl text-sm font-medium"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-6 text-center text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}