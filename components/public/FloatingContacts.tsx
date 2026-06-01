import { MessageCircle as WhatsappIcon, Send as TelegramIcon } from 'lucide-react';

export default function FloatingContacts({ settings }: { settings: any }) {
  return (
    <div className="fixed bottom-6 left-6 flex flex-col gap-3 z-[90]">
      {settings.whatsapp && (
        <a 
          href={`https://wa.me/${settings.whatsapp}`} 
          target="_blank" 
          className="bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform"
        >
          <WhatsappIcon size={24} />
        </a>
      )}
      {settings.telegram && (
        <a 
          href={`https://t.me/${settings.telegram}`} 
          target="_blank" 
          className="bg-[#0088cc] text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform"
        >
          <TelegramIcon size={24} />
        </a>
      )}
    </div>
  );
}
