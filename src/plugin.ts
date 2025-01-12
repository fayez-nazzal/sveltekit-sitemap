import fs from "fs";
import type { ViteDevServer } from "vite";
import { SitemapPluginParams } from "./types";
import { getRoutes } from "./utils";

export const sitemapPlugin = ({
  routesDir = "./src/routes",
  sitemapFile = "./src/sitemap.ts"
}: SitemapPluginParams = {}) => {
  function updateSitemap() {
    fs.writeFileSync(
      sitemapFile,
      `import type { RO_Sitemap } from '@fayez-nazzal/sveltekit-sitemap';

export const sitemap = (<const>${JSON.stringify(
        getRoutes(routesDir),
        null,
        3
      ).replace(/\uFFFF/g, '\\"')}) satisfies RO_Sitemap

export type Sitemap = typeof sitemap
`
    );
  }
  updateSitemap();

  return {
    name: "@fayez-nazzal/sveltekit-sitemap",
    configureServer(server: ViteDevServer) {
      server.watcher
        .on("add", updateSitemap)
        .on("unlink", updateSitemap)
        .on("unlinkDir", updateSitemap);
    },
  };
};
