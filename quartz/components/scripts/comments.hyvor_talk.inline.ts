type HyvorTalkContainer = HTMLElement & {
  dataset: DOMStringMap & {
    websiteId?: string
    host?: string
  }
}

const HYVOR_SCRIPT_ID = "hyvor-talk-script"
const HYVOR_EMBED_SRC = "https://talk.hyvor.com/embed/embed.js"

const ensureHyvorScript = () => {
  if (document.getElementById(HYVOR_SCRIPT_ID)) {
    return
  }

  const script = document.createElement("script")
  script.id = HYVOR_SCRIPT_ID
  script.src = HYVOR_EMBED_SRC
  script.async = true
  script.type = "module"
  document.body.appendChild(script)
}

const renderHyvorTalk = (container: HyvorTalkContainer) => {
  const websiteId = container.dataset.websiteId
  if (!websiteId) {
    return
  }

  const comments = document.createElement("hyvor-talk-comments")
  comments.setAttribute("website-id", websiteId)
  comments.setAttribute("page-id", window.location.pathname)
  comments.setAttribute("page-url", window.location.href)

  const host = container.dataset.host
  if (host) {
    comments.setAttribute("instance", host)
  }

  const hyvorWindow = window as typeof window & {
    hyvorTalkStyles?: {
      stylesheet?: unknown
    }
  }
  if (hyvorWindow.hyvorTalkStyles) {
    hyvorWindow.hyvorTalkStyles.stylesheet = undefined
  }

  container.innerHTML = ""
  container.appendChild(comments)
}

const setupHyvorTalk = () => {
  const container = document.getElementById("hyvor-talk-container") as HyvorTalkContainer | null
  if (!container) {
    return
  }

  ensureHyvorScript()
  renderHyvorTalk(container)
}

document.addEventListener("nav", setupHyvorTalk)
