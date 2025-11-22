import { seoConfig } from "../../config/seoConfig";
import { Clock, Calendar, ArrowLeft, Share2, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({ params }) {
  const post = await fetchPostData(params.slug);
  return seoConfig.blogPost(post);
}

async function fetchPostData(slug) {
  const res = await fetch(`${baseUrl}/api/posts/slug/${slug}`);
  if (!res.ok) return null;
  return await res.json();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

export default async function BlogPost({ params }) {
  const post = await fetchPostData(params.slug);

  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <Eye className="w-12 h-12 text-muted-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Post Not Found
              </h1>
              <p className="text-muted-foreground mb-6">
                The blog post you're looking for doesn't exist or has been moved.
              </p>
              <Button asChild>
                <Link href="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const readingTime = calculateReadingTime(post.content);
  const publishDate = formatDate(post.date);

  return (
    <main className="min-h-screen bg-background mt-12">
      {/* Hero Section */}
      <section className="relative">
        {post.image && (
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="container mx-auto max-w-4xl">
                <Badge variant="secondary" className="mb-4">
                  Blog Post
                </Badge>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {post.title}
                </h1>
                
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">{publishDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{readingTime} min read</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Title Section (when no image) */}
        {!post.image && (
          <div className="bg-muted/30 border-b">
            <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
              <Badge variant="outline" className="mb-4">
                Blog Post
              </Badge>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{publishDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{readingTime} min read</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Content Section */}
      <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <Card className="shadow-lg">
          <CardContent className="p-6 md:p-8 lg:p-12">
            {/* Author Section */}
            <div className="flex items-center gap-4 mb-8">
              <Avatar>
                <AvatarImage src="" alt="Author" />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">Author</p>
                <p className="text-sm text-muted-foreground">Published on {publishDate}</p>
              </div>
            </div>

            <Separator className="mb-8" />
            
            <div 
              className="prose prose-slate max-w-none
                [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:scroll-mt-20
                [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:scroll-mt-20
                [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]:mt-8 [&_h4]:mb-3
                [&_p]:text-muted-foreground [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-6
                [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline [&_a]:font-medium [&_a]:transition-colors
                [&_strong]:text-foreground [&_strong]:font-semibold
                [&_em]:text-muted-foreground [&_em]:italic
                [&_ul]:my-6 [&_ul]:pl-6 [&_li]:my-2 [&_li]:text-muted-foreground [&_li]:leading-relaxed
                [&_ol]:my-6 [&_ol]:pl-6 [&_ol>li]:my-2 [&_ol>li]:text-muted-foreground [&_ol>li]:leading-relaxed
                [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-muted/50 [&_blockquote]:p-4 [&_blockquote]:rounded-r-lg [&_blockquote]:my-6 [&_blockquote]:italic
                [&_blockquote_p]:text-foreground [&_blockquote_p]:mb-0
                [&_code]:bg-muted [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:text-foreground [&_code]:font-mono
                [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6
                [&_pre_code]:bg-transparent [&_pre_code]:p-0
                [&_img]:rounded-lg [&_img]:shadow-lg [&_img]:my-8 [&_img]:w-full
                [&_hr]:border-border [&_hr]:my-8
                [&_table]:w-full [&_table]:my-6 [&_table]:border-collapse
                [&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground
                [&_td]:border [&_td]:border-border [&_td]:p-2 [&_td]:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
          </CardContent>
        </Card>

        <Separator className="my-12" />

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20">
          <CardHeader>
            <h3 className="text-2xl font-bold text-center text-foreground">
              Found this helpful?
            </h3>
            <p className="text-center text-muted-foreground text-lg">
              Share it with others or explore more of our insights.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg">
                <Share2 className="w-4 h-4 mr-2" />
                Share Article
              </Button>
              <Button asChild size="lg">
                <Link href="/blog">
                  Read More Posts
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Related or Next Steps */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <h4 className="font-semibold text-foreground">Subscribe to Updates</h4>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get notified when we publish new articles and insights.
              </p>
              <Button variant="outline" className="w-full">
                Subscribe Now
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <h4 className="font-semibold text-foreground">Need Help?</h4>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Have questions about this topic? We're here to help.
              </p>
              <Button variant="outline" className="w-full">
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </div>
      </article>
    </main>
  );
}