import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function HyvorTalk({ displayClass, fileData }: QuartzComponentProps) {
  // Utiliser le slug de la page comme identifiant unique
  const pageId = fileData.slug || "index"
  
  return (
    <div class={displayClass}>
      <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--gray, #e0e0e0);">
        <h2 style="margin-bottom: 1.5rem;">Commentaires</h2>
        <div id="hyvor-talk-container"></div>
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const container = document.getElementById('hyvor-talk-container');
              if (!container) return;
              
              // Créer l'élément de commentaires
              const comments = document.createElement('hyvor-talk-comments');
              comments.setAttribute('website-id', '11990');
              comments.setAttribute('page-id', '${pageId}');
              comments.setAttribute('loading', 'default');
              
              // Insérer dans le conteneur
              container.appendChild(comments);
              
              // Charger le script Hyvor Talk s'il n'est pas déjà chargé
              if (!document.querySelector('script[src*="talk.hyvor.com/embed"]')) {
                const script = document.createElement('script');
                script.src = 'https://talk.hyvor.com/embed/embed.js';
                script.type = 'module';
                script.async = true;
                document.head.appendChild(script);
              }
            })();
          `,
        }}
      />
    </div>
  )
}

export default (() => HyvorTalk) satisfies QuartzComponentConstructor
