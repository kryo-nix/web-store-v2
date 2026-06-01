import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, Filter } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  const categories = await prisma.category.findMany();
  
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      AND: [
        q ? { name: { contains: q, mode: 'insensitive' } } : {},
        category ? { category: { slug: category } } : {},
      ],
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Products</h1>
        <p className="text-muted-foreground">Browse our extensive collection of digital assets and services.</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <form className="flex-grow flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              name="q" 
              defaultValue={q} 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium">
            Search
          </button>
        </form>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Link 
            href="/products" 
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap border ${!category ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground hover:border-primary'}`}
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/products?category=${cat.slug}`} 
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap border ${category === cat.slug ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground hover:border-primary'}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
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

      {products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
          <Link href="/products" className="text-primary underline mt-4 block">Reset filters</Link>
        </div>
      )}
    </div>
  );
}
