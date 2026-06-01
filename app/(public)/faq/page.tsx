import { prisma } from "@/lib/prisma";

export default async function FAQPage() {
  const faqs = await prisma.faq.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Everything you need to know about our products and services.</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq) => (
          <details key={faq.id} className="group border border-border rounded-2xl bg-card">
            <summary className="flex justify-between items-center p-6 cursor-pointer font-bold hover:text-primary transition">
              {faq.question}
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
        {faqs.length === 0 && (
          <p className="text-center py-10 text-muted-foreground">No FAQs available at the moment.</p>
        )}
      </div>
    </div>
  );
}
