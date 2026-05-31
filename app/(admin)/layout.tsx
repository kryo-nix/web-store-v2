import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  MessageSquare, 
  Star, 
  FileText, 
  Image as ImageIcon, 
  Bell, 
  CreditCard, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Products', icon: Package, href: '/admin/products' },
    { name: 'Categories', icon: Layers, href: '/admin/categories' },
    { name: 'FAQ', icon: MessageSquare, href: '/admin/faq' },
    { name: 'Testimonials', icon: Star, href: '/admin/testimonials' },
    { name: 'Pages', icon: FileText, href: '/admin/pages' },
    { name: 'Banners', icon: ImageIcon, href: '/admin/banners' },
    { name: 'Announcements', icon: Bell, href: '/admin/announcements' },
    { name: 'Payments', icon: CreditCard, href: '/admin/payments' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden lg:flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-border">
          Admin Panel
        </div>
        <nav className="flex-grow p-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium hover:bg-muted transition"
            >
              <item.icon size={20} /> {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Link 
            href="/api/auth/signout" 
            className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition"
          >
            <LogOut size={20} /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <h2 className="font-semibold">Management</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{session.user?.name}</span>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
