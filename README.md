# Changes made by Joonel (me)

This is a fork of https://github.com/beynar/sveltekit-sitemap
Actually I fixed all currently opened issues of the original repo (screenshot below). Priority tags removed completely as they are vestigial.

![image](https://github.com/Joonel/sveltekit-sitemap/assets/69682842/3569f6e8-f755-4392-8c3f-f8e1ed0ad657)


# sveltekit-sitemap (and robots)

This library is designed to help generate and maintain dynamic sitemap.xml and robots.txt for their SvelteKit apps.

It's a combination of a Vite plugin and a Svelte-kit hook. The plugin is responsible to watch your routes folder to generate a typescript representation of it. The hook is responsible to deliver sitemap.xml and robots.txt responses based on your params and the former typescript sitemap.

This library is not meant to generate a static sitemap at build time. It's there to help you deliver ssr sitemaps. If you want a static sitemap take a look at svelte-sitemap.

## Usage

```shell
pnpm add sveltekit-sitemap
```

```shell
npm i sveltekit-sitemap
```

```shell
yarn add sveltekit-sitemap
```

1. Add the vite plugin

```ts
// vite.config.js

import { sveltekit } from "@sveltejs/kit/vite";
import { sitemapPlugin } from "sveltekit-sitemap";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit(), sitemapPlugin()]
};

export default config;
```

2. Use the hook with the generated sitemap and define your custom routes definitions and robots directive

```ts
// src/hooks.server.ts
import type { Handle } from "@sveltejs/kit";
import { sitemapHook } from "sveltekit-sitemap";
import { sitemap } from "./sitemap";

export const handle: Handle = sitemapHook(sitemap, params);
```

## sitemapPlugin

Invoke the plugin in your vite.config file after the sveltekit plugin.
You can pass an object to configure where the plugin should look up for your routes and where it shoud output the sitemap file.

| key         | type   | default            |
| ----------- | ------ | ------------------ |
| routesDir   | string | "./src/routes"     |
| sitemapFile | string | "./src/sitemap.ts" |

```ts
sitemapPlugin({ routesDir: "./src/routes", sitemapFile: "./src/sitemap.ts" });
```

## sitemapHook

Use this hook in your hooks.server.ts file. It will add a sitemap.xml and a robot.txt endpoints to your server.

The first argument you have to pass is the typescript sitemap generated by the plugin.
The second (optional) argument is an object defining two async functions: `getRoutes` and `getRobots` that are respectively responsible to return the route definitions and the user-agent directives.

### getRoutes `<S extends Sitemap>(event: Event) => Promise<RouteDefinitions<S>>`

- receive the event as argument
- is async to let you make api call
- returns a routes definitions object
- **keys are routes of your app** (`"/products/[id]"`, `"/about/story"`) values are route definitions
- if the route key is a dynamic route (it has dynamic params like `[id]`) you have to return an array of route definitions for every possible paths and not a single object like for static route (without dynamic params).

RouteDefinition

| key        | type                 | required |
| ---------- | -------------------- | -------- |
| path       | string               | ✔        |
| lastMod    | string               | ⛌        |
| changeFreq | string               | ⛌        |
| priority   | string               | ⛌        |
| image      | RouteDefinitionImage | ⛌        |

RouteDefinitionImage

| key     | type   | required |
| ------- | ------ | -------- |
| url     | string | ✔        |
| title   | string | ⛌        |
| altText | string | ⛌        |

```ts
sitemapHook(sitemap, {
  //...
  getRoutes: async (event) => {
    const blogs = await event.locals.api.getBlogsForSitemap();
    // ^-- make async api call to get fresh data

    return {
      "/about": {
        path: "/",
        priority: "0.8"
      },
      // ^-- Static routes are automatically added to the sitemap. But if you want to customize them, you can return a route definition object.
      "blogs/[handle]": blogs,
      "/products/[id]": [
        { path: "/products/test-1" },
        { path: "/products/test-2" },
        {
          path: "/products/test-3",
          changeFreq: "Monthly",
          priority: "0.8",
          lastMod: "2023-01-01",
          image: {
            url: "https://picsum.photos/200/300",
            title: "test-1",
            altText: "image-product-test-1"
          }
        }
      ]
      // ^-- For dynamic routes you have to return an array of route definitions
    };
  }
});
```

### getRobots `<S extends Sitemap>(event: Event) => Promise<boolean | UserAgent<S> | UserAgent<S>[]>`

- receive the event as argument
- is async to let you make api call
- returns either
  - a boolean to allow or disallow all routes
  - a UserAgentDirective object
  - an array of UserAgentDirectives to output different configs based on different user agents.

UserAgentDirective

| key        | type                                                                                                 | required | default |
| ---------- | ---------------------------------------------------------------------------------------------------- | -------- | ------- |
| userAgent  | `string \| string[]` (pass an array of user-agents to use the same config for different user-agents) | ⛌        | "\*"    |
| crawlDelay | `number`                                                                                             | ⛌        |         |
| paths      | `PathDirectives` (paths of your app or anything else)                                                | ✔        |         |

PathDirectives

A record of route path as key and boolean or record of boolean.
If the route is dynamic the directive is an object of the routes with certain params you want to allow or disallow. If the route isn't dynamic then you ony have to pass a boolean.

The boolean tells if the route is allowed (true) or disallowed (false). Note that by default robots allowed themselves to crawl the entire site. The allow directive is really useful for the niche case where you are disabling an entire directory but want a specific child route to be crawled.

```ts
const directive: PathDirectives = {
  "/admin/": false, // the "/" after disables all routes under /admin
  "/blogs/": false, // all the "blogs" directory is disallow
  "/login": false, // disallow the login page
  "/blogs/[id]": {
    "/blogs/id": true // But the route blog/id is allowed
  }
};
```

Examples

```ts
// With a boolean -  If preview mode the entire app will be disallowed.
sitemapHook(sitemap, {
  //...
  getRobots: async (event) => {
    const { isPreview } = event.locals;
    return isPreview ? false : true;
  }
});

// With a single config for multiple agents
sitemapHook(sitemap, {
  //...
  getRobots: async (event) => {
    return {
      userAgent: ["*", "adsbot-google"],
      crawlDelay: 1000,
      paths: {
        "/account/": false,
        "/pages/[id]": {
          "/pages/preview": false
        }
      }
    };
  }
});

// With a multiple configs for multiple agents
sitemapHook(sitemap, {
  //...
  getRobots: async (event) => {
    return [
      {
        userAgent: ["*", "adsbot-google"],
        crawlDelay: 1000,
        paths: {
          "/account/": false,
          "/pages/[id]": {
            "/pages/preview": false
          }
        }
      },
      {
        userAgent: "Googlebot-Image",
        paths: {
          "/": false
        }
      }
    ];
  }
});
```
