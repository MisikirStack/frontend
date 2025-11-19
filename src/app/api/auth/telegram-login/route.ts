import { NextResponse } from "next/server";
import crypto from "crypto";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

function verifyTelegramWebAppData(telegramData: any) {
  if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is not set");
  }

  const { hash, ...data } = telegramData;
  
  if (!hash) {
    return false;
  }

  const dataCheckString = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");

  const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest();
  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return hmac === hash;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Verify the Telegram data
    const isValid = verifyTelegramWebAppData(body);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid Telegram data" },
        { status: 401 }
      );
    }

    // 2. If valid, we need to authenticate with the backend
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://victorious-nourishment-production-e8b9.up.railway.app';
    
    const backendResponse = await fetch(`${backendUrl}/api/auth/social/telegram/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || "Backend authentication failed" },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Telegram login error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
