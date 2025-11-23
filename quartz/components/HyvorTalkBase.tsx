import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function HyvorTalkBase({ displayClass, fileData }: QuartzComponentProps) {
  const containerId = "hyvor-talk-container"
  
  // Utiliser le slug de la page comme identifiant unique
  const pageId = fileData.slug || "index"
  
  return (
    <div class={displayClass}>
      <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--gray, #e0e0e0);">
        <h2 style="margin-bottom: 1.5rem;">Commentaires</h2>
        <div id={containerId}></div>
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: `
            import { HyvorTalk } from '/node_modules/@hyvor/hyvor-talk-base/dist/index.js';

            const containerId = '${containerId}';
            const websiteId = '14523'; // Utiliser le dernier ID fourni
            const pageId = '${pageId}';
            const pageUrl = window.location.href;

            let hyvorTalkInstance = null;

            function initializeHyvorTalk() {
                const container = document.getElementById(containerId);
                if (!container) return;

                // 1. Détruire l'ancienne instance si elle existe
                if (hyvorTalkInstance) {
                    // La bibliothèque de base ne fournit pas de méthode destroy() publique,
                    // nous devons donc vider le conteneur pour forcer la réinitialisation.
                    container.innerHTML = '';
                    hyvorTalkInstance = null;
                }

                // 2. Créer une nouvelle instance
                hyvorTalkInstance = new HyvorTalk({
                    websiteId: websiteId,
                    pageId: pageId,
                    pageUrl: pageUrl,
                    container: container,
                    // Forcer le rechargement du script d'intégration pour s'assurer que le widget est chargé
                    loadScript: true, 
                });
            }

            // Initialisation au chargement
            initializeHyvorTalk();

            // Gestion de la navigation SPA de Quartz
            document.addEventListener("nav", () => {
                // Le conteneur est recréé par Quartz, nous devons attendre qu'il soit dans le DOM
                setTimeout(() => {
                    // Nous devons trouver le nouveau conteneur après la navigation
                    const newContainer = document.getElementById(containerId);
                    if (newContainer) {
                        // Mettre à jour l'URL et l'ID de la page
                        const newPageId = window.location.pathname.replace(/\\/$/, '') || 'index';
                        const newPageUrl = window.location.href;

                        // Recréer l'instance avec les nouvelles données
                        if (hyvorTalkInstance) {
                            // Si l'instance existe, nous la détruisons et la recréons
                            newContainer.innerHTML = '';
                            hyvorTalkInstance = null;
                        }

                        hyvorTalkInstance = new HyvorTalk({
                            websiteId: websiteId,
                            pageId: newPageId,
                            pageUrl: newPageUrl,
                            container: newContainer,
                            loadScript: true,
                        });
                    }
                }, 100); // Délai pour s'assurer que le DOM est mis à jour
            });
            
        `,
        }}
      />
    </div>
  )
}

export default (() => HyvorTalkBase) satisfies QuartzComponentConstructor
