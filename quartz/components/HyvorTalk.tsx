import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function HyvorTalk({ fileData, displayClass }: QuartzComponentProps) {
  // Utiliser le slug de la page comme identifiant unique pour Hyvor Talk
  const pageId = fileData.slug
  
  return (
    <div class={displayClass}>
      <script
        async
        src="https://talk.hyvor.com/embed/embed.js"
        type="module"
      ></script>
      <hyvor-talk-comments
        website-id="11990"
        page-id={pageId} // Utilisation du slug unique de la page
      ></hyvor-talk-comments>
      {/* Le script JS côté client n'est plus nécessaire car le page-id est défini côté serveur */}
    </div>
  )
}

export default (() => HyvorTalk) satisfies QuartzComponentConstructor
