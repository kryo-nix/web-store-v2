import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function BannersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const banners = await prisma.banner.findMany({ orderBy: { priority: 'asc' } });

  async function createBanner(formData: FormData) {
    'use server';
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const image = formData.get('image') as string;
    const link = formData.get('link') as string;
    const priority = parseInt(formData.get('priority') as string) || 0;

    await prisma.banner.create({
      data: { title, subtitle, image, link, priority }
    });
    redirect('/admin/banners');
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Manage Banners</h1>
      
      <form action={createBanner} className="p-6 rounded-2xl border border-border bg-card grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="title" placeholder="Banner Title" className="p-2 rounded-lg border border-border bg-background outline-none" required />
        <input name="subtitle" placeholder="Banner Subtitle" className="p-2 rounded-lg border border-border bg-background outline-none" />
        <input name="image" placeholder="Image URL" className="p-2 rounded-lg border border-border bg-background outline-none" required />
        <input name="link" placeholder="Button Link" className="p-2 rounded-lg border border-border bg-background outline-none" />
        <input name="priority" type="number" placeholder="Priority" className="p-2 rounded-lg border border-border bg-background outline-none" />
        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold">Add Banner</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div key={b.id} className="p-4 rounded-2xl border border-border bg-card flex gap-4 items-center">
            <img src={b.image} alt="" className="h-16 w-24 object-cover rounded" />
            <div className="flex-grow">
              <p className="font-bold">{b.title}</p>
              <p className="text-xs text-muted-foreground">Priority: {b.priority}</p>
            </div>
            <form action={async () => { 'use server'; await prisma.banner.delete({ where: { id: b.id } }); redirect('/admin/banners'); }}>
              <button className="text-destructive text-sm hover:underline">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
