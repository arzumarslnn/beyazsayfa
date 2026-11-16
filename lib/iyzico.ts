// iyzico Ödeme Formu (Checkout Form) entegrasyonu, IYZWSv2 kimlik doğrulaması.
import crypto from "crypto";

export const iyzicoReady = () => !!(process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY);

async function call<T = any>(path: string, body: Record<string, unknown>): Promise<T> {
  const apiKey = process.env.IYZICO_API_KEY!;
  const secret = process.env.IYZICO_SECRET_KEY!;
  const base = process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";
  const json = JSON.stringify(body);
  const rnd = `${Date.now()}${Math.random().toString(36).slice(2, 10)}`;
  const signature = crypto.createHmac("sha256", secret).update(rnd + path + json).digest("hex");
  const auth = Buffer.from(`apiKey:${apiKey}&randomKey:${rnd}&signature:${signature}`).toString("base64");
  const r = await fetch(base + path, {
    method: "POST",
    headers: { Authorization: `IYZWSv2 ${auth}`, "x-iyzi-rnd": rnd, "Content-Type": "application/json", Accept: "application/json" },
    body: json,
    cache: "no-store",
  });
  return r.json();
}

export type Buyer = { name: string; surname: string; email: string; phone: string; identityNumber: string; address: string; city: string; ip: string };

export async function initCheckout(o: { orderId: string; price: number; title: string; category: string; userId: string; buyer: Buyer; callbackUrl: string }) {
  const price = o.price.toFixed(2);
  const address = { contactName: `${o.buyer.name} ${o.buyer.surname}`, city: o.buyer.city, country: "Turkey", address: o.buyer.address };
  return call<{ status: string; token?: string; paymentPageUrl?: string; errorMessage?: string }>(
    "/payment/iyzipos/checkoutform/initialize/auth/ecom",
    {
      locale: "tr",
      conversationId: o.orderId,
      price,
      paidPrice: price,
      currency: "TRY",
      basketId: o.orderId,
      paymentGroup: "PRODUCT",
      callbackUrl: o.callbackUrl,
      enabledInstallments: [1, 2, 3, 6],
      buyer: {
        id: o.userId,
        name: o.buyer.name,
        surname: o.buyer.surname,
        gsmNumber: o.buyer.phone,
        email: o.buyer.email,
        identityNumber: o.buyer.identityNumber,
        registrationAddress: o.buyer.address,
        ip: o.buyer.ip,
        city: o.buyer.city,
        country: "Turkey",
      },
      shippingAddress: address,
      billingAddress: address,
      basketItems: [{ id: o.orderId, name: o.title, category1: o.category, itemType: "VIRTUAL", price }],
    }
  );
}

export async function retrieveCheckout(token: string) {
  return call<{ status: string; paymentStatus?: string; paymentId?: string; basketId?: string; paidPrice?: number; errorMessage?: string }>(
    "/payment/iyzipos/checkoutform/auth/ecom/detail",
    { locale: "tr", token }
  );
}
