"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, Calendar, Clock, ChevronLeft, ChevronRight, Grid, List } from "lucide-react";
import PostCard from "../shared/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

async function fetchPosts(page, search, sortBy = "date") {
  const res = await fetch(`/api/posts/blog?page=${page}&search=${search || ""}&sort=${sortBy}`);
  if (!res.ok) return { posts: [], totalPages: 1, totalPosts: 0 };
  const data = await res.json();
  return {
    posts: data.posts || [],
    totalPages: data.totalPages || 1,
    totalPosts: data.totalPosts || 0,
  };
}

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
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
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
      
      <CardContent className="pt-0">
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
    <Card>
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

export default function BlogPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "date";

  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    setIsLoading(true);
    fetchPosts(currentPage, searchQuery, sortBy).then(({ posts, totalPages, totalPosts }) => {
      setPosts(posts);
      setTotalPages(totalPages);
      setTotalPosts(totalPosts);
      setIsLoading(false);
    });
  }, [currentPage, searchQuery, sortBy]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    if (searchQuery) params.set("search", searchQuery);
    if (sortBy !== "date") params.set("sort", sortBy);
    router.push(`/blog?${params.toString()}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("page", "1");
    if (searchInput.trim()) params.set("search", searchInput.trim());
    if (sortBy !== "date") params.set("sort", sortBy);
    router.push(`/blog?${params.toString()}`);
  };

  const handleSortChange = (newSort) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    if (searchQuery) params.set("search", searchQuery);
    if (newSort !== "date") params.set("sort", newSort);
    router.push(`/blog?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchInput("");
    router.push("/blog");
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              Our Blog
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Latest Insights & Articles
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover the latest trends, tips, and insights from our experts. 
              Stay informed with our regularly updated content.
            </p>
            
            {/* Search and Filters */}
            <Card className="p-6 bg-card">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Latest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex gap-2">
                  <Button type="submit">
                    Search
                  </Button>
                  {searchQuery && (
                    <Button variant="outline" onClick={clearSearch}>
                      Clear
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {searchQuery ? `Search Results for "${searchQuery}"` : "All Articles"}
            </h2>
            <p className="text-muted-foreground">
              {isLoading ? "Loading..." : `${totalPosts} article${totalPosts !== 1 ? 's' : ''} found`}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Blog Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1 max-w-4xl mx-auto"
          }`}>
            {posts.map((post) => (
              <a key={post._id} href={`/blog/${post.slug}`} className="block">
                <PostCardEnhanced post={post} />
              </a>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No articles found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? `No articles match your search for "${searchQuery}"`
                  : "No articles have been published yet"
                }
              </p>
              {searchQuery && (
                <Button onClick={clearSearch}>
                  View All Articles
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12">
            <p className="text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              
              {/* Page Numbers */}
              <div className="flex gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = Math.max(1, currentPage - 2) + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="bg-muted/30 border-t mt-16">
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto text-center bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Stay Updated</CardTitle>
              <CardDescription className="text-lg">
                Subscribe to our newsletter and never miss our latest articles and insights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1"
                />
                <Button>Subscribe</Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                No spam, unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}