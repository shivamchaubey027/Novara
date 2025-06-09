import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Upload, Search, Handshake, Truck, Star } from 'lucide-react';
import type { BookWithSeller, BlogWithAuthor } from '@shared/schema';

export default function Home() {
  const { user } = useAuth();

  const { data: featuredBooks = [] } = useQuery<BookWithSeller[]>({
    queryKey: ['/api/books'],
  });

  const { data: featuredBlogs = [] } = useQuery<BlogWithAuthor[]>({
    queryKey: ['/api/blogs'],
  });

  const recentBooks = featuredBooks.slice(0, 4);
  const recentBlogs = featuredBlogs.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-primary leading-tight mb-6">
                Elegant Book Marketplace for{' '}
                <span className="text-accent">Modern Readers</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Discover rare finds, sell your collection, and connect with fellow book enthusiasts in our sophisticated literary community.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/buy">
                  <Button size="lg" className="bg-accent text-white hover:bg-blue-600 text-lg px-8 py-4">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Buy Books
                  </Button>
                </Link>
                <Link href={user ? "/dashboard" : "/auth"}>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white text-lg px-8 py-4"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Sell Books
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Stack of vintage books" 
                className="rounded-2xl shadow-2xl w-full h-auto" 
              />
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{featuredBooks.length}+</div>
                  <div className="text-sm text-slate-600">Books Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Featured Books</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover our most popular and recently added books from various genres
            </p>
          </div>

          {recentBooks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {recentBooks.map((book) => (
                <Card key={book.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    {book.imageUrl ? (
                      <img 
                        src={book.imageUrl} 
                        alt={book.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <div className="text-slate-400 text-center">
                          <div className="text-4xl mb-2">📚</div>
                          <div className="text-sm">No Image</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-blue-50 text-blue-700">{book.genre}</Badge>
                      <span className="text-sm text-slate-500">{book.condition}</span>
                    </div>
                    <h3 className="font-semibold text-lg text-primary mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-slate-600 text-sm mb-3">{book.author}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-accent">${parseFloat(book.price).toFixed(2)}</span>
                      <Button size="sm" className="bg-accent text-white hover:bg-blue-600">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No Books Available Yet</h3>
              <p className="text-slate-500 mb-6">Be the first to add books to our marketplace!</p>
              <Link href={user ? "/dashboard" : "/auth"}>
                <Button className="bg-accent text-white hover:bg-blue-600">
                  Start Selling Books
                </Button>
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/buy">
              <Button variant="outline" size="lg" className="border-2 border-accent text-accent hover:bg-accent hover:text-white">
                View All Books
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">How Novara Works</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Simple steps to buy and sell books in our elegant marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">Discover Books</h3>
              <p className="text-slate-600">
                Browse our curated collection of books across various genres and find your next great read.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Handshake className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">Connect Safely</h3>
              <p className="text-slate-600">
                Connect with verified sellers and buyers through our secure platform.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">Complete Transaction</h3>
              <p className="text-slate-600">
                Secure payment processing and reliable shipping to ensure your books arrive safely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Literary Insights</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover book reviews, reading guides, and literary discussions from our community
            </p>
          </div>

          {recentBlogs.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {recentBlogs.map((blog) => (
                <Card key={blog.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
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
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      {blog.tags && blog.tags.length > 0 && (
                        <Badge className="bg-blue-50 text-blue-700">{blog.tags[0]}</Badge>
                      )}
                      <span className="text-sm text-slate-500">
                        {new Intl.DateTimeFormat('en-US', {
                          month: 'short',
                          day: 'numeric'
                        }).format(new Date(blog.createdAt))}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-primary mb-3 line-clamp-2">{blog.title}</h3>
                    <p className="text-slate-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-medium">
                            {blog.author.username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-slate-700">{blog.author.username}</span>
                      </div>
                      <Link href={`/blogs/${blog.id}`}>
                        <Button variant="ghost" size="sm" className="text-accent hover:text-blue-600">
                          Read More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No Blog Posts Yet</h3>
              <p className="text-slate-500 mb-6">Be the first to share your literary insights!</p>
              <Link href={user ? "/dashboard" : "/auth"}>
                <Button className="bg-accent text-white hover:bg-blue-600">
                  Write a Blog Post
                </Button>
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/blogs">
              <Button className="bg-accent text-white hover:bg-blue-600">
                View All Posts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">What Our Community Says</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Hear from book lovers who have found their perfect reads through Novara
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-50 border-0">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 mb-6 italic">
                  "Novara has completely transformed how I discover and buy books. The quality of books and the seller verification process gives me complete confidence in every purchase."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">AL</span>
                  </div>
                  <div>
                    <div className="font-semibold text-primary">Anna Liu</div>
                    <div className="text-sm text-slate-500">Avid Reader</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border-0">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 mb-6 italic">
                  "As a seller, I love how easy it is to list my books and connect with genuine buyers. The platform's elegant design makes the entire process enjoyable."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">DM</span>
                  </div>
                  <div>
                    <div className="font-semibold text-primary">David Martinez</div>
                    <div className="text-sm text-slate-500">Book Seller</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border-0">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 mb-6 italic">
                  "The blog section has introduced me to so many amazing authors and book recommendations. It's like having a personal book curator!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">SJ</span>
                  </div>
                  <div>
                    <div className="font-semibold text-primary">Sarah Johnson</div>
                    <div className="text-sm text-slate-500">Literature Student</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Join Our Literary Community?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Start buying, selling, and discovering amazing books today. Join thousands of book enthusiasts who trust Novara.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-accent text-white hover:bg-blue-600 text-lg px-8 py-4">
                <BookOpen className="mr-2 h-5 w-5" />
                Create Account
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
