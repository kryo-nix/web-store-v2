import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import axios from 'axios';

const TRIGGER_KEYWORDS = ['beli', 'order', 'checkout', 'pembayaran', 'invoice', 'transfer', 'tertarik'];

async function sendDiscordNotification(message: string, userMessage: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('Discord Webhook URL is not configured');
    return;
  }

  try {
    await axios.post(webhookUrl, {
      content: `🔔 **New Sales Intent Detected!**`,
      embeds: [
        {
          title: "Detail Pesanan/Pertanyaan",
          color: 5814783, 
          fields: [
            { name: "User Message", value: userMessage },
            { name: "Bot Response", value: message },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    });
  } catch (error) {
    console.error('Discord Error:', error);
  }
}

export async function POST(req: Request) {
  try {
    const { message, userId } = await req.json();

    const hasTrigger = TRIGGER_KEYWORDS.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    const faq = await prisma.faq.findFirst({
      where: {
        AND: [
          { question: { contains: message, mode: 'insensitive' } },
          { isActive: true }
        ]
      }
    });

    let response = "";

    if (faq) {
      response = faq.answer;
    } else {
      const product = await prisma.product.findFirst({
        where: {
          AND: [
            { name: { contains: message, mode: 'insensitive' } },
            { isActive: true }
          ]
        }
      });

      if (product) {
        response = `Yes, we have ${product.name}. It costs $${product.price}. You can check it here: /products/${product.slug}`;
      } else {
        response = "I'm not sure about that. Please contact our admin via WhatsApp or Telegram for more information!";
      }
    }

    if (hasTrigger) {
      await sendDiscordNotification(response, message);
    }

    await prisma.chatHistory.create({
      data: {
        userId: userId || 'anonymous',
        message: message,
        response: response,
      }
    });

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
