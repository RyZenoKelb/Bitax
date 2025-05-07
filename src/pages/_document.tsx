import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* Polices et méta-données sont déjà chargées dans _app.tsx */}
      </Head>
      <body className="antialiased">
        {/* ⬇️ SCRIPT POUR FORCER LE THÈME AVANT LE PREMIER PAINT */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    const theme = localStorage.getItem('bitax-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const html = document.documentElement;
    if (theme === 'dark' || (!theme && prefersDark)) {
      html.classList.add('dark');
    } else {
      html.classList.add('light');
    }
  } catch(e) {}
})();
            `
          }}
        />
        
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
