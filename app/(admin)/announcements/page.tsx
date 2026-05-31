import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AnnouncementsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const announcements = await prisma.announcement.findMany();

  async function createAnnouncement(formData: FormData) {
    'use server';
    const content = formData.get('content') as string;
    await prisma.announcement.create({ data: { content, isActive: true } });
    redirect('/admin/announcements');
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Announcements</h1>
      
      <form action={createAnnouncement} className="p-6 rounded-2xl border border-border bg-card space-y-4">
        <textarea name="content" placeholder="Announcement text..." className="w-full p-2 rounded-lg border border-border bg-background outline-none" required />
        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold">Post Announcement</button>
      </form>

      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a.id} className="p-4 rounded-2xl border border-border bg-card flex justify-between items-center">
            <p>{a.content}</p>
            <form action={async () => { 'use server'; await prisma.announcement.delete({ where: { id: a.id } }); redirect('/admin/announcements'); }}>
              <button className="text-destructive text-sm hover:underline">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
