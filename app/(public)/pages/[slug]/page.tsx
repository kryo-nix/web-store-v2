import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PageDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({
    where: { slug },
  });

  if (!page || !page.isActive) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
          {page.content}
        </div>
      </div>
    </div>
  );
}
