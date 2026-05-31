import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const settings = await prisma.setting.findMany();
  const settingsMap: Record<string, string> = {};
  settings.forEach(s => {
    settingsMap[s.key] = s.value;
  });

  async function updateSetting(formData: FormData) {
    'use server';
    const key = formData.get('key') as string;
    const value = formData.get('value') as string;

    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    redirect('/admin/settings');
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Website Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">General Info</h2>
          <div className="space-y-4">
            <SettingField label="Site Name" key="site_name" value={settingsMap['site_name'] || ''} action={updateSetting} />
            <SettingField label="Logo URL" key="logo" value={settingsMap['logo'] || ''} action={updateSetting} />
            <SettingField label="Email" key="email" value={settingsMap['email'] || ''} action={updateSetting} />
            <SettingField label="WhatsApp" key="whatsapp" value={settingsMap['whatsapp'] || ''} action={updateSetting} />
            <SettingField label="Telegram" key="telegram" value={settingsMap['telegram'] || ''} action={updateSetting} />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Appearance</h2>
          <div className="space-y-4">
            <SettingField label="Theme Color (Hex)" key="theme_color" value={settingsMap['theme_color'] || '#000000'} action={updateSetting} />
            <SettingField label="Wallpaper Type (color, image, gradient)" key="wallpaper_type" value={settingsMap['wallpaper_type'] || 'color'} action={updateSetting} />
            <SettingField label="Wallpaper Value (Hex/URL/CSS)" key="wallpaper" value={settingsMap['wallpaper'] || ''} action={updateSetting} />
            <SettingField label="Chatbot Active (true/false)" key="chatbot_active" value={settingsMap['chatbot_active'] || 'true'} action={updateSetting} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingField({ label, key, value, action }: { label: string, key: string, value: string, action: any }) {
  return (
    <form action={action} className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <input 
          type="text" 
          name="value" 
          defaultValue={value} 
          className="flex-grow p-2 rounded-lg border border-border bg-background outline-none" 
        />
        <input type="hidden" name="key" value={key} />
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold">Save</button>
      </div>
    </form>
  );
}
