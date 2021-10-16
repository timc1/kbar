import * as React from "react";

export function classnames(...args: (string | undefined | null)[]) {
  return args.filter(Boolean).join(" ");
}

export function useAnalytics() {
  React.useEffect(() => {
    const dev = window.location.host.includes("localhost");

    if (!dev) {
      const script = document.createElement("script");
      script.src = "https://www.googletagmanager.com/gtag/js?id=G-TGC84TSLJZ";

      document.body.appendChild(script);

      script.onload = () => {
        // @ts-ignore
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          // @ts-ignore
          dataLayer.push(arguments);
        }
        // @ts-ignore
        gtag("js", new Date());
        // @ts-ignore
        gtag("config", "G-TGC84TSLJZ");
      };

      return () => {
        document.removeChild(script);
      };
    }
  }, []);
}
