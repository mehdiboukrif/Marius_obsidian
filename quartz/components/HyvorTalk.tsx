import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function HyvorTalk({ displayClass }: QuartzComponentProps) {
  return (
    <div class={displayClass}>
      {/* Iframe qui chargera la page de commentaires isolée */}
      <iframe 
        id="hyvor-talk-iframe"
        style={{ width: '100%', border: 'none', minHeight: '500px' }}
        title="Hyvor Talk Comments"
      ></iframe>
    </div>
  )
}

// Script pour gérer le routage SPA de Quartz avec l'iframe
HyvorTalk.afterDOMLoaded = `
  const iframe = document.getElementById('hyvor-talk-iframe');
  const baseIframeSrc = './static/hyvor-comments.html';
  
  function updateIframeSrc() {
    // Le page-id est l'URL relative de la page (ex: /Marius_obsidian/page-1)
    const pageId = window.location.pathname;
    
    // Construire l'URL de l'iframe avec le page-id en paramètre
    const newSrc = \`\${baseIframeSrc}?page_id=\${encodeURIComponent(pageId)}\`;
    
    // Mettre à jour l'iframe
    if (iframe.src !== newSrc) {
      iframe.src = newSrc;
      console.log('Hyvor Talk Iframe rechargé pour la page:', pageId);
    }
  }
  
  // Charger au démarrage initial
  updateIframeSrc();

  // Recharger à chaque navigation SPA
  document.addEventListener("nav", () => {
    updateIframeSrc();
  });
`;

export default (() => HyvorTalk) satisfies QuartzComponentConstructor
