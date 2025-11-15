import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function HyvorTalk({ displayClass }: QuartzComponentProps) {
  return (
    <div class={displayClass}>
      <script
        async
        src="https://talk.hyvor.com/embed/embed.js"
        type="module"
      ></script>
      {/* Conteneur pour les commentaires - sera rempli dynamiquement */}
      <div id="hyvor-talk-container"></div>
    </div>
  )
}

// Script pour gérer le routage SPA de Quartz avec création dynamique du composant
HyvorTalk.afterDOMLoaded = `
  function loadHyvorTalk() {
    setTimeout(() => {
      const container = document.getElementById('hyvor-talk-container');
      if (!container) return;
      
      // Supprimer l'ancien composant s'il existe
      const oldComments = container.querySelector('hyvor-talk-comments');
      if (oldComments) {
        oldComments.remove();
      }
      
      // Créer un nouveau composant avec le page-id correct
      const comments = document.createElement('hyvor-talk-comments');
      comments.setAttribute('website-id', '11990');
      comments.setAttribute('page-id', window.location.pathname);
      
      // Insérer dans le conteneur
      container.appendChild(comments);
      
      console.log('Hyvor Talk chargé pour la page:', window.location.pathname);
    }, 50); // Délai de 50ms pour permettre au DOM de se stabiliser
  }
  
  // Charger au démarrage initial
  loadHyvorTalk();
  
  // Recharger à chaque navigation SPA
  document.addEventListener("nav", () => {
    loadHyvorTalk();
  });
  
  // Le nettoyage est géré par la fonction loadHyvorTalk() elle-même (suppression de l'ancien composant)
  // Nous n'avons pas besoin de window.addCleanup ici.
`;

export default (() => HyvorTalk) satisfies QuartzComponentConstructor
