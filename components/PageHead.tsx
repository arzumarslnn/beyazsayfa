import Photo from "./Photo";
export default function PageHead({ eyebrow, title, lead, photo, tint = "bg-paper", children }: { eyebrow: string; title: string; lead?: string; photo?: string; tint?: string; children?: React.ReactNode }) {
  return (
    <section className={`${tint}`}>
      <div className={`wrap grid items-center gap-10 py-14 md:py-20 ${photo ? "md:grid-cols-[1.2fr_0.8fr]" : ""}`}>
        <div className="flex flex-col gap-5">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {children}
        </div>
        {photo && <Photo id={photo} priority className="aspect-[5/4] rounded-[2.5rem]" />}
      </div>
    </section>
  );
}
