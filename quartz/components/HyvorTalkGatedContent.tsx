import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function HyvorTalkGatedContent(_: QuartzComponentProps) {
  // Le composant n'a pas besoin de rendre le contenu lui-même.
  // Il sert de marqueur pour le contenu premium.
  // Le contenu sera inséré directement dans le HTML généré par le moteur de rendu de Quartz.
  // Nous allons plutôt créer un composant qui s'assure que le contenu est enveloppé
  // dans une balise div avec l'attribut data-hyvor-talk-gated.

  // ATTENTION: Quartz ne supporte pas les composants qui enveloppent le contenu Markdown
  // de cette manière. La meilleure approche est de créer un composant qui s'insère
  // dans le layout et qui contient la logique de paywall, ou d'utiliser un
  // transformer pour modifier le contenu Markdown.

  // Étant donné la contrainte de ne pas lancer d'actions, je vais fournir
  // le code d'un composant qui pourrait être utilisé pour afficher un message
  // de paywall, mais l'utilisateur devra insérer la logique de masquage du contenu
  // manuellement dans son Markdown ou via un transformer.

  // Pour l'instant, je vais créer un composant simple qui affiche un message
  // et qui pourrait être utilisé comme un "call to action" pour l'abonnement.

  return (
    <div class="hyvor-gated-content">
      <p>
        Ce contenu est réservé aux membres. Veuillez vous connecter ou vous abonner via Hyvor Talk pour le voir.
      </p>
      {/* Le vrai contenu premium devrait être enveloppé manuellement dans le Markdown
          avec une balise div et l'attribut data-hyvor-talk-gated="true" */}
    </div>
  )
}

export default (() => HyvorTalkGatedContent) satisfies QuartzComponentConstructor
