import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function HyvorTalk({ displayClass }: QuartzComponentProps) {
  return (
    <div class={displayClass}>
      {/* Conteneur principal pour le widget Hyvor Talk */}
      <div id="hyvor-talk-wrapper"></div>
    </div>
  )
}

// Script pour gérer le routage SPA de Quartz avec recréation complète du script
HyvorTalk.afterDOMLoaded = `
  const wrapper = document.getElementById('hyvor-talk-wrapper');
  if (!wrapper) return;

  function loadHyvorTalk() {
    // 1. Nettoyer le conteneur
    wrapper.innerHTML = '';

    // 2. Créer l'élément de commentaires
    const comments = document.createElement('hyvor-talk-comments');
    comments.setAttribute('website-id', '11990');
    comments.setAttribute('page-id', window.location.pathname);
    
    // 3. Créer l'élément script pour forcer le rechargement du script d'intégration
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('src', 'https://talk.hyvor.com/embed/embed.js');
    script.setAttribute('type', 'module');

    // 4. Insérer les éléments dans le conteneur
    wrapper.appendChild(comments);
    wrapper.appendChild(script);
    
    console.log('Hyvor Talk complètement rechargé pour la page:', window.location.pathname);
  }
  
  // Charger au démarrage initial
  loadHyvorTalk();

  // Recharger à chaque navigation SPA
  document.addEventListener("nav", () => {
    loadHyvorTalk();
  });
`;

export default (() => HyvorTalk) satisfies QuartzComponentConstructor
