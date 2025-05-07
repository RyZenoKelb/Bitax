import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* Polices et méta-données sont déjà chargées dans _app.tsx */}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
        
        {/* Injection du script pour initialiser le background étoilé */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                // Importer et exécuter le script de fond étoilé après chargement de la page
                import('/scripts/starBackground.js')
                  .then(module => {
                    if (typeof module.setupStarBackground === 'function') {
                      module.setupStarBackground();
                    }
                  })
                  .catch(err => console.warn('Could not load star background:', err));
              });
            `,
          }}
        />
      </body>
    </Html>
  );
}