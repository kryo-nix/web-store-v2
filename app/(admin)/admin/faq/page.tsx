import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function FAQPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  // Pakai (prisma as any).fAQ agar tidak error casing
  const faqs = await (prisma as any).fAQ.findMany({ orderBy: { order: 'asc' } });

  async function createFAQ(formData: FormData) {
    'use server';
    const question = formData.get('question') as string;
    const answer = formData.get('answer') as string;
    const order = parseInt(formData.get('order') as string) || 0;
    
    await (prisma as any).fAQ.create({ data: { question, answer, order } });
    redirect('/admin/admin/faq');
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Manage FAQs</h1>
      <form action={createFAQ} className="p-6 rounded-2xl border border-border bg-card space-y-4">
        <input name="question" placeholder="Question" className="w-full p-2 rounded-lg border border-border bg-background outline-none" required />
        <textarea name="answer" placeholder="Answer" className="w-full p-2 rounded-lg border border-border bg-background outline-none" required />
        <div className="flex gap-4">
          <input name="order" type="number" placeholder="Order" className="p-2 rounded-lg border border-border bg-background outline-none w-24" />
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold">Add FAQ</button>
        </div>
      </form>
      <div className="space-y-4">
        {faqs.map((faq: any) => (
          <div key={faq.id} className="p-4 rounded-2xl border border-border bg-card flex justify-between items-center">
            <div>
              <p className="font-bold">{faq.question}</p>
              <p className="text-sm text-muted-foreground">{faq.answer.substring(0, 100)}...</p>
            </div>
            <form action={async () => { 'use server'; await (prisma as any).fAQ.delete({ where: { id: faq.id } }); redirect('/admin/admin/faq'); }}>
              <button className="text-destructive text-sm hover:underline">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
