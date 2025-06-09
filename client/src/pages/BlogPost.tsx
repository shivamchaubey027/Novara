import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import type { BlogWithAuthor } from '@shared/schema';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();

  const { data: blog, isLoading, error } = useQuery<BlogWithAuthor>({
    queryKey: [`/api/blogs/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded mb-4 w-1/4"></div>
            <div className="h-12 bg-slate-200 rounded mb-4"></div>
            <div className="h-64 bg-slate-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h1 className="text-2xl font-bold text-slate-600 mb-2">Blog Post Not Found</h1>
              <p className="text-slate-500 mb-6">
                The blog post you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/blogs">
                <Button className="bg-accent text-white hover:bg-blue-600">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blogs
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const getAuthorInitials = (username: string) => {
    return username.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2);
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back Button */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/blogs">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Button>
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="overflow-hidden">
          {/* Hero Image */}
          {blog.imageUrl ? (
            <img 
              src={blog.imageUrl} 
              alt={blog.title}
              className="w-full h-64 lg:h-96 object-cover"
            />
          ) : (
            <div className="w-full h-64 lg:h-96 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
              <div className="text-slate-400 text-center">
                <div className="text-6xl mb-4">📝</div>
                <div className="text-lg">Blog Post</div>
              </div>
            </div>
          )}

          <CardContent className="p-8 lg:p-12">
            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag, index) => (
                  <Badge key={index} className="bg-blue-50 text-blue-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Author and Meta Info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 pb-8 border-b border-slate-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">
                    {getAuthorInitials(blog.author.username)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-slate-800 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {blog.author.username}
                  </div>
                  <div className="text-sm text-slate-500">Author</div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-slate-500 sm:ml-auto">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(blog.createdAt)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {estimateReadingTime(blog.content)}
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div className="text-xl text-slate-600 mb-8 p-6 bg-slate-50 rounded-lg border-l-4 border-accent">
              {blog.excerpt}
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                {blog.content}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Author Bio Section */}
        <Card className="mt-8">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg font-semibold">
                  {getAuthorInitials(blog.author.username)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  About {blog.author.username}
                </h3>
                <p className="text-slate-600 mb-4">
                  Passionate reader and writer sharing insights about literature, book recommendations, and reading experiences.
                </p>
                <Button variant="outline" size="sm">
                  View All Posts by {blog.author.username}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Posts Section */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-primary mb-6">More Literary Insights</h3>
          <Link href="/blogs">
            <Button className="bg-accent text-white hover:bg-blue-600">
              Explore All Blog Posts
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}
