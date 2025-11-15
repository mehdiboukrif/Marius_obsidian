import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function HyvorTalk({ displayClass }: QuartzComponentProps) {
  return (
    <div class={displayClass}>
      <script
        async
        src="https://talk.hyvor.com/embed/embed.js"
        type="module"
      ></script>
      <hyvor-talk-comments
        website-id="11990"
        // Le page-id sera défini dynamiquement par le script ci-dessous
      ></hyvor-talk-comments>
    </div>
  )
}

// Script pour gérer le routage SPA de Quartz avec l'API HyvorTalk.reload()
HyvorTalk.afterDOMLoaded = `
  function reloadHyvorTalk() {
    // 1. Définir le page-id avec le chemin d'accès unique
    const comments = document.querySelector('hyvor-talk-comments');
    if (comments) {
      comments.setAttribute('page-id', window.location.pathname);
    }

    // 2. Tenter de recharger le widget Hyvor Talk
    let attempts = 0;
    const maxAttempts = 20; // Tenter pendant 2 secondes (20 * 100ms)

    const checkAndReload = setInterval(() => {
      if (window.HyvorTalk && window.HyvorTalk.reload) {
        // Passer l'identifiant de la page et l'URL pour forcer la mise à jour
        window.HyvorTalk.reload(window.location.pathname, window.location.href);
        clearInterval(checkAndReload);
        console.log('Hyvor Talk rechargé pour la page:', window.location.pathname);
      } else if (attempts >= maxAttempts) {
        clearInterval(checkAndReload);
        console.error('Hyvor Talk API non disponible après plusieurs tentatives.');
      }
      attempts++;
    }, 100);
  }
  
  // Charger au démarrage initial
  // Le widget se charge automatiquement, nous n'avons qu'à définir le page-id
  const initialComments = document.querySelector('hyvor-talk-comments');
  if (initialComments) {
    initialComments.setAttribute('page-id', window.location.pathname);
  }

  // Recharger à chaque navigation SPA
  document.addEventListener("nav", () => {
    reloadHyvorTalk();
  });
`;

export default (() => HyvorTalk) satisfies QuartzComponentConstructor
