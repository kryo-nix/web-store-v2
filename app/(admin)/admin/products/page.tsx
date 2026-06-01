import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const categories = await prisma.category.findMany();
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  async function createProduct(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const categoryId = formData.get('categoryId') as string;
    const image = formData.get('image') as string;
    const isFeatured = formData.get('isFeatured') === 'on';

    await prisma.product.create({
      data: { name, slug, description, price, categoryId, image, isFeatured }
    });
    redirect('/admin/products');
  }

  async function deleteProduct(id: string) {
    'use server';
    await prisma.product.delete({ where: { id } });
    redirect('/admin/products');
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Products</h1>

      <form action={createProduct} className="p-6 rounded-2xl border border-border bg-card grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" placeholder="Product Name" className="p-2 rounded-lg border border-border bg-background outline-none" required />
        <select name="categoryId" className="p-2 rounded-lg border border-border bg-background outline-none" required>
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <input name="price" type="number" step="0.01" placeholder="Price" className="p-2 rounded-lg border border-border bg-background outline-none" required />
        <input name="image" placeholder="Image URL" className="p-2 rounded-lg border border-border bg-background outline-none" />
        <textarea name="description" placeholder="Description" className="p-2 rounded-lg border border-border bg-background outline-none md:col-span-2" required />
        <div className="flex items-center gap-2">
          <input type="checkbox" name="isFeatured" id="isFeatured" />
          <label htmlFor="isFeatured" className="text-sm">Featured Product</label>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold md:col-span-2">Add Product</button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-sm">
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border hover:bg-muted/50 transition">
                <td className="p-4 flex items-center gap-3">
                  <img src={p.image || '/placeholder.png'} alt="" className="h-10 w-10 rounded object-cover" />
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="p-4 text-sm">{p.category.name}</td>
                <td className="p-4 font-bold">${p.price.toString()}</td>
                <td className="p-4 text-sm">
                  {p.isFeatured ? <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-xs font-bold">Featured</span> : <span className="text-muted-foreground">Normal</span>}
                </td>
                <td className="p-4">
                  <form action={async () => { 'use server'; await prisma.product.delete({ where: { id: p.id } }); redirect('/admin/products'); }}>
                    <button className="text-destructive text-sm hover:underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
