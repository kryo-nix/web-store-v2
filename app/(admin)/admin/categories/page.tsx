import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  async function createCategory(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    await prisma.category.create({ data: { name, slug } });
    redirect('/admin/categories');
  }

  async function deleteCategory(id: string) {
    'use server';
    await prisma.category.delete({ where: { id } });
    redirect('/admin/categories');
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
      </div>

      <form action={createCategory} className="flex gap-4 p-6 rounded-2xl border border-border bg-card">
        <input 
          name="name" 
          placeholder="Category Name" 
          className="flex-grow p-2 rounded-lg border border-border bg-background outline-none" 
          required 
        />
        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold">Add Category</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="p-4 rounded-2xl border border-border bg-card flex justify-between items-center">
            <span className="font-medium">{cat.name}</span>
            <form action={async () => { 'use server'; await prisma.category.delete({ where: { id: cat.id } }); redirect('/admin/categories'); }}>
              <button className="text-destructive text-sm hover:underline">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
