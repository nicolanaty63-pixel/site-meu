// Client helper shared by ContactForm and QuoteForm: serialises the form and
// posts it to /api/lead. Throws with a user-readable message on any failure so
// the forms can show an honest error state (never a fake success).

export type LeadResult = { ok: true };

export async function submitLead(
  form: HTMLFormElement,
  source: string,
  mountedAt: number
): Promise<LeadResult> {
  const fd = new FormData(form);
  const payload = {
    name: fd.get("name"),
    phone: fd.get("phone"),
    email: fd.get("email"),
    postcode: fd.get("postcode") ?? "",
    service: fd.get("service"),
    message: fd.get("message") ?? "",
    consent: fd.get("consent") === "on",
    source,
    _hp: fd.get("_hp") ?? "",
    _t: mountedAt,
  };

  let res: Response;
  try {
    res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "We couldn't reach our enquiry system — please check your connection and try again."
    );
  }

  if (!res.ok) {
    let message = "Something went wrong sending your enquiry.";
    try {
      const data = await res.json();
      if (typeof data?.error === "string" && data.error) message = data.error;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }

  return { ok: true };
}
