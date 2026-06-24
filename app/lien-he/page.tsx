"use client";

import { useState } from "react";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ").or(z.literal("")),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
  message: z.string().min(5, "Nội dung tin nhắn phải từ 5 ký tự trở lên"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function LienHePage() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Giả lập gửi thông tin liên hệ (có thể gửi lên Google Sheets hoặc lưu DB nếu có)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Gửi tin nhắn liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.");
      setSubmitted(true);
      reset();
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-5xl font-extrabold tracking-tight mb-4">Liên hệ với chúng tôi</h1>
            <p className="text-gray-500 text-lg">
              Bạn có thắc mắc hay đóng góp gì? Hãy gửi tin nhắn cho chúng tôi, đội ngũ hỗ trợ sẽ phản hồi bạn nhanh nhất có thể.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Thông tin liên hệ */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
                <h2 className="text-2xl font-bold border-b pb-4">Thông tin cửa hàng</h2>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Địa chỉ cửa hàng</h3>
                    <p className="text-gray-500 mt-1">123 Đường Cách Mạng Tháng Tám, Quận 1, TP. Hồ Chí Minh, Việt Nam</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Hotline tư vấn</h3>
                    <p className="text-gray-500 mt-1 font-medium">0123 456 789 (Hỗ trợ 24/7)</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Hòm thư điện tử</h3>
                    <p className="text-gray-500 mt-1">support@yourshop.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 flex-shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Thời gian mở cửa</h3>
                    <p className="text-gray-500 mt-1">08:00 AM - 10:00 PM (Hàng ngày)</p>
                  </div>
                </div>
              </div>

              {/* Bản đồ ảo */}
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-72 relative">
                <div className="w-full h-full bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <MapPin size={32} className="animate-bounce" />
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Bản đồ Cửa Hàng</h4>
                  <p className="text-gray-500 text-sm max-w-xs">123 Đường Cách Mạng Tháng Tám, Quận 1, TP. Hồ Chí Minh</p>
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-4 text-blue-600 font-medium hover:underline text-sm"
                  >
                    Xem trên Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Form liên hệ */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare size={28} className="text-blue-600" />
                  <h2 className="text-2xl font-bold">Gửi tin nhắn cho chúng tôi</h2>
                </div>

                {submitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                      ✓
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Cảm ơn bạn đã liên hệ!</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Tin nhắn của bạn đã được gửi đi thành công. Đội ngũ hỗ trợ của chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="mt-6 border-2 border-black hover:bg-gray-50 px-8 py-3 rounded-full font-semibold transition cursor-pointer"
                    >
                      Gửi tin nhắn khác
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Họ và tên <span className="text-red-500">*</span></label>
                        <input 
                          {...register("name")} 
                          className="w-full border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none rounded-2xl px-5 py-3 transition" 
                          placeholder="Nhập họ và tên" 
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Số điện thoại <span className="text-red-500">*</span></label>
                        <input 
                          {...register("phone")} 
                          className="w-full border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none rounded-2xl px-5 py-3 transition" 
                          placeholder="0123456789" 
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">Địa chỉ Email (Không bắt buộc)</label>
                      <input 
                        {...register("email")} 
                        className="w-full border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none rounded-2xl px-5 py-3 transition" 
                        placeholder="email@example.com" 
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">Nội dung tin nhắn <span className="text-red-500">*</span></label>
                      <textarea 
                        {...register("message")} 
                        rows={5} 
                        className="w-full border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none rounded-2xl px-5 py-3 transition resize-none" 
                        placeholder="Hãy viết thắc mắc hoặc lời nhắn gửi..." 
                      />
                      {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-75 transition cursor-pointer"
                    >
                      <Send size={18} />
                      {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn ngay"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
