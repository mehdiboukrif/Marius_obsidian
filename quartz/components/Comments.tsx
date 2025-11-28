import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
// @ts-ignore
import giscusScript from "./scripts/comments.giscus.inline"
// @ts-ignore
import hyvorTalkScript from "./scripts/comments.hyvor_talk.inline"

type GiscusOptions = {
  provider: "giscus"
  options: {
    repo: `${string}/${string}`
    repoId: string
    category: string
    categoryId: string
    themeUrl?: string
    lightTheme?: string
    darkTheme?: string
    mapping?: "url" | "title" | "og:title" | "specific" | "number" | "pathname"
    strict?: boolean
    reactionsEnabled?: boolean
    inputPosition?: "top" | "bottom"
    lang?: string
  }
}

type HyvorTalkOptions = {
  provider: "hyvor_talk"
  options: {
    websiteId: string
    host?: string
  }
}

type Options = GiscusOptions | HyvorTalkOptions

function boolToStringBool(b: boolean): string {
  return b ? "1" : "0"
}

export default ((opts: Options) => {
  const Comments: QuartzComponent = ({ displayClass, fileData, cfg }: QuartzComponentProps) => {
    // check if comments should be displayed according to frontmatter
    const disableComment: boolean =
      typeof fileData.frontmatter?.comments !== "undefined" &&
      (!fileData.frontmatter?.comments || fileData.frontmatter?.comments === "false")
    if (disableComment) {
      return <></>
    }

    if (opts.provider === "hyvor_talk") {
      return (
        <div
          class={classNames(displayClass, "hyvor-talk")}
          id="hyvor-talk-container"
          data-website-id={opts.options.websiteId}
          data-host={opts.options.host}
        ></div>
      )
    }

    const giscusOpts = opts.options
    return (
      <div
        class={classNames(displayClass, "giscus")}
        data-repo={giscusOpts.repo}
        data-repo-id={giscusOpts.repoId}
        data-category={giscusOpts.category}
        data-category-id={giscusOpts.categoryId}
        data-mapping={giscusOpts.mapping ?? "url"}
        data-strict={boolToStringBool(giscusOpts.strict ?? true)}
        data-reactions-enabled={boolToStringBool(giscusOpts.reactionsEnabled ?? true)}
        data-input-position={giscusOpts.inputPosition ?? "bottom"}
        data-light-theme={giscusOpts.lightTheme ?? "light"}
        data-dark-theme={giscusOpts.darkTheme ?? "dark"}
        data-theme-url={
          giscusOpts.themeUrl ?? `https://${cfg.baseUrl ?? "example.com"}/static/giscus`
        }
        data-lang={giscusOpts.lang ?? "en"}
      ></div>
    )
  }

  Comments.afterDOMLoaded = opts.provider === "hyvor_talk" ? hyvorTalkScript : giscusScript

  return Comments
}) satisfies QuartzComponentConstructor<Options>
