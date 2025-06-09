import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import { Card, CardContent } from '@/components/ui/card';
import type { BlogWithAuthor } from '@shared/schema';

export default function Blogs() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: blogs = [], isLoading } = useQuery<BlogWithAuthor[]>({
    queryKey: ['/api/blogs'],
  });

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.author.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="w-full h-48 bg-slate-200"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-6 bg-slate-200 rounded mb-2"></div>
                  <div className="h-16 bg-slate-200 rounded mb-4"></div>
                  <div className="h-8 bg-slate-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Literary Insights</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover book reviews, reading guides, and literary discussions from our community
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              placeholder="Search blog posts, authors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Featured Section */}
      {!searchQuery && blogs.length > 0 && (
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-primary mb-8">Featured Posts</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {blogs.slice(0, 2).map((blog) => (
                <Card key={blog.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="lg:flex">
                    <div className="lg:w-1/2">
                      {blog.imageUrl ? (
                        <img 
                          src={blog.imageUrl} 
                          alt={blog.title}
                          className="w-full h-48 lg:h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 lg:h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                          <div className="text-slate-400 text-center">
                            <div className="text-4xl mb-2">📝</div>
                            <div className="text-sm">Featured Post</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="lg:w-1/2 p-6 lg:p-8">
                      <div className="flex items-center mb-3">
                        {blog.tags && blog.tags.length > 0 && (
                          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            {blog.tags[0]}
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-primary mb-3 hover:text-accent transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-slate-600 mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-medium">
                              {blog.author.username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-slate-700">{blog.author.username}</div>
                            <div className="text-sm text-slate-500">
                              {new Intl.DateTimeFormat('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              }).format(new Date(blog.createdAt))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-primary">
            {searchQuery ? `Search Results (${filteredBlogs.length})` : 'All Posts'}
          </h2>
        </div>

        {filteredBlogs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-slate-600 mb-2">No Blog Posts Yet</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Be the first to share your literary insights and book recommendations with our community!
            </p>
            <Button className="bg-accent text-white hover:bg-blue-600">
              Write Your First Post
            </Button>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-slate-600 mb-2">No Posts Found</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              No blog posts match your search criteria. Try adjusting your search terms or browse all posts.
            </p>
            <Button onClick={() => setSearchQuery('')} variant="outline">
              Show All Posts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
