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
      <Card className="card-elegant p-0 cursor-pointer hover-lift">
        {blog.imageUrl ? (
          <img 
            src={blog.imageUrl} 
            alt={blog.title}
            className="w-full h-48 object-cover image-elegant"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-yellow-50 to-gray-100 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="text-4xl mb-2">📝</div>
              <div className="text-sm font-medium">Blog Post</div>
            </div>
          </div>
        )}
        
        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            {blog.tags && blog.tags.length > 0 && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                {blog.tags[0]}
              </Badge>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(blog.createdAt)}
            </div>
          </div>
          
          <h3 className="font-serif text-xl font-semibold text-gray-800 mb-3 line-clamp-2 flex-shrink-0">
            {blog.title}
          </h3>
          
          <p className="text-elegant mb-4 line-clamp-3 flex-1">
            {blog.excerpt}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-medium">
                  {getAuthorInitials(blog.author.username)}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {blog.author.username}
                </span>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" className="text-gold hover:text-yellow-700">
              Read More
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}