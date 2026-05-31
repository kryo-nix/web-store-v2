import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function PaymentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const payments = await prisma.paymentMethod.findMany();

  async function createPayment(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const icon = formData.get('icon') as string;
    const details = formData.get('details') as string;
    
    await prisma.paymentMethod.create({ data: { name, icon, details } });
    redirect('/admin/payments');
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Payment Methods</h1>
      
      <form action={createPayment} className="p-6 rounded-2xl border border-border bg-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Method Name (e.g. Bank Transfer)" className="p-2 rounded-lg border border-border bg-background outline-none" required />
          <input name="icon" placeholder="Icon URL" className="p-2 rounded-lg border border-border bg-background outline-none" />
        </div>
        <textarea name="details" placeholder="Payment Details (Account number, etc)" className="w-full p-2 rounded-lg border border-border bg-background outline-none" required />
        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold">Add Payment Method</button>
      </form>

      <div className="space-y-4">
        {payments.map((p) => (
          <div key={p.id} className="p-4 rounded-2xl border border-border bg-card flex justify-between items-center">
            <div>
              <p className="font-bold">{p.name}</p>
              <p className="text-sm text-muted-foreground">{p.details.substring(0, 100)}...</p>
            </div>
            <form action={async () => { 'use server'; await prisma.paymentMethod.delete({ where: { id: p.id } }); redirect('/admin/payments'); }}>
              <button className="text-destructive text-sm hover:underline">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
