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
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      <button
        type="button"
        onClick={handleAddToCart}
        className="flex-1 flex items-center justify-center gap-2 border-2 border-black hover:bg-gray-50 text-black py-4 px-6 rounded-2xl text-lg font-semibold transition cursor-pointer"
      >
        <ShoppingCart size={20} />
        Thêm vào giỏ hàng
      </button>
      <button
        type="button"
        onClick={handleBuyNow}
        className="flex-1 bg-black hover:bg-gray-900 text-white py-4 px-6 rounded-2xl text-lg font-semibold transition cursor-pointer"
      >
        Mua ngay
      </button>
    </div>
  );
}
