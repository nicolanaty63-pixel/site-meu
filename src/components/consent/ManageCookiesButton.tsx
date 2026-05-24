"use client";

// Reopens the cookie preferences modal from anywhere (e.g. the footer).
export default function ManageCookiesButton({
  className,
  children = "Cookie preferences",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new Event("open-cookie-preferences"))
      }
      className={className}
    >
      {children}
    </button>
  );
}
