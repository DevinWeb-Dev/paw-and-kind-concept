import {
  defineConfig,
} from "vite";

import react from "@vitejs/plugin-react";

const isGitHubPages =
  process.env.GITHUB_PAGES ===
  "true";

const repositoryName =
  process.env.GITHUB_REPOSITORY
    ?.split("/")
    .pop() ||
  "paw-and-kind-concept";

const isUserSite =
  repositoryName
    .toLowerCase()
    .endsWith(".github.io");

const base =
  isGitHubPages
    ? isUserSite
      ? "/"
      : `/${repositoryName}/`
    : "/";

export default defineConfig({
  plugins: [
    react(),
  ],

  base,

  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    sourcemap: false,
  },
});