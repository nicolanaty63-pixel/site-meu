import { unstable_noStore as noStore } from "next/cache";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Icon from "@/components/ui/Icon";
import ReviewForm from "@/components/reviews/ReviewForm";
import { listReviews, type Review } from "@/lib/reviews";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-gold" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="star"
          className={`h-4 w-4 ${i < n ? "fill-current" : "text-white/20"}`}
        />
      ))}
    </div>
  );
}

const fmtDate = (ms: number) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(ms));

function ReviewCard({ r, delay }: { r: Review; delay: number }) {
  return (
    <Reveal delay={delay}>
      <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-surface/40 p-7">
        <div className="flex items-center justify-between gap-3">
          <Stars n={r.rating} />
          <time
            dateTime={new Date(r.createdAt).toISOString()}
            className="text-xs text-concrete-dark"
          >
            {fmtDate(r.createdAt)}
          </time>
        </div>
        <blockquote className="mt-4 flex-1 whitespace-pre-line text-sm leading-relaxed text-concrete">
          {r.text}
        </blockquote>
        <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/10 font-display font-bold text-gold">
            {r.name.charAt(0).toUpperCase()}
          </span>
          <div className="text-sm">
            <div className="font-medium text-white">{r.name}</div>
            {r.service && (
              <div className="text-concrete-dark">{r.service}</div>
            )}
          </div>
        </div>
      </figure>
    </Reveal>
  );
}

function EmptyState() {
  return (
    <Reveal>
      <div className="rounded-2xl border border-dashed border-white/15 bg-surface/30 px-8 py-16 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
          <Icon name="quote" className="h-7 w-7" />
        </div>
        <p className="mt-5 text-lg font-semibold text-white">
          No customer reviews yet
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-concrete">
          Be the first to share your experience using the form above.
        </p>
      </div>
    </Reveal>
  );
}

export default async function CustomerReviews() {
  // Always read fresh — a submitted review must show up immediately.
  noStore();
  let reviews: Review[] = [];
  try {
    reviews = await listReviews(60);
  } catch (err) {
    console.error("[CustomerReviews] failed to load", err);
  }

  return (
    <>
      {/* Submission form */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            center
            eyebrow="Leave a review"
            title="Share your experience"
            subtitle="Worked with Nicolla Contractors? Tell others what it was like — your review goes live on this page right away."
          />
          <div className="mt-10">
            <ReviewForm />
          </div>
        </div>
      </section>

      {/* Submitted reviews feed */}
      <section className="pb-20">
        <SectionHeading
          center
          eyebrow="Customer reviews"
          title="Reviews from our customers"
        />
        <div className="mt-12">
          {reviews.length === 0 ? (
            <div className="mx-auto max-w-2xl">
              <EmptyState />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r, i) => (
                <ReviewCard key={r.id} r={r} delay={(i % 3) * 0.06} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
