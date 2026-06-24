"use client";

import { useState } from "react";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock, Send, Check } from "lucide-react";

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
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast.success("Gửi tin nhắn liên hệ thành công!");
      setSubmitted(true);
      reset();
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen flex flex-col justify-between">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 w-full flex-1">
          
          <div className="grid lg:grid-cols-12 gap-0 rounded-[40px] overflow-hidden shadow-xl border border-gray-100 min-h-[680px]">
            
            {/* Cột trái: Nền tối sang trọng, kính mờ phát sáng nhẹ */}
            <div className="lg:col-span-5 bg-zinc-900 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
              {/* Abstract decorative glowing lights */}
              <div className="absolute top-[-20%] left-[-20%] w-72 h-72 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
              <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

              <div className="space-y-6 relative z-10">
                <span className="text-xs font-black tracking-widest text-zinc-400 uppercase">Liên hệ shop</span>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-none text-white">
                  Đồng hành cùng bạn
                </h1>
                <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
                  Chúng tôi luôn ở đây để lắng nghe và hỗ trợ. Hãy gửi tin nhắn hoặc ghé thăm cửa hàng của chúng tôi.
                </p>
              </div>

              {/* Glassmorphic Cards */}
              <div className="space-y-4 my-10 lg:my-0 relative z-10">
                <div className="flex gap-4 items-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition duration-300">
                  <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Địa chỉ</h3>
                    <p className="text-sm text-white font-semibold mt-0.5">123 CMT8, Q.1, TP. HCM</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition duration-300">
                  <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Hotline</h3>
                    <p className="text-sm text-white font-semibold mt-0.5">0123 456 789</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition duration-300">
                  <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Email</h3>
                    <p className="text-sm text-white font-semibold mt-0.5">support@yourshop.com</p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-zinc-500 relative z-10 flex items-center gap-1.5">
                <Clock size={12} />
                <span>Hoạt động: 08:00 AM - 10:00 PM</span>
              </div>
            </div>

            {/* Cột phải: Form nhập tối giản với Floating Labels */}
            <div className="lg:col-span-7 bg-white p-8 lg:p-16 flex flex-col justify-center">
              {submitted ? (
                <div className="text-center py-12 space-y-6 max-w-sm mx-auto">
                  <div className="w-20 h-20 bg-zinc-900 text-white rounded-full flex items-center justify-center mx-auto text-3xl font-bold animate-scale-up">
                    <Check size={36} className="stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-zinc-950">Tin nhắn đã gửi!</h3>
                    <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                      Cảm ơn sự đóng góp của bạn. Chúng tôi sẽ phản hồi lại qua Email hoặc Số điện thoại trong vòng 24h.
                    </p>
                  </div>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-3 px-6 rounded-xl font-semibold transition cursor-pointer"
                  >
                    Gửi tin nhắn khác
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight text-zinc-950">Gửi lời nhắn</h2>
                    <p className="text-gray-400 text-sm mt-1">Vui lòng để lại thông tin, chúng tôi sẽ liên hệ lại ngay.</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                    
                    {/* Floating Input: Name */}
                    <div className="relative border-b-2 border-zinc-100 focus-within:border-zinc-900 transition-colors py-2">
                      <input 
                        type="text"
                        {...register("name")}
                        placeholder=" "
                        className="peer w-full bg-transparent outline-none py-1.5 text-sm text-zinc-900 placeholder-transparent" 
                      />
                      <label className="absolute left-0 top-3 text-sm text-gray-400 pointer-events-none transition-all duration-300 
                                     peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                                     peer-focus:-top-4 peer-focus:text-xs peer-focus:text-zinc-950 peer-focus:font-bold
                                     peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-zinc-950">
                        Họ và tên *
                      </label>
                      {errors.name && <p className="text-red-500 text-xs mt-1 absolute">{errors.name.message}</p>}
                    </div>

                    {/* Floating Input: Phone */}
                    <div className="relative border-b-2 border-zinc-100 focus-within:border-zinc-900 transition-colors py-2">
                      <input 
                        type="text"
                        {...register("phone")}
                        placeholder=" "
                        className="peer w-full bg-transparent outline-none py-1.5 text-sm text-zinc-900 placeholder-transparent" 
                      />
                      <label className="absolute left-0 top-3 text-sm text-gray-400 pointer-events-none transition-all duration-300 
                                     peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                                     peer-focus:-top-4 peer-focus:text-xs peer-focus:text-zinc-950 peer-focus:font-bold
                                     peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-zinc-950">
                        Số điện thoại liên hệ *
                      </label>
                      {errors.phone && <p className="text-red-500 text-xs mt-1 absolute">{errors.phone.message}</p>}
                    </div>

                    {/* Floating Input: Email */}
                    <div className="relative border-b-2 border-zinc-100 focus-within:border-zinc-900 transition-colors py-2">
                      <input 
                        type="text"
                        {...register("email")}
                        placeholder=" "
                        className="peer w-full bg-transparent outline-none py-1.5 text-sm text-zinc-900 placeholder-transparent" 
                      />
                      <label className="absolute left-0 top-3 text-sm text-gray-400 pointer-events-none transition-all duration-300 
                                     peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                                     peer-focus:-top-4 peer-focus:text-xs peer-focus:text-zinc-950 peer-focus:font-bold
                                     peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-zinc-950">
                        Địa chỉ Email (Không bắt buộc)
                      </label>
                      {errors.email && <p className="text-red-500 text-xs mt-1 absolute">{errors.email.message}</p>}
                    </div>

                    {/* Floating Textarea: Message */}
                    <div className="relative border-b-2 border-zinc-100 focus-within:border-zinc-900 transition-colors py-2">
                      <textarea 
                        rows={3}
                        {...register("message")}
                        placeholder=" "
                        className="peer w-full bg-transparent outline-none py-1.5 text-sm text-zinc-900 placeholder-transparent resize-none" 
                      />
                      <label className="absolute left-0 top-3 text-sm text-gray-400 pointer-events-none transition-all duration-300 
                                     peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                                     peer-focus:-top-4 peer-focus:text-xs peer-focus:text-zinc-950 peer-focus:font-bold
                                     peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-zinc-950">
                        Tin nhắn của bạn *
                      </label>
                      {errors.message && <p className="text-red-500 text-xs mt-1 absolute">{errors.message.message}</p>}
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-75 transition cursor-pointer mt-4"
                    >
                      <Send size={16} />
                      {isSubmitting ? "Đang gửi đi..." : "Gửi lời nhắn ngay"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
