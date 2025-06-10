import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingCart, User, Calendar, Tag, DollarSign } from 'lucide-react';
import { BookWithSeller } from '@/../../shared/schema';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, getConditionColor, getGenreColor } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: book, isLoading, error } = useQuery<BookWithSeller>({
    queryKey: ['/api/books', id],
    queryFn: async () => {
      const response = await fetch(`/api/books/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch book details');
      }
      return response.json();
    }
  });

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive"
      });
      return;
    }

    if (book) {
      addToCart(book);
      toast({
        title: "Added to cart",
        description: `${book.title} has been added to your cart.`,
      });
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to purchase books.",
        variant: "destructive"
      });
      return;
    }

    if (book) {
      addToCart(book);
      // In a real app, this would redirect to checkout
      toast({
        title: "Redirecting to checkout",
        description: "Processing your order...",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Book not found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">The book you're looking for doesn't exist or has been removed.</p>
            <Link href="/buy">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Books
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/buy">
          <Button variant="ghost" className="mb-8 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Book Image */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg">
              <CardContent className="p-0">
                <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
                  {book.imageUrl ? (
                    <img 
                      src={book.imageUrl} 
                      alt={book.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <div className="text-6xl mb-4">📚</div>
                      <p className="font-medium">{book.title}</p>
                      <p className="text-sm">No image available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{book.title}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">by {book.author}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className={`${getGenreColor(book.genre)} text-white`}>
                  <Tag className="h-3 w-3 mr-1" />
                  {book.genre}
                </Badge>
                <Badge variant="secondary" className={`${getConditionColor(book.condition)} text-white`}>
                  {book.condition}
                </Badge>
              </div>

              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6">
                <DollarSign className="h-8 w-8 inline mr-1" />
                {formatPrice(book.price)}
              </div>
            </div>

            {/* Description */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {book.description || "No description available for this book."}
                </p>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Seller Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{book.seller.username}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{book.seller.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator className="bg-gray-200 dark:bg-gray-700" />

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  Buy Now
                </Button>
              </div>
              
              {!user && (
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                  <Link href="/auth" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Sign in
                  </Link>
                  {" "}to purchase this book
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}