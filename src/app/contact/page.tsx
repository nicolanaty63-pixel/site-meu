import { pageMeta } from "@/lib/seo";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import Icon from "@/components/ui/Icon";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Contact — Free Quotes for Builders in Hertfordshire",
  description:
    "Contact Nicolla Contractors Ltd for a free, no-obligation quote. Bathroom, kitchen, tiling, flooring and refurbishment specialists serving Hertfordshire and North London.",
  path: "/contact",
});

const details = [
  { icon: "phone" as const, label: "Call us", value: site.phoneDisplay, href: site.phoneHref },
  { icon: "mail" as const, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: "pin" as const, label: "Based in", value: `${site.baseTown}, ${site.region}` },
  { icon: "clock" as const, label: "Opening hours", value: site.hours },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your project"
        subtitle="Free, no-obligation quotes. We typically reply within 24 hours."
      />

      <section className="py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Info */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {details.map((d) => {
                  const inner = (
                    <>
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/10 text-gold">
                        <Icon name={d.icon} className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-xs text-concrete">
                          {d.label}
                        </span>
                        <span className="block font-medium text-white">
                          {d.value}
                        </span>
                      </span>
                    </>
                  );
                  return d.href ? (
                    <a
                      key={d.label}
                      href={d.href}
                      className="flex items-center gap-4 rounded-xl border border-white/10 bg-surface/40 p-4 transition-colors hover:border-gold/40"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div
                      key={d.label}
                      className="flex items-center gap-4 rounded-xl border border-white/10 bg-surface/40 p-4"
                    >
                      {inner}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-surface/40 p-5">
                <h3 className="text-sm font-semibold text-white">
                  Areas we cover
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {site.serves.map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-concrete"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <Reveal>
                <ContactForm />
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
