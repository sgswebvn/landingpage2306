// app/admin/customers/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Lấy unique khách hàng từ orders
    supabase.from("orders")
      .select("name, phone, address")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) {
          const unique = Array.from(new Map(data.map(item => [item.phone, item])).values());
          setCustomers(unique);
        }
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Khách hàng</h1>
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer, index) => (
            <div key={index} className="border border-gray-100 dark:border-gray-700 rounded-3xl p-8 hover:shadow-md transition">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 flex items-center justify-center text-white text-2xl">
                {customer.name?.[0]}
              </div>
              <h3 className="text-xl font-semibold">{customer.name}</h3>
              <p className="text-gray-500 mt-1">{customer.phone}</p>
              <p className="text-sm mt-4 text-gray-600 line-clamp-2">{customer.address}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}