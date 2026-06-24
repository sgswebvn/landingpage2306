"use client";

import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

type AddToCartButtonProps = {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
};

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    addToCart(product, 1);
    router.push("/mua-hang");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t w-full">
      <button
        type="button"
        onClick={handleAddToCart}
        className="flex-1 flex items-center justify-center gap-2 border-2 border-black hover:bg-gray-50 text-black py-4 px-6 rounded-full text-base font-bold transition-all cursor-pointer active:scale-98"
      >
        <ShoppingCart size={18} />
        Thêm vào giỏ hàng
      </button>
      <button
        type="button"
        onClick={handleBuyNow}
        className="flex-1 bg-black hover:bg-gray-800 text-white py-4 px-6 rounded-full text-base font-bold transition-all cursor-pointer active:scale-98"
      >
        Mua ngay
      </button>
    </div>
  );
}
