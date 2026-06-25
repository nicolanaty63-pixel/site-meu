/**
 * Serialise JSON-LD so it can never break out of a <script> context.
 *
 * `JSON.stringify` does NOT neutralise `</script>`, `<!--`, or the line/para
 * separators — so a JSON-LD block built from any user/CMS-controlled string
 * could otherwise inject markup. Escaping `<`, `>`, `&` and U+2028/2029 makes
 * `dangerouslySetInnerHTML` for JSON-LD safe by construction (defence-in-depth,
 * even where the source data is currently static).
 */
export function jsonLdHtml(data: unknown): string {
  let s = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
  // U+2028 (line sep) and U+2029 (para sep) — built from code points so no
  // invisible characters live in this source file.
  s = s.split(String.fromCharCode(0x2028)).join("\\u2028");
  s = s.split(String.fromCharCode(0x2029)).join("\\u2029");
  return s;
}
