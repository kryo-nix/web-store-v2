import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CheckCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Link href="/products" className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition">
        <ArrowLeft size={18} /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden border border-border">
            <img 
              src={product.image || '/placeholder-product.png'} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <span className="text-primary font-bold text-sm uppercase tracking-wider mb-2">
            {product.category.name}
          </span>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <div className="text-3xl font-bold text-primary mb-6">
            ${product.price.toString()}
          </div>
          
          <div className="prose prose-invert max-w-none mb-8 text-muted-foreground">
            <p className="whitespace-pre-line">{product.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              "Instant Delivery",
              "24/7 Customer Support",
              "Secure Payment",
              "Premium Quality"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-primary" /> {feature}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-grow bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition">
              <ShoppingCart size={20} /> Buy Now
            </button>
            <button className="px-8 py-4 rounded-2xl border border-border font-bold hover:bg-muted transition">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
