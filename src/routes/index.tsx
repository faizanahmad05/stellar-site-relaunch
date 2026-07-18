import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { MAJESTIC_CSS, initMajesticSite } from "@/lib/majestic-site";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const cleanup = initMajesticSite(rootRef.current);
    return cleanup;
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MAJESTIC_CSS }} />
      <div className="majestic-root" ref={rootRef}>
        <div id="maj-app" />
        <a
          className="wa-float"
          id="waFloat"
          href="#"
          target="_blank"
          rel="noopener"
          aria-label="Chat on WhatsApp"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.42a9.9 9.9 0 0 0 4.62 1.14h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.02a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.07.81.82-3-.2-.31a8.13 8.13 0 0 1-1.25-4.3c0-4.49 3.66-8.14 8.15-8.14 4.48 0 8.14 3.65 8.14 8.14 0 4.49-3.66 8.11-8.16 8.11Zm4.47-6.1c-.24-.12-1.44-.71-1.67-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
          </svg>
        </a>
        <div id="maj-toast" className="maj-toast" />
      </div>
    </>
  );
}
