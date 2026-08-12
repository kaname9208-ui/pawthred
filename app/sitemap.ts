import type { MetadataRoute } from "next";
import { products } from "@/lib/data/products";
import { siteConfig } from "@/lib/config/site.config";

// 自动生成 sitemap.xml，让 Google / Bing 高效收录所有页面与产品
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl.replace(/\/$/, "");

  const staticRoutes = [
    "",
    "/products",
    "/how-it-works",
    "/about",
    "/faq",
    "/reviews",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...productRoutes];
}
