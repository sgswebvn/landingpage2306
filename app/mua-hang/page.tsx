"use client";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập họ tên"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  product: z.string().min(1),
  price: z.string().min(1),
  quantity: z.coerce.number().min(1, "Số lượng tối thiểu là 1"),
  note: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function MuaHangPage() {
  const searchParams = useSearchParams();
  
  const defaultProduct = searchParams.get("product") || "";
  const defaultPrice = searchParams.get("price") || "";

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: defaultProduct,
      price: defaultPrice,
      quantity: 1,
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Đặt hàng thành công! Chúng tôi sẽ liên hệ trong thời gian sớm nhất.");
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
      }
    } catch (error) {
      toast.error("Lỗi kết nối. Vui lòng kiểm tra lại.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-20 min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-10">Thông tin đặt hàng</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-10 rounded-3xl shadow-xl">
          
          <div>
            <label className="block text-sm font-medium mb-2">Sản phẩm</label>
            <input 
              {...register("product")} 
              className="w-full border rounded-xl px-5 py-3 bg-gray-50 font-medium" 
              readOnly 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Giá</label>
            <input 
              {...register("price")} 
              className="w-full border rounded-xl px-5 py-3 bg-gray-50" 
              readOnly 
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Số lượng</label>
              <input 
                type="number" 
                {...register("quantity")} 
                min="1" 
                className="w-full border rounded-xl px-5 py-3" 
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Họ và tên <span className="text-red-500">*</span></label>
            <input {...register("name")} className="w-full border rounded-xl px-5 py-3" placeholder="Nhập họ tên" />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Số điện thoại <span className="text-red-500">*</span></label>
            <input {...register("phone")} className="w-full border rounded-xl px-5 py-3" placeholder="0123456789" />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Địa chỉ nhận hàng <span className="text-red-500">*</span></label>
            <textarea {...register("address")} rows={3} className="w-full border rounded-xl px-5 py-3" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ghi chú thêm</label>
            <textarea {...register("note")} rows={3} className="w-full border rounded-xl px-5 py-3" placeholder="Yêu cầu thêm (nếu có)" />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-black text-white py-4 rounded-full text-lg font-medium hover:bg-gray-800 disabled:opacity-70 transition"
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}