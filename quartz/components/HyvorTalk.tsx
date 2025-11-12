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
        page-id="" // L'ID de page sera défini par JavaScript côté client
      ></hyvor-talk-comments>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined') {
              const comments = document.querySelector('hyvor-talk-comments');
              if (comments) {
                comments.setAttribute('page-id', window.location.pathname);
              }
            }
          `,
        }}
      />
    </div>
  )
}

export default (() => HyvorTalk) satisfies QuartzComponentConstructor
