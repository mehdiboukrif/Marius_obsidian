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

// Script pour gérer le routage SPA de Quartz
HyvorTalk.afterDOMLoaded = `
  document.addEventListener("nav", () => {
    const comments = document.querySelector('hyvor-talk-comments');
    if (comments) {
      // 1. Définir le page-id avec le chemin d'accès unique (y compris le nom du dépôt)
      comments.setAttribute('page-id', window.location.pathname);
      
      // 2. Appeler la fonction de rechargement de Hyvor Talk si elle existe
      if (window.HyvorTalk && window.HyvorTalk.reload) {
        window.HyvorTalk.reload();
      }
    }
  });
  
  // Exécuter une fois au chargement initial
  const initialComments = document.querySelector('hyvor-talk-comments');
  if (initialComments) {
    initialComments.setAttribute('page-id', window.location.pathname);
  }
`;

export default (() => HyvorTalk) satisfies QuartzComponentConstructor
