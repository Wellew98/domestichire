import { MetadataRoute } from "next";
import { getAllWorkers } from "@/lib/db";

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://domestichire-psi.vercel.app").replace(/\/+$/, "");

const CITIES = ["harare", "bulawayo", "mutare", "gweru", "chitungwiza"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const workers = await getAllWorkers({ limit: 1000, page: 1 });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/workers`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // City location pages (high SEO priority — these are the ranking pages)
  const cityRoutes: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${BASE_URL}/hire/${city}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const workerRoutes: MetadataRoute.Sitemap = workers.map((w: any) => ({
    url: `${BASE_URL}/workers/${w.id}`,
    lastModified: new Date(w.updated_at || w.created_at || Date.now()),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...cityRoutes, ...workerRoutes];
}
