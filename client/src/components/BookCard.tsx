import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'wouter';
import type { BookWithSeller } from '@shared/schema';

interface BookCardProps {
  book: BookWithSeller;
  onAddToCart?: (book: BookWithSeller) => void;
}

export default function BookCard({ book, onAddToCart }: BookCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(book);
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'new': return 'bg-green-100 text-green-800 border-green-200';
      case 'like new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'very good': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'good': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      <Link href={`/book/${book.id}`}>
        {book.imageUrl ? (
          <div className="relative group cursor-pointer">
            <img 
              src={book.imageUrl} 
              alt={book.title}
              className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ) : (
          <div className="w-full h-56 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center cursor-pointer group">
            <div className="text-gray-400 dark:text-gray-500 text-center group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
              <div className="text-5xl mb-3">📚</div>
              <div className="text-sm font-medium">No Image</div>
            </div>
          </div>
        )}
      </Link>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Badge className={getConditionColor(book.condition)}>
            {book.condition}
          </Badge>
          <div className="text-right">
            <div className="text-2xl font-serif font-bold text-gold">
              ${book.price}
            </div>
          </div>
        </div>
        
        <h3 className="font-serif text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {book.title}
        </h3>
        
        <p className="text-gray-600 font-medium mb-3">
          by {book.author}
        </p>
        
        <div className="mb-4">
          <Badge variant="outline" className="text-xs">
            {book.genre}
          </Badge>
        </div>
        
        {book.description && (
          <p className="text-elegant text-sm mb-4 line-clamp-2">
            {book.description}
          </p>
        )}
        
        <div className="space-y-3 mt-auto">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Sold by <span className="font-medium text-gray-700 dark:text-gray-300">{book.seller.username}</span>
          </div>
          
          <div className="flex gap-2">
            <Link href={`/book/${book.id}`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            </Link>
            
            {onAddToCart && (
              <Button
                onClick={handleAddToCart}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}