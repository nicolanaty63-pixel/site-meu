/**
 * The three glow layers of a BorderGlow contact card (contact.css):
 * the gradient ring, the soft-light fill (desktop only) and the edge light.
 * Each is a clipped wrapper → a rotating "cone" (static conic mask, animated
 * transform) → a counter-rotating fill that carries the static gradients and
 * shadows. Every per-frame change is a compositor transform; nothing is
 * repainted while the glow travels.
 */
export default function GlowLayers() {
  return (
    <>
      <span className="hv-glow hv-glow-ring" aria-hidden="true">
        <span className="hv-cone">
          <span className="hv-cone-fill" />
        </span>
      </span>
      <span className="hv-glow hv-glow-fill" aria-hidden="true">
        <span className="hv-cone">
          <span className="hv-cone-fill" />
        </span>
      </span>
      <span className="hv-edge-light" aria-hidden="true">
        <span className="hv-cone">
          <span className="hv-cone-fill" />
        </span>
      </span>
    </>
  );
}
