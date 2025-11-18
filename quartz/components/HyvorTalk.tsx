import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function HyvorTalk({ displayClass }: QuartzComponentProps) {
  return (
    <div class={displayClass}>
      <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--gray, #e0e0e0);">
        <h2 style="margin-bottom: 1.5rem;">Commentaires</h2>
        <div id="hyvor-talk-container"></div>
      </div>
    </div>
  )
}

HyvorTalk.afterDOMLoaded = `
  // Charger le script Hyvor Talk une seule fois
  function loadHyvorScript() {
    if (document.querySelector('script[src*="talk.hyvor.com/embed"]')) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://talk.hyvor.com/embed/embed.js';
      script.type = 'module';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Hyvor Talk script'));
      document.head.appendChild(script);
    });
  }

  // Fonction pour insérer les commentaires
  function insertComments() {
    const container = document.getElementById('hyvor-talk-container');
    if (!container) {
      console.error('[Hyvor Talk] Container not found');
      return;
    }

    // Vider le conteneur
    container.innerHTML = '';

    // Créer l'élément de commentaires
    const comments = document.createElement('hyvor-talk-comments');
    comments.setAttribute('website-id', '11990');
    comments.setAttribute('page-id', window.location.href);
    comments.setAttribute('loading', 'default');

    // Insérer dans le conteneur
    container.appendChild(comments);
    
    console.log('[Hyvor Talk] Comments inserted for:', window.location.href);
  }

  // Initialisation
  async function init() {
    try {
      await loadHyvorScript();
      insertComments();
    } catch (err) {
      console.error('[Hyvor Talk] Initialization failed:', err);
    }
  }

  // Initialiser au chargement
  init();

  // Réinitialiser lors de la navigation SPA
  document.addEventListener("nav", () => {
    console.log('[Hyvor Talk] Navigation detected');
    setTimeout(() => {
      insertComments();
    }, 100);
  });
`;

export default (() => HyvorTalk) satisfies QuartzComponentConstructor
