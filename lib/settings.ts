import { prisma } from './prisma';

export async function getSiteSettings() {
  const settings = await prisma.setting.findMany();
  const settingsMap: Record<string, string> = {};
  
  settings.forEach(s => {
    settingsMap[s.key] = s.value;
  });

  return {
    siteName: settingsMap['site_name'] || 'Digital Store',
    logo: settingsMap['logo'] || '/logo.png',
    themeColor: settingsMap['theme_color'] || '#000000',
    wallpaper: settingsMap['wallpaper'] || '', // can be URL, gradient, or 'video'
    wallpaperType: settingsMap['wallpaper_type'] || 'color', // color, image, gradient, video
    whatsapp: settingsMap['whatsapp'] || '',
    telegram: settingsMap['telegram'] || '',
    email: settingsMap['email'] || '',
    socials: JSON.parse(settingsMap['socials'] || '[]'),
    chatbotActive: settingsMap['chatbot_active'] === 'true',
  };
}
