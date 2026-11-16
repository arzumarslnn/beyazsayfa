import { ResetForm } from "@/components/AuthForms";
export const metadata = { title: "Yeni şifre" };
export default function Page() {
  return <section className="wrap max-w-md py-16"><h1 className="mb-8 text-4xl">Yeni şifre belirle</h1><ResetForm /></section>;
}
