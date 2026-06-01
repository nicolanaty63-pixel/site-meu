import type { IconName } from "@/lib/data";

type Props = {
  name: IconName | "arrow" | "phone" | "mail" | "pin" | "whatsapp" | "quote" | "menu" | "close" | "chevron";
  className?: string;
};

const paths: Record<string, React.ReactNode> = {
  bath: (
    <>
      <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3Z" />
      <path d="M6 12V6a2 2 0 0 1 2-2 2 2 0 0 1 2 2" />
      <path d="M6 19v1m12-1v1" />
    </>
  ),
  kitchen: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      <path d="M4 10h16M9 4v6m6-6v6M8 15h1m6 0h1" />
    </>
  ),
  tile: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="1" />
      <path d="M12 3.5v17M3.5 12h17" />
    </>
  ),
  plank: (
    <>
      <path d="M3 6.5h18M3 12h18M3 17.5h18" />
      <path d="M8 6.5v5.5m6-5.5v5.5m-3 0v5.5" />
    </>
  ),
  floor: (
    <>
      <path d="M3 8l9-4 9 4-9 4-9-4Z" />
      <path d="M3 8v8l9 4 9-4V8" />
    </>
  ),
  build: (
    <>
      <path d="M14.7 6.3a4 4 0 0 0-5.2 5.2L4 17l3 3 5.5-5.5a4 4 0 0 0 5.2-5.2l-2.4 2.4-2.1-2.1 2.5-2.3Z" />
    </>
  ),
  extension: (
    <>
      <path d="M3 21V9l6-4 6 4v12" />
      <path d="M12 21v-8h9v8" />
      <path d="M2 21h20" />
    </>
  ),
  loft: (
    <>
      <path d="M3 12l9-7 9 7" />
      <path d="M5 10.5V20h14V10.5" />
      <rect x="10" y="13" width="4" height="4" />
    </>
  ),
  roof: (
    <>
      <path d="M2 13 12 4l10 9" />
      <path d="M5 11v9h14v-9" />
      <path d="M16 6V4h2v3.6" />
    </>
  ),
  landscape: (
    <>
      <path d="M12 21v-8" />
      <path d="M12 13c0-3.3-2.7-6-6-6 0 3.3 2.7 6 6 6Z" />
      <path d="M12 15c0-2.8 2.2-5 5-5 0 2.8-2.2 5-5 5Z" />
    </>
  ),
  paving: (
    <>
      <path d="M4 8h16M3.5 12h17M3 16h18" />
      <path d="M9 8v8m6-8v8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  broom: (
    <>
      <path d="M19 4l-7 7" />
      <path d="M6.5 20l-2-2 4.5-4.5a3 3 0 0 1 4.2 0l.3.3a3 3 0 0 1 0 4.2L9 22" />
      <path d="M9 14l1 1M7 17l1 1" />
    </>
  ),
  ruler: (
    <>
      <rect x="3" y="8" width="18" height="8" rx="1" transform="rotate(0 12 12)" />
      <path d="M7 8v3m4-3v4m4-4v3" />
    </>
  ),
  handshake: (
    <>
      <path d="M3 12l4-4 5 2 5-2 4 4" />
      <path d="M7 8l3 6 2-1 2 1 3-6" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  arrow: <path d="M5 12h14m-6-6l6 6-6 6" />,
  chevron: <path d="M6 9l6 6 6-6" />,
  phone: (
    <path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L17 11l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.5-6.5-10a6.5 6.5 0 0 1 13 0c0 4.5-6.5 10-6.5 10Z" />
      <circle cx="12" cy="11" r="2.3" />
    </>
  ),
  whatsapp: (
    <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Zm4.3 12.4c-.2.5-1 .9-1.4 1-.4 0-.8.2-2.6-.6-2.2-1-3.6-3.2-3.7-3.4-.1-.2-.9-1.2-.9-2.3s.6-1.6.8-1.9c.2-.2.4-.3.6-.3h.4c.1 0 .3 0 .5.4l.7 1.6c0 .2.1.3 0 .5l-.3.5-.3.3c-.1.1-.2.3-.1.5.1.2.5 1 1.2 1.6.9.8 1.6 1 1.8 1.1.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.5.7c.2.1.4.2.4.3.1.1.1.6 0 1.1Z" />
  ),
  quote: (
    <path d="M7 7h4v6c0 2.2-1.3 3.6-3.5 4L7 19.5V17c1-.3 1.5-1 1.5-2H7V7Zm8 0h4v6c0 2.2-1.3 3.6-3.5 4l-.5-1.5c1-.3 1.5-1 1.5-2H15V7Z" />
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
};

export default function Icon({ name, className = "h-6 w-6" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] ?? null}
    </svg>
  );
}
