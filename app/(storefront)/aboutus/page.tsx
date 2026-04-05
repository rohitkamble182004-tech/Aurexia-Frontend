import Link from "next/link";

const sections = [
  { label: "The House", href: "/aboutus/the-house" },
  { label: "Notes", href: "/aboutus/notes" },
  { label: "Craftsmanship", href: "/aboutus/craftsmanship" },
  { label: "Responsibility", href: "/aboutus/responsibility" },
  { label: "Care Instruction", href: "/aboutus/care" },
];

export default function AboutPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-32">
      <h1 className="text-4xl font-light tracking-tight mb-16">
        About Us
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {sections.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group"
          >
            <p className="text-xl font-light group-hover:opacity-70 transition">
              {item.label}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
