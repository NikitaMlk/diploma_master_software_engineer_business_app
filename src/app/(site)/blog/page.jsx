import { seoConfig } from "../config/seoConfig";
import BlogPage from "@/components/pages/BlogPage";
import { Suspense } from 'react';

export const metadata = {
  title: seoConfig.blogPage.title,
  description: seoConfig.blogPage.description,
  keywords: seoConfig.blogPage.keywords,
  openGraph: seoConfig.blogPage.openGraph,
  twitter: seoConfig.blogPage.twitter,
  robots: seoConfig.blogPage.robots,
  canonical: seoConfig.blogPage.canonical,
};


export default function BlogPageComponent() {
  return (
    <Suspense fallback={<div>Loading blog content...</div>}>
      <BlogPage />
    </Suspense>
  );
}