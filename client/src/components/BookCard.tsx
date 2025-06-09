import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import type { BookWithSeller } from '@shared/schema';

interface BookCardProps {
  book: BookWithSeller;
  onAddToCart?: (book: BookWithSeller) => void;
}

export default function BookCard({ book, onAddToCart }: BookCardProps) {
  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'new':
      case 'like new':
        return 'bg-green-50 text-green-700';
      case 'excellent':
        return 'bg-blue-50 text-blue-700';
      case 'good':
        return 'bg-yellow-50 text-yellow-700';
      case 'fair':
        return 'bg-orange-50 text-orange-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getGenreColor = (genre: string) => {
    switch (genre.toLowerCase()) {
      case 'fiction':
        return 'bg-purple-50 text-purple-700';
      case 'science':
        return 'bg-emerald-50 text-emerald-700';
      case 'history':
        return 'bg-orange-50 text-orange-700';
      case 'philosophy':
        return 'bg-indigo-50 text-indigo-700';
      default:
        return 'bg-blue-50 text-blue-700';
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        {book.imageUrl ? (
          <img 
            src={book.imageUrl} 
            alt={book.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <div className="text-slate-400 text-center">
              <div className="text-4xl mb-2">📚</div>
              <div className="text-sm">No Image</div>
            </div>
          </div>
        )}
        {book.isSold && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-2">SOLD</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getGenreColor(book.genre)}>
            {book.genre}
          </Badge>
          <Badge variant="outline" className={getConditionColor(book.condition)}>
            {book.condition}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-lg text-primary mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-slate-600 text-sm mb-3">
          by {book.author}
        </p>
        
        {book.description && (
          <p className="text-slate-600 text-sm mb-4 line-clamp-2">
            {book.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-accent">
            ${parseFloat(book.price).toFixed(2)}
          </span>
          {!book.isSold && onAddToCart && (
            <Button 
              onClick={() => onAddToCart(book)}
              className="bg-accent text-white hover:bg-blue-600"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
          )}
        </div>
        
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Sold by <span className="font-medium">{book.seller.username}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
