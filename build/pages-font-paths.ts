import type { Plugin } from "vite";

// Vinext 0.0.50 embeds root-relative font URLs even for a Next basePath.
// Rewrite the injected CSS before bundling so preload links, SSR styles and
// hydrated styles all point at the same repository-scoped assets.
export function prefixHostedFontPaths(code: string, basePath: string): string {
  if (!basePath) return code;
  return code.replace(/(?<![\w/.-])\/assets\/_vinext_fonts\//g, `${basePath.replace(/\/$/, "")}/assets/_vinext_fonts/`);
}

export function pagesFontPaths(basePath: string): Plugin {
  return {
    name: "pages-font-paths",
    apply: "build",
    enforce: "post",
    transform(code, id) {
      if (!/[/\\]app[/\\]layout\.tsx(?:\?|$)/.test(id) || !code.includes("_vinext_fonts")) return null;
      const rewritten = prefixHostedFontPaths(code, basePath);
      return rewritten === code ? null : { code: rewritten, map: null };
    },
  };
}
