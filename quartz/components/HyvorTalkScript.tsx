import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function HyvorTalkScript({ displayClass }: QuartzComponentProps) {
  return (
    <div class={displayClass} id="hyvor-talk-root">
      {/* Le conteneur sera rempli par le script */}
    </div>
  )
}

// Script adapté pour Quartz SPA
HyvorTalkScript.afterDOMLoaded = `
(function() {
  'use strict';

  const CONFIG = {
    websiteId: '11990',
    debug: true,
  };

  function log(...args) {
    if (CONFIG.debug) {
      console.log('[Hyvor Talk]', ...args);
    }
  }

  function error(...args) {
    console.error('[Hyvor Talk]', ...args);
  }

  function getPageId() {
    // Utiliser l'URL complète comme identifiant unique
    return window.location.href;
  }

  function loadHyvorScript() {
    return new Promise((resolve, reject) => {
      // Vérifier si le script est déjà chargé
      if (document.querySelector('script[src*="talk.hyvor.com/embed"]')) {
        log('Hyvor script already loaded');
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://talk.hyvor.com/embed/embed.js';
      script.type = 'module';
      script.async = true;
      
      script.onload = () => {
        log('Hyvor script loaded successfully');
        resolve();
      };
      
      script.onerror = () => {
        error('Failed to load Hyvor script');
        reject(new Error('Failed to load Hyvor Talk script'));
      };

      document.head.appendChild(script);
    });
  }

  function createCommentsElement() {
    const comments = document.createElement('hyvor-talk-comments');
    comments.setAttribute('website-id', CONFIG.websiteId);
    comments.setAttribute('page-id', getPageId());
    comments.setAttribute('loading', 'default');
    return comments;
  }

  function insertComments() {
    // Utiliser le conteneur créé par le composant Quartz
    const container = document.getElementById('hyvor-talk-root');
    
    if (!container) {
      error('Hyvor Talk root container not found');
      return false;
    }

    // Vérifier si les commentaires existent déjà
    if (container.querySelector('.hyvor-talk-wrapper')) {
      log('Comments already inserted, skipping...');
      return false;
    }

    log('Inserting comments into container');

    // Créer le wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'hyvor-talk-wrapper';
    wrapper.style.marginTop = '3rem';
    wrapper.style.paddingTop = '2rem';
    wrapper.style.borderTop = '1px solid var(--gray, #e0e0e0)';

    // Ajouter un titre
    const header = document.createElement('h2');
    header.textContent = 'Commentaires';
    header.style.marginBottom = '1.5rem';
    wrapper.appendChild(header);

    // Créer et ajouter l'élément de commentaires
    const comments = createCommentsElement();
    wrapper.appendChild(comments);

    // Insérer dans le conteneur
    container.appendChild(wrapper);

    log('Comments inserted successfully for page:', getPageId());
    return true;
  }

  async function init() {
    log('Initializing Hyvor Talk integration...');

    try {
      // Charger le script Hyvor
      await loadHyvorScript();

      // Insérer les commentaires
      insertComments();

      log('Hyvor Talk initialized successfully');
    } catch (err) {
      error('Initialization failed:', err);
    }
  }

  // Gestion de la navigation SPA de Quartz
  let lastUrl = location.href;
  let isInitializing = false;
  
  // Écouter l'événement 'nav' de Quartz
  document.addEventListener("nav", () => {
    const url = location.href;
    if (url !== lastUrl && !isInitializing) {
      lastUrl = url;
      isInitializing = true;
      log('Navigation detected, reinitializing...');
      
      // Vider complètement le conteneur pour éviter les conflits
      const container = document.getElementById('hyvor-talk-root');
      if (container) {
        container.innerHTML = '';
      }
      
      // Réinitialiser après un délai pour s'assurer que le script Hyvor Talk a terminé
      setTimeout(() => {
        init();
        isInitializing = false;
      }, 300);
    }
  });

  // Initialisation au chargement
  init();

})();
`;

export default (() => HyvorTalkScript) satisfies QuartzComponentConstructor
