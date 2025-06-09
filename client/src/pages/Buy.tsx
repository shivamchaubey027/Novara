import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import BookCard from '@/components/BookCard';
import { useToast } from '@/hooks/use-toast';
import type { BookWithSeller } from '@shared/schema';

export default function Buy() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');
  const { toast } = useToast();

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.append('search', searchQuery);
  if (selectedGenre) queryParams.append('genre', selectedGenre);
  if (selectedCondition) queryParams.append('condition', selectedCondition);
  if (priceRange) {
    const [min, max] = priceRange.split('-');
    if (min) queryParams.append('minPrice', min);
    if (max) queryParams.append('maxPrice', max);
  }

  const { data: books = [], isLoading } = useQuery<BookWithSeller[]>({
    queryKey: ['/api/books', queryParams.toString()],
    queryFn: async () => {
      const response = await fetch(`/api/books${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
      if (!response.ok) throw new Error('Failed to fetch books');
      return response.json();
    }
  });

  const availableBooks = books.filter(book => !book.isSold);
  const genres = [...new Set(books.map(book => book.genre))];
  const conditions = [...new Set(books.map(book => book.condition))];

  const handleAddToCart = (book: BookWithSeller) => {
    toast({
      title: "Added to Cart",
      description: `"${book.title}" has been added to your cart.`,
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSelectedCondition('');
    setPriceRange('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="w-full h-48 bg-slate-200"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-6 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded mb-4"></div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Buy Books</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover amazing books from our community of sellers
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Search by title, author, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Genres</SelectItem>
                  {genres.map(genre => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Conditions</SelectItem>
                  {conditions.map(condition => (
                    <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Prices</SelectItem>
                  <SelectItem value="0-10">$0 - $10</SelectItem>
                  <SelectItem value="10-25">$10 - $25</SelectItem>
                  <SelectItem value="25-50">$25 - $50</SelectItem>
                  <SelectItem value="50-">$50+</SelectItem>
                </SelectContent>
              </Select>

              {(searchQuery || selectedGenre || selectedCondition || priceRange) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedGenre || selectedCondition || priceRange) && (
              <div className="flex flex-wrap gap-2 justify-center">
                {searchQuery && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Search: "{searchQuery}"
                  </Badge>
                )}
                {selectedGenre && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Genre: {selectedGenre}
                  </Badge>
                )}
                {selectedCondition && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Condition: {selectedCondition}
                  </Badge>
                )}
                {priceRange && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Price: ${priceRange.replace('-', ' - $')}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-800">
            {availableBooks.length} {availableBooks.length === 1 ? 'book' : 'books'} available
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Filter className="h-4 w-4" />
            Sorted by relevance
          </div>
        </div>

        {availableBooks.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableBooks.map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-slate-600 mb-2">No Books Found</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              {searchQuery || selectedGenre || selectedCondition || priceRange
                ? "Try adjusting your search criteria or clearing filters to see more results."
                : "No books are currently available for sale. Check back later for new listings!"
              }
            </p>
            {(searchQuery || selectedGenre || selectedCondition || priceRange) && (
              <Button onClick={clearFilters} className="bg-accent text-white hover:bg-blue-600">
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
