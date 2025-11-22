// src/config/seoConfig.js

export const seoConfig = {
    mainPage: {
      title: "Your Website Name - Your Catchy Tagline",
      description: "A detailed description of your website’s purpose and what users can expect.",
      keywords: "website, SaaS, product, service, best platform, etc.",
      openGraph: {
        title: "Your Website Name - Your Catchy Tagline",
        description: "A detailed description of your website’s purpose and what users can expect.",
        url: process.env.NEXT_PUBLIC_SITE_URL,  // Using the environment variable
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`,
            width: 1200,
            height: 630,
            alt: "Your Website Name",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Your Website Name",
        description: "A detailed description of your website’s purpose.",
        images: [`${process.env.NEXT_PUBLIC_SITE_URL}/twitter-image.jpg`],
      },
      robots: {
        index: true,
        follow: true,
      },
      canonical: process.env.NEXT_PUBLIC_SITE_URL,  // Using the environment variable
    },
    
    blogPage: {
      title: "Blog - Latest Posts | Your Website Name",
      description: "Read the latest articles, insights, and updates from our blog.",
      keywords: "blog, articles, insights, latest news, posts",
      openGraph: {
        title: "Blog - Latest Posts | Your Website Name",
        description: "Read the latest articles, insights, and updates from our blog.",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog-image.jpg`,
            width: 1200,
            height: 630,
            alt: "Blog - Your Website Name",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Blog - Latest Posts | Your Website Name",
        description: "Read the latest articles, insights, and updates from our blog.",
        images: [`${process.env.NEXT_PUBLIC_SITE_URL}/blog-image.jpg`],
      },
      robots: {
        index: true,
        follow: true,
      },
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
    },
  
    blogPost: (post) => ({
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160), // Short excerpt or the first 160 chars
      keywords: `${post.title}, blog, article, ${post.category}`,
      openGraph: {
        title: post.title,
        description: post.excerpt || post.content.slice(0, 160),
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
        images: [
          {
            url: post.image || `${process.env.NEXT_PUBLIC_SITE_URL}/default-image.jpg`,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt || post.content.slice(0, 160),
        images: [post.image || `${process.env.NEXT_PUBLIC_SITE_URL}/default-image.jpg`],
      },
      robots: {
        index: true,
        follow: true,
      },
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt || post.content.slice(0, 160),
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
        author: {
          "@type": "Person",
          name: post.authorName, // Ensure the author data exists in your post object
        },
        datePublished: post.datePublished, // Ensure the date is in ISO format
        dateModified: post.dateModified || post.datePublished, // Optional
        image: post.image || `${process.env.NEXT_PUBLIC_SITE_URL}/default-image.jpg`,
      },
    }),
  };
  