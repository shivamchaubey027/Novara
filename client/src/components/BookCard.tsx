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
    <Card className="card-elegant p-0 hover-lift overflow-hidden">
      {book.imageUrl ? (
        <div className="image-overlay">
          <img 
            src={book.imageUrl} 
            alt={book.title}
            className="w-full h-56 object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-56 bg-gradient-to-br from-yellow-50 to-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <div className="text-5xl mb-3">📚</div>
            <div className="text-sm font-medium">No Image</div>
          </div>
        </div>
      )}
      
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
        
        <div className="flex items-center justify-between mt-auto">
          <div className="text-sm text-gray-500">
            Sold by <span className="font-medium text-gray-700">{book.seller.username}</span>
          </div>
          
          {onAddToCart && (
            <Button
              onClick={handleAddToCart}
              className="btn-primary text-sm px-4 py-2"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}