import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'wouter';
import type { BlogWithAuthor } from '@shared/schema';

interface BlogCardProps {
  blog: BlogWithAuthor;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  const getAuthorInitials = (username: string) => {
    return username.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Link href={`/blogs/${blog.id}`}>
      <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col cursor-pointer">
        {blog.imageUrl ? (
          <img 
            src={blog.imageUrl} 
            alt={blog.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-slate-400 text-center">
              <div className="text-4xl mb-2">📝</div>
              <div className="text-sm">Blog Post</div>
            </div>
          </div>
        )}
      
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          {blog.tags && blog.tags.length > 0 && (
            <Badge className="bg-blue-50 text-blue-700">
              {blog.tags[0]}
            </Badge>
          )}
          <div className="flex items-center text-sm text-slate-500">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(blog.createdAt)}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-primary mb-3 hover:text-accent transition-colors line-clamp-2 flex-shrink-0">
          {blog.title}
        </h3>
        
        <p className="text-slate-600 mb-4 line-clamp-3 flex-1">
          {blog.excerpt}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm font-medium">
                {getAuthorInitials(blog.author.username)}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-slate-700 flex items-center">
                <User className="h-3 w-3 mr-1" />
                {blog.author.username}
              </span>
            </div>
          </div>
          
          <Link href={`/blogs/${blog.id}`}>
            <Button variant="ghost" size="sm" className="text-accent hover:text-blue-600">
              Read More
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}
