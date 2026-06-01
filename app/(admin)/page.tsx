import { prisma } from "@/lib/prisma";
import { Package, Layers, MessageSquare, Star, User } from "lucide-react";

export default async function AdminDashboard() {
  const productCount = await prisma.product.count();
  const categoryCount = await prisma.category.count();
  const faqCount = await prisma.faq.count();
  const testimonialCount = await prisma.testimonial.count();

  const stats = [
    { name: 'Total Products', value: productCount, icon: Package, color: 'text-blue-500' },
    { name: 'Total Categories', value: categoryCount, icon: Layers, color: 'text-green-500' },
    { name: 'Total FAQs', value: faqCount, icon: MessageSquare, color: 'text-purple-500' },
    { name: 'Total Testimonials', value: testimonialCount, icon: Star, color: 'text-yellow-500' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="p-6 rounded-2xl border border-border bg-card flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.name}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Quick Overview</h2>
        <p className="text-muted-foreground">
          Welcome to your store management system. Use the sidebar to manage your products, categories, and overall website settings. 
          All changes are reflected in real-time on the public storefront.
        </p>
      </div>
    </div>
  );
}
