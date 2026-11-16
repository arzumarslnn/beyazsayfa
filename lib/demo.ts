// Demo hesaplar: siteyi gerçek üyelik açmadan denemek için.
// Kapatmak için Vercel'de DEMO_MODE=off ekleyin. Yayına çıkmadan önce demo hesapları silin.
// Bu dosya yalnızca sunucuda kullanılır; şifreler tarayıcıya gönderilmez.
export const DEMO_DOMAIN = "demo.beyazsayfa.com";
export const demoEnabled = () => process.env.DEMO_MODE !== "off";

export const DEMO_ACCOUNTS = {
  ogrenci: { email: `ogrenci@${DEMO_DOMAIN}`, password: "8Evrc2DPgGOMN9uTff74fVDo" },
  veli: { email: `veli@${DEMO_DOMAIN}`, password: "ANIM3LRRS3_nkPhEnjxvHwIC" },
  yonetim: { email: `yonetim@${DEMO_DOMAIN}`, password: "T4h7qzXoOfAFD0KDPLEsXh8M" },
} as const;

export const isDemoEmail = (email?: string | null) => !!email && email.endsWith(`@${DEMO_DOMAIN}`);
