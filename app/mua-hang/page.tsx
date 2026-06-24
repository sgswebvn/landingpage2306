"use client";

import { useState, useEffect } from "react";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Truck, Percent, CreditCard, ChevronRight } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập họ tên"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ nhận hàng"),
  note: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function MuaHangPage() {
  const { cart, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(1); // 1: Giỏ hàng & Form, 2: Hoàn tất
  
  // Promo code feature (WOW effect)
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState("");

  // States for summary after success
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderSummaryText, setOrderSummaryText] = useState("");
  const [orderTotalPrice, setOrderTotalPrice] = useState(0);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "WELCOME") {
      const discount = Math.round(totalPrice * 0.1); // 10% discount
      setDiscountAmount(discount);
      setAppliedPromo("WELCOME (Giảm 10%)");
      toast.success("Áp dụng mã giảm giá 10% thành công!");
    } else if (promoCode.trim() === "") {
      toast.error("Vui lòng nhập mã giảm giá");
    } else {
      toast.error("Mã giảm giá không hợp lệ");
    }
  };

  const finalTotalPrice = Math.max(0, totalPrice - discountAmount);

  const onSubmit = async (data: FormData) => {
    if (cart.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống.");
      return;
    }

    try {
      const promoInfo = appliedPromo ? ` [Mã GG: ${appliedPromo}]` : "";
      const orderData = {
        name: data.name,
        phone: data.phone,
        address: data.address,
        product: cart.map(item => `${item.name} (x${item.quantity})`).join(", ") + promoInfo,
        price: finalTotalPrice.toString(),
        quantity: 1,
        note: data.note || '',
      };

      const res = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        setCustomerName(data.name);
        setCustomerPhone(data.phone);
        setCustomerAddress(data.address);
        setOrderSummaryText(orderData.product);
        setOrderTotalPrice(finalTotalPrice);

        toast.success("Đặt hàng thành công!");
        clearCart();
        setActiveStep(2);
        setOrderSuccess(true);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
      }
    } catch (error) {
      toast.error("Lỗi kết nối. Vui lòng kiểm tra lại.");
    }
  };

  if (!mounted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
        <Footer />
      </>
    );
  }

  // Bước 3: Hoàn thành đặt hàng
  if (orderSuccess) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-50 min-h-screen py-16">
          <div className="max-w-3xl mx-auto px-6">
            
            {/* Progress Bar */}
            <div className="flex items-center justify-center mb-12">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">✓</span>
                <span className="text-sm font-medium text-gray-500">Giỏ hàng</span>
              </div>
              <div className="w-16 h-1 bg-green-500 mx-3"></div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">✓</span>
                <span className="text-sm font-medium text-gray-500">Thanh toán</span>
              </div>
              <div className="w-16 h-1 bg-green-500 mx-3"></div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">3</span>
                <span className="text-sm font-bold">Hoàn tất</span>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[32px] shadow-xl border border-gray-100 text-center space-y-8">
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto text-5xl font-bold animate-bounce">
                ✓
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Đặt hàng thành công!</h1>
                <p className="text-gray-500 text-lg mt-2">
                  Cảm ơn bạn đã tin tưởng mua sắm. Đơn hàng của bạn đang được xử lý.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-3xl text-left border border-gray-100 space-y-4">
                <h3 className="font-bold text-xl text-gray-800 border-b pb-3 flex items-center gap-2">
                  <ShieldCheck className="text-green-500" size={22} />
                  Chi tiết đơn hàng nhận
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <p><strong className="text-gray-900">Người nhận:</strong> {customerName}</p>
                  <p><strong className="text-gray-900">Số điện thoại:</strong> {customerPhone}</p>
                  <p className="md:col-span-2"><strong className="text-gray-900">Địa chỉ giao hàng:</strong> {customerAddress}</p>
                  <p className="md:col-span-2"><strong className="text-gray-900">Mặt hàng:</strong> {orderSummaryText}</p>
                </div>
                <div className="border-t pt-4 flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Tổng thanh toán:</span>
                  <span className="text-2xl text-blue-600">{orderTotalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/" className="bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-full text-base font-semibold transition cursor-pointer">
                  Về Trang Chủ
                </Link>
                <Link href="/san-pham" className="border-2 border-black hover:bg-gray-50 text-black px-8 py-4 rounded-full text-base font-semibold transition cursor-pointer">
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Giỏ hàng trống
  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-50 min-h-screen py-24">
          <div className="max-w-md mx-auto px-6 text-center space-y-6">
            <div className="w-28 h-28 bg-white text-gray-300 rounded-full flex items-center justify-center mx-auto shadow-md">
              <ShoppingBag size={56} className="stroke-[1.5]" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Giỏ hàng trống</h1>
              <p className="text-gray-500 mt-2">
                Có vẻ như bạn chưa chọn được sản phẩm nào. Hãy khám phá ngay các sản phẩm bán chạy của chúng tôi nhé!
              </p>
            </div>
            <Link href="/san-pham" className="inline-block bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 cursor-pointer">
              Bắt đầu mua sắm ngay
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Progress Tracker */}
          <div className="flex items-center justify-center mb-10 max-w-lg mx-auto">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold shadow-sm">1</span>
              <span className="text-sm font-bold text-gray-900">Giỏ hàng</span>
            </div>
            <div className="w-20 h-0.5 bg-gray-300 mx-3"></div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-semibold">2</span>
              <span className="text-sm font-medium text-gray-400">Thanh toán</span>
            </div>
          </div>

          <div className="mb-8">
            <Link href="/san-pham" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium transition">
              <ArrowLeft size={16} />
              Quay lại danh mục sản phẩm
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mt-3">Giỏ hàng của bạn</h1>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Cột trái: Danh sách giỏ hàng */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Sản phẩm chọn mua</h2>
                  <span className="text-sm text-gray-500 font-medium">({cart.length} loại sản phẩm)</span>
                </div>

                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div key={item.id} className="py-6 flex gap-5 first:pt-0 last:pb-0 group">
                      <div className="relative w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 group-hover:shadow-md transition">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">📷</div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 leading-snug hover:text-blue-600 transition">
                              <Link href={`/san-pham/${item.id}`}>{item.name}</Link>
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">Đơn giá: {item.price.toLocaleString('vi-VN')}đ</p>
                          </div>
                          <p className="font-extrabold text-lg text-gray-900 whitespace-nowrap">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center mt-3">
                          {/* Số lượng */}
                          <div className="flex items-center border border-gray-200 rounded-xl px-3 py-1 gap-4 bg-gray-50 shadow-inner">
                            <button 
                              type="button" 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-gray-400 hover:text-black transition"
                            >
                              <Minus size={14} className="stroke-[2.5]" />
                            </button>
                            <span className="font-bold text-sm w-4 text-center text-gray-800">{item.quantity}</span>
                            <button 
                              type="button" 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-gray-400 hover:text-black transition"
                            >
                              <Plus size={14} className="stroke-[2.5]" />
                            </button>
                          </div>
                          
                          {/* Xóa */}
                          <button 
                            type="button" 
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-xl transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cam kết cửa hàng */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-gray-600">
                <div className="flex flex-col items-center p-3 border-r border-gray-100 last:border-0">
                  <Truck className="text-blue-500 mb-2" size={24} />
                  <span className="font-semibold text-gray-900">Giao nhanh miễn phí</span>
                  <span className="text-xs text-gray-400 mt-0.5">Cho đơn hàng từ 500k</span>
                </div>
                <div className="flex flex-col items-center p-3 border-r border-gray-100 last:border-0">
                  <ShieldCheck className="text-green-500 mb-2" size={24} />
                  <span className="font-semibold text-gray-900">Bảo mật thanh toán</span>
                  <span className="text-xs text-gray-400 mt-0.5">Yên tâm đặt hàng</span>
                </div>
                <div className="flex flex-col items-center p-3 last:border-0">
                  <Percent className="text-purple-500 mb-2" size={24} />
                  <span className="font-semibold text-gray-900">Ưu đãi giảm giá</span>
                  <span className="text-xs text-gray-400 mt-0.5">Nhập mã WELCOME giảm 10%</span>
                </div>
              </div>
            </div>

            {/* Cột phải: Hóa đơn & Thông tin nhận hàng */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Tóm tắt hóa đơn */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b pb-4">Tóm tắt đơn hàng</h2>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Tổng tiền hàng:</span>
                    <span className="font-semibold text-gray-900">{totalPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span className="text-green-600 font-semibold">Miễn phí</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>Mã giảm giá ({appliedPromo.split(" ")[0]}):</span>
                      <span className="font-semibold">-{discountAmount.toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}
                </div>

                {/* Promo Code Input */}
                <div className="border-t border-b py-4 space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Nhập mã giảm giá</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Ví dụ: WELCOME" 
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:border-black outline-none uppercase"
                    />
                    <button 
                      type="button"
                      onClick={handleApplyPromo}
                      className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer"
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-lg font-black text-gray-900">
                  <span>Tổng thanh toán:</span>
                  <span className="text-2xl text-blue-600">{finalTotalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              {/* Thông tin giao hàng */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard size={22} className="text-gray-400" />
                  Thông tin giao hàng
                </h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Họ và tên người nhận <span className="text-red-500">*</span></label>
                    <input 
                      {...register("name")} 
                      className="w-full border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none rounded-2xl px-5 py-3 transition" 
                      placeholder="Họ và tên" 
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Số điện thoại liên hệ <span className="text-red-500">*</span></label>
                    <input 
                      {...register("phone")} 
                      className="w-full border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none rounded-2xl px-5 py-3 transition" 
                      placeholder="Ví dụ: 0987654321" 
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Địa chỉ nhận hàng <span className="text-red-500">*</span></label>
                    <textarea 
                      {...register("address")} 
                      rows={3} 
                      className="w-full border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none rounded-2xl px-5 py-3 transition resize-none" 
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố" 
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Ghi chú vận chuyển (Không bắt buộc)</label>
                    <textarea 
                      {...register("note")} 
                      rows={2} 
                      className="w-full border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none rounded-2xl px-5 py-3 transition resize-none" 
                      placeholder="Chỉ dẫn giao hàng, thời gian nhận..." 
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-full text-base font-bold shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? "Đang xử lý đặt hàng..." : "Xác nhận & Đặt hàng ngay"}
                    <ChevronRight size={18} />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}