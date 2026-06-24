// app/admin/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Search, Eye, Trash2, X, ShoppingCart, User, Phone, MapPin, Calendar, Clock, Clipboard } from "lucide-react";
import { toast } from "sonner";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const result = await res.json();
      if (result.success) {
        setOrders(result.orders);
      } else {
        toast.error("Không thể tải đơn hàng: " + result.error);
      }
    } catch (e) {
      toast.error("Lỗi kết nối khi tải danh sách đơn hàng");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(`Cập nhật trạng thái đơn hàng thành công!`);
        fetchOrders();
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }
      } else {
        toast.error("Không thể cập nhật trạng thái: " + result.error);
      }
    } catch (e) {
      toast.error("Lỗi kết nối khi cập nhật trạng thái");
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Xác nhận xóa vĩnh viễn đơn hàng này?")) return;
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Đã xóa đơn hàng!");
        setSelectedOrder(null);
        fetchOrders();
      } else {
        toast.error("Không thể xóa đơn hàng: " + result.error);
      }
    } catch (e) {
      toast.error("Lỗi kết nối khi xóa đơn hàng");
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch = 
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400";
      case "processing":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400";
      default: // pending
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Quản lý Đơn hàng</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Danh sách đặt hàng từ người dùng ({filteredOrders.length} đơn)</p>
        </div>

        {/* Status Filter Badges */}
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "processing", "completed", "cancelled"].map((status) => {
            const count = status === "all" 
              ? orders.length 
              : orders.filter(o => o.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold capitalize transition flex items-center gap-2 cursor-pointer ${
                  statusFilter === status 
                    ? "bg-black text-white dark:bg-white dark:text-black" 
                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                <span>{status === "all" ? "Tất cả" : status}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                  statusFilter === status
                    ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-black"
                    : "bg-gray-200 text-gray-600 dark:bg-gray-750 dark:text-gray-400"
                }`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Tìm đơn hàng theo tên, số điện thoại, địa chỉ hoặc sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[20px] focus:outline-none focus:border-black dark:focus:border-white transition text-sm"
        />
      </div>

      {/* Table Data */}
      <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-6">Khách hàng</th>
                <th className="p-6">Chi tiết sản phẩm</th>
                <th className="p-6 text-right">Tổng tiền</th>
                <th className="p-6 text-center">Trạng thái</th>
                <th className="p-6 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                    <td className="p-6">
                      <p className="font-bold text-gray-900 dark:text-white">{order.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.phone}</p>
                    </td>
                    <td className="p-6 max-w-xs">
                      <p className="truncate text-gray-700 dark:text-gray-300">{order.product}</p>
                      <p className="text-xs text-gray-400 mt-0.5">SL: {order.quantity}</p>
                    </td>
                    <td className="p-6 text-right font-extrabold text-gray-900 dark:text-white">
                      {(order.price * order.quantity).toLocaleString('vi-VN')}đ
                    </td>
                    <td className="p-6 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => setSelectedOrder(order)} 
                          className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition text-gray-600 dark:text-gray-400 cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => deleteOrder(order.id)} 
                          className="p-2.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition text-red-500 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-400 font-medium">Không tìm thấy đơn hàng trùng khớp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Modal Detail View */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 max-h-[90vh] flex flex-col animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Chi tiết đơn đặt hàng</span>
                <h3 className="font-extrabold text-lg text-gray-900 dark:text-white mt-1">Đơn #{selectedOrder.id.slice(0, 8)}</h3>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Status Update Card */}
              <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Trạng thái hiện tại</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusBadgeClass(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="space-y-1 w-full sm:w-auto">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Thay đổi trạng thái</label>
                  <select 
                    value={selectedOrder.status}
                    onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                    className="w-full sm:w-auto bg-white dark:bg-gray-900 border px-4 py-2 rounded-xl text-sm font-semibold focus:outline-none"
                  >
                    <option value="pending">Chờ xử lý (Pending)</option>
                    <option value="processing">Đang chuẩn bị (Processing)</option>
                    <option value="completed">Đã hoàn thành (Completed)</option>
                    <option value="cancelled">Đã hủy (Cancelled)</option>
                  </select>
                </div>
              </div>

              {/* Customer Info Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Information list */}
                <div className="space-y-4">
                  <h4 className="font-bold text-base text-gray-800 dark:text-white border-b pb-2 flex items-center gap-2">
                    <User size={18} className="text-gray-400" />
                    Khách hàng
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p><strong className="text-gray-900 dark:text-white">Họ tên:</strong> {selectedOrder.name}</p>
                    <p className="flex items-center gap-1.5"><Phone size={14} /> {selectedOrder.phone}</p>
                    <p className="flex items-start gap-1.5"><MapPin size={14} className="mt-1 flex-shrink-0" /> {selectedOrder.address}</p>
                  </div>
                </div>

                {/* Details info */}
                <div className="space-y-4">
                  <h4 className="font-bold text-base text-gray-800 dark:text-white border-b pb-2 flex items-center gap-2">
                    <Calendar size={18} className="text-gray-400" />
                    Thời gian & Ghi chú
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p className="flex items-center gap-1.5"><Calendar size={14} /> Ngày: {new Date(selectedOrder.created_at).toLocaleDateString('vi-VN')}</p>
                    <p className="flex items-center gap-1.5"><Clock size={14} /> Giờ: {new Date(selectedOrder.created_at).toLocaleTimeString('vi-VN')}</p>
                    <p className="flex items-start gap-1.5">
                      <Clipboard size={14} className="mt-1 flex-shrink-0" /> 
                      <span>
                        <strong className="text-gray-900 dark:text-white">Ghi chú:</strong> {selectedOrder.note || "Không có ghi chú"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Listing */}
              <div className="space-y-4">
                <h4 className="font-bold text-base text-gray-800 dark:text-white border-b pb-2 flex items-center gap-2">
                  <ShoppingCart size={18} className="text-gray-400" />
                  Danh sách sản phẩm mua
                </h4>
                <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-2xl border space-y-4">
                  <div className="flex justify-between items-center text-sm font-semibold border-b pb-2 text-gray-400">
                    <span>Sản phẩm</span>
                    <span>Thành tiền</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white">{selectedOrder.product}</span>
                    <span className="font-extrabold text-blue-600">{(selectedOrder.price * selectedOrder.quantity).toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
              <button 
                onClick={() => deleteOrder(selectedOrder.id)}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition cursor-pointer"
              >
                <Trash2 size={16} />
                Xóa đơn hàng
              </button>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white px-6 py-3 rounded-2xl text-sm font-bold transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}