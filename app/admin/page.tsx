import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>Welcome back, {session.user?.name}. Please select a management menu from the sidebar.</p>
    </div>
  );
}
