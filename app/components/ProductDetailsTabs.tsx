"use client";

import { useState } from "react";
import { ChevronDown, FileText, Truck, ShieldCheck } from "lucide-react";

type ProductDetailsTabsProps = {
  descriptionHtml: string;
};

export default function ProductDetailsTabs({ descriptionHtml }: ProductDetailsTabsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default open first tab

  const toggleTab = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  const tabs = [
    {
      title: "Giới thiệu & Chi tiết sản phẩm",
      icon: FileText,
      content: descriptionHtml 
        ? <div className="prose max-w-none text-gray-700 leading-relaxed font-sans prose-img:rounded-2xl whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
        : <p className="text-gray-400">Không có mô tả chi tiết cho sản phẩm này.</p>
    },
    {
      title: "Chính sách Vận chuyển & Đổi trả",
      icon: Truck,
      content: (
        <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <p>🚚 <strong>Miễn phí giao hàng:</strong> Áp dụng cho mọi đơn hàng từ 500.000đ trở lên. Các đơn hàng dưới 500.000đ áp dụng phí giao hàng đồng giá 30.000đ toàn quốc.</p>
          <p>⚡ <strong>Thời gian giao hàng:</strong> Từ 1 - 3 ngày làm việc đối với khu vực trung tâm TP.HCM/Hà Nội, và từ 3 - 5 ngày đối với các tỉnh thành khác.</p>
          <p>🔄 <strong>Chính sách đổi trả:</strong> Hỗ trợ đổi trả miễn phí trong vòng 7 ngày kể từ khi nhận hàng nếu có lỗi do nhà sản xuất hoặc giao sai mẫu mã.</p>
        </div>
      )
    },
    {
      title: "Cam kết chất lượng & Bảo hành",
      icon: ShieldCheck,
      content: (
        <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <p>🛡️ <strong>Chính hãng 100%:</strong> Cửa hàng cam kết cung cấp các mặt hàng chính hãng chất lượng cao nhất, đầy đủ tem mác xuất xứ.</p>
          <p>🔧 <strong>Bảo hành sản phẩm:</strong> Bảo hành sửa chữa hoặc đổi mới trong 6 tháng đối với các lỗi kỹ thuật phát sinh từ sản phẩm.</p>
          <p>💬 <strong>Hỗ trợ khách hàng:</strong> Đội ngũ chăm sóc khách hàng luôn túc trực hỗ trợ giải đáp mọi thắc mắc và xử lý khiếu nại trong vòng 24 giờ.</p>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-3 mt-12 border-t pt-8 w-full">
      {tabs.map((tab, idx) => {
        const isOpen = openIndex === idx;
        const Icon = tab.icon;
        
        return (
          <div 
            key={idx} 
            className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 transition-all shadow-sm"
          >
            {/* Header Button */}
            <button
              type="button"
              onClick={() => toggleTab(idx)}
              className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isOpen ? "bg-black text-white dark:bg-white dark:text-black" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                  <Icon size={16} />
                </div>
                <span>{tab.title}</span>
              </div>
              <ChevronDown 
                size={18} 
                className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-black dark:text-white" : ""}`} 
              />
            </button>

            {/* Collapsible Content */}
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? "max-h-[800px] opacity-100 border-t border-gray-50 dark:border-gray-850 p-6" : "max-h-0 opacity-0"
              }`}
            >
              {tab.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
