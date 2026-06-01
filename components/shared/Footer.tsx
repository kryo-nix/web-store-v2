import Link from 'next/link';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';

export default function Footer({ settings }: { settings: any }) {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4">{settings.siteName}</h3>
          <p className="text-sm text-muted-foreground">
            Premium digital products and services for your business and personal needs.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link href="/terms" className="hover:text-primary">Terms & Conditions</Link></li>
            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
          <div className="flex gap-4">
            {settings.socials.map((social: any, i: number) => (
              <a key={i} href={social.url} className="text-muted-foreground hover:text-primary">
                {social.platform === 'facebook' && <Facebook size={20} />}
                {social.platform === 'twitter' && <Twitter size={20} />}
                {social.platform === 'instagram' && <Instagram size={20} />}
                {social.platform === 'github' && <Github size={20} />}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
      </div>
    </footer>
  );
}
