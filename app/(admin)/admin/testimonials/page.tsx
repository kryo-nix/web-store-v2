import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function TestimonialsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const testimonials = await prisma.testimonial.findMany();

  async function createTestimonial(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const feedback = formData.get('feedback') as string;
    const rating = parseInt(formData.get('rating') as string) || 5;
    const image = formData.get('image') as string;
    
    await prisma.testimonial.create({ data: { name, role, feedback, rating, image } });
    redirect('/admin/testimonials');
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Manage Testimonials</h1>
      
      <form action={createTestimonial} className="p-6 rounded-2xl border border-border bg-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Customer Name" className="p-2 rounded-lg border border-border bg-background outline-none" required />
          <input name="role" placeholder="Role (e.g. Business Owner)" className="p-2 rounded-lg border border-border bg-background outline-none" />
        </div>
        <textarea name="feedback" placeholder="Feedback" className="w-full p-2 rounded-lg border border-border bg-background outline-none" required />
        <div className="flex gap-4">
          <input name="rating" type="number" min="1" max="5" placeholder="Rating (1-5)" className="p-2 rounded-lg border border-border bg-background outline-none w-24" />
          <input name="image" placeholder="Image URL" className="flex-grow p-2 rounded-lg border border-border bg-background outline-none" />
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold">Add Testimonial</button>
        </div>
      </form>

      <div className="space-y-4">
        {testimonials.map((t) => (
          <div key={t.id} className="p-4 rounded-2xl border border-border bg-card flex justify-between items-center">
            <div>
              <p className="font-bold">{t.name} ({t.rating}⭐)</p>
              <p className="text-sm text-muted-foreground">{t.feedback.substring(0, 100)}...</p>
            </div>
            <form action={async () => { 'use server'; await prisma.testimonial.delete({ where: { id: t.id } }); redirect('/admin/testimonials'); }}>
              <button className="text-destructive text-sm hover:underline">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
