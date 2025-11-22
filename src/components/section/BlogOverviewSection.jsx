"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function PostCardEnhanced({ post }) {
  const readingTime = calculateReadingTime(post.content);
  const publishDate = formatDate(post.date);
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
      {post.image && (
        <div className="relative overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{publishDate}</span>
          <Separator orientation="vertical" className="h-4" />
          <Clock className="w-4 h-4" />
          <span>{readingTime} min read</span>
        </div>
        
        <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </CardTitle>
        
        {post.excerpt && (
          <CardDescription className="line-clamp-3">
            {post.excerpt}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="pt-0 mt-auto">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">Article</Badge>
          <Button variant="ghost" size="sm" className="group-hover:text-primary">
            Read More →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <Card className="h-full">
      <div className="space-y-4 p-6">
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </Card>
  );
}

export default function BlogOverviewSection() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/posts/blog?limit=3");
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLatestPosts();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium rounded-full border border-primary/20">
            <BookOpen className="w-4 h-4 mr-2" />
            Our Blog
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Latest Insights & Stories
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Stay informed with our latest articles, tips, and insights from industry experts. 
            Discover valuable content that helps you grow and succeed.
          </p>
        </div>

        {/* Blog Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {posts.map((post) => (
              <a key={post._id} href={`/blog/${post.slug}`} className="block h-full">
                <PostCardEnhanced post={post} />
              </a>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 max-w-2xl mx-auto">
            <CardContent>
              <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No articles yet
              </h3>
              <p className="text-muted-foreground">
                We're working on some amazing content. Check back soon!
              </p>
            </CardContent>
          </Card>
        )}

        {/* View All Button */}
        {!isLoading && posts.length > 0 && (
          <div className="text-center mt-12">
            <Button asChild size="lg" className="group">
              <a href="/blog">
                View All Articles
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}