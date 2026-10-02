import { homeFontVars } from "./fonts";
import "./styles/base.css";

/**
 * Root of the Home page (`/`). Applies the Home-only font variables and the
 * `.hv2` scope that every Home v2 style hangs off — nothing styled by
 * components/home-v2 can match outside this element.
 */
export default function HomeRoot({ children }: { children: React.ReactNode }) {
  return <div className={`hv2 ${homeFontVars}`}>{children}</div>;
}
