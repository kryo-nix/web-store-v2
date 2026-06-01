import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function PagesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const pages = await prisma.page.findMany();

  async function createPage(formData: FormData) {
    'use server';
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    await prisma.page.create({ data: { title, content, slug } });
    redirect('/admin/pages');
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Manage Pages</h1>
      
      <form action={createPage} className="p-6 rounded-2xl border border-border bg-card space-y-4">
        <input name="title" placeholder="Page Title (e.g. About Us)" className="w-full p-2 rounded-lg border border-border bg-background outline-none" required />
        <textarea name="content" placeholder="Page Content" className="w-full p-2 rounded-lg border border-border bg-background outline-none h-32" required />
        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold">Add Page</button>
      </form>

      <div className="space-y-4">
        {pages.map((p) => (
          <div key={p.id} className="p-4 rounded-2xl border border-border bg-card flex justify-between items-center">
            <div>
              <p className="font-bold">{p.title}</p>
              <p className="text-xs text-muted-foreground">Slug: /pages/{p.slug}</p>
            </div>
            <form action={async () => { 'use server'; await prisma.page.delete({ where: { id: p.id } }); redirect('/admin/pages'); }}>
              <button className="text-destructive text-sm hover:underline">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
