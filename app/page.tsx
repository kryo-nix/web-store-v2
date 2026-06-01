import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { priority: 'asc' },
  });
  
  const products = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    take: 4,
    include: { category: true }
  });

  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    take: 3
  });

  return (
    <div className="flex flex-col gap-20 py-10">
      {/* Hero Section / Banner */}
      <section className="container mx-auto px-4">
        {banners.length > 0 ? (
          <div className="relative h-[500px] w-full rounded-3xl overflow-hidden group">
            <img 
              src={banners[0].image} 
              alt={banners[0].title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center px-8 md:px-16 text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-2xl">{banners[0].title}</h1>
              <p className="text-lg mb-8 max-w-xl opacity-90">{banners[0].subtitle}</p>
              {banners[0].link && (
                <Link 
                  href={banners[0].link} 
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold w-fit flex items-center gap-2 hover:opacity-90 transition"
                >
                  Get Started <ArrowRight size={18} />
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="h-[500px] w-full rounded-3xl bg-muted flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to our Digital Store</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">Find the best digital products and services to boost your productivity and business.</p>
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted-foreground">Our most popular and recommended digital assets.</p>
          </div>
          <Link href="/products" className="text-primary font-semibold flex items-center gap-1 hover:underline">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group border border-border bg-card rounded-2xl overflow-hidden hover:shadow-lg transition">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={product.image || '/placeholder-product.png'} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                />
                <span className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded">
                  {product.category.name}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-primary">
                    ${product.price.toString()}
                  </span>
                  <Link 
                    href={`/products/${product.slug}`} 
                    className="text-sm bg-secondary hover:bg-primary hover:text-primary-foreground px-3 py-1.5 rounded-lg transition"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">What Our Customers Say</h2>
            <p className="text-muted-foreground">Real feedback from people who trust our services.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-card p-6 rounded-2xl border border-border">
                <div className="flex items-center gap-4 mb-4">
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center font-bold">
                      {t.name[0]}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold">{t.name}</h4>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">"{t.feedback}"</p>
                <div className="mt-4 flex gap-1 text-yellow-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
