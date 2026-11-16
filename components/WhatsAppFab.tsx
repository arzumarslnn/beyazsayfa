import { SITE, whatsappLink } from "@/lib/site";
export default function WhatsAppFab() {
  return (
    <a href={whatsappLink(`Merhaba, ${SITE.name} hakkında bilgi almak istiyorum.`)} target="_blank" rel="noopener"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3.5 pr-5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 max-sm:pr-3.5"
      aria-label="WhatsApp ile yazın">
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.3 19.4L3 29l6.8-1.8A13 13 0 1 0 16 3zm0 23.6c-2 0-4-.6-5.7-1.6l-.4-.2-4 1 1.1-3.9-.3-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.7 3.7 0 0 0-1.1 2.7 6.4 6.4 0 0 0 1.3 3.4 14.6 14.6 0 0 0 5.6 5c2.1.9 2.9 1 4 .8.6-.1 1.9-.8 2.2-1.5s.3-1.4.2-1.5-.3-.2-.6-.3z"/></svg>
      <span className="max-sm:hidden">WhatsApp'tan yazın</span>
    </a>
  );
}
