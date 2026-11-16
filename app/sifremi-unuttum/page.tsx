import { ForgotForm } from "@/components/AuthForms";
export const metadata = { title: "Şifremi unuttum" };
export default function Page() {
  return <section className="wrap max-w-md py-16"><h1 className="text-4xl">Şifremi unuttum</h1><p className="lead mb-8 mt-3">E-posta adresinize bir yenileme bağlantısı gönderelim.</p><ForgotForm /></section>;
}
