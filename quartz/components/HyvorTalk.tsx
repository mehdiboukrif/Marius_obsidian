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
        page-id={window.location.pathname}
      ></hyvor-talk-comments>
    </div>
  )
}

export default (() => HyvorTalk) satisfies QuartzComponentConstructor
