import type { NextConfig } from "next";

const pagesExport = process.env.GITHUB_PAGES === "true";
const pagesBasePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  basePath: pagesExport ? pagesBasePath : undefined,
  assetPrefix: pagesExport ? pagesBasePath : undefined,
  trailingSlash: pagesExport,
  images: { unoptimized: pagesExport },
};

export default nextConfig;
