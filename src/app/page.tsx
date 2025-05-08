export default function Home() {
    // Cette page est maintenant un simple redirecteur
    // La vraie landing page est dans (landing)/page.tsx
    return null;
  }
  
  // Redirection côté serveur
  export const dynamic = 'force-dynamic';
  export async function generateMetadata() {
    return { title: 'Redirection...' };
  }