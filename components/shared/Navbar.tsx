import Link from 'next/link';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ settings }: { settings: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          {settings.logo && <img src={settings.logo} alt="Logo" className="h-8 w-8" />}
          <span>{settings.siteName}</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary">Home</Link>
          <Link href="/products" className="text-sm font-medium hover:text-primary">Products</Link>
          <Link href="/faq" className="text-sm font-medium hover:text-primary">FAQ</Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary">Contact</Link>
          <Link href="/admin" className="flex items-center gap-1 text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full">
            <User size={16} /> Admin
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 py-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/products" onClick={() => setIsOpen(false)}>Products</Link>
          <Link href="/faq" onClick={() => setIsOpen(false)}>FAQ</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
          <Link href="/admin" onClick={() => setIsOpen(false)} className="font-bold text-primary">Admin Login</Link>
        </div>
      )}
    </nav>
  );
}
