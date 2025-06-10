import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  PlusCircle, 
  Edit, 
  Trash2, 
  User, 
  ShoppingBag,
  BarChart3,
  PenTool,
  DollarSign,
  Eye
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import type { Book, Blog, Order, InsertBook, InsertBlog } from '@shared/schema';

export default function Dashboard() {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Book form state
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    condition: '',
    genre: '',
    imageUrl: '',
    tags: ''
  });

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    tags: ''
  });

  // Queries
  const { data: userBooks = [] } = useQuery<Book[]>({
    queryKey: ['/api/dashboard/books'],
  });

  const { data: userBlogs = [] } = useQuery<Blog[]>({
    queryKey: ['/api/dashboard/blogs'],
  });

  const { data: userOrders = [] } = useQuery<Order[]>({
    queryKey: ['/api/dashboard/orders'],
  });

  // Mutations
  const createBookMutation = useMutation({
    mutationFn: async (bookData: InsertBook) => {
      const response = await apiRequest('POST', '/api/books', bookData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/books'] });
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      setBookForm({
        title: '',
        author: '',
        description: '',
        price: '',
        condition: '',
        genre: '',
        imageUrl: '',
        tags: ''
      });
      toast({
        title: "Book Listed Successfully",
        description: "Your book has been added to the marketplace.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to list your book. Please try again.",
        variant: "destructive",
      });
    }
  });

  const createBlogMutation = useMutation({
    mutationFn: async (blogData: InsertBlog) => {
      const response = await apiRequest('POST', '/api/blogs', blogData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/blogs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
      setBlogForm({
        title: '',
        content: '',
        excerpt: '',
        imageUrl: '',
        tags: ''
      });
      toast({
        title: "Blog Posted Successfully",
        description: "Your blog post has been published.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to publish your blog post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteBookMutation = useMutation({
    mutationFn: async (bookId: number) => {
      await apiRequest('DELETE', `/api/books/${bookId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/books'] });
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      toast({
        title: "Book Removed",
        description: "Your book listing has been removed.",
      });
    }
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (blogId: number) => {
      await apiRequest('DELETE', `/api/blogs/${blogId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/blogs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
      toast({
        title: "Blog Deleted",
        description: "Your blog post has been deleted.",
      });
    }
  });

  // Handlers
  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookData: InsertBook = {
      title: bookForm.title,
      author: bookForm.author,
      description: bookForm.description,
      price: bookForm.price,
      condition: bookForm.condition,
      genre: bookForm.genre,
      imageUrl: bookForm.imageUrl || undefined,
      tags: bookForm.tags ? bookForm.tags.split(',').map(tag => tag.trim()) : [],
      sellerId: user.id
    };

    createBookMutation.mutate(bookData);
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const blogData: InsertBlog = {
      title: blogForm.title,
      content: blogForm.content,
      excerpt: blogForm.excerpt,
      imageUrl: blogForm.imageUrl || undefined,
      tags: blogForm.tags ? blogForm.tags.split(',').map(tag => tag.trim()) : [],
      authorId: user.id
    };

    createBlogMutation.mutate(blogData);
  };

  // Calculate stats
  const totalRevenue = userBooks
    .filter(book => book.isSold)
    .reduce((sum, book) => sum + parseFloat(book.price), 0);

  const activeListings = userBooks.filter(book => !book.isSold).length;

  // Redirect if not authenticated
  if (!user) {
    navigate('/auth');
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
          <p className="text-slate-600">Welcome back, {user.username}!</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-accent" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Active Listings</p>
                  <p className="text-2xl font-bold text-primary">{activeListings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-primary">${totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <PenTool className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Blog Posts</p>
                  <p className="text-2xl font-bold text-primary">{userBlogs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingBag className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Orders</p>
                  <p className="text-2xl font-bold text-primary">{userOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sell-books">Sell Books</TabsTrigger>
            <TabsTrigger value="my-books">My Books</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Books */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Recent Listings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userBooks.slice(0, 3).length > 0 ? (
                    <div className="space-y-4">
                      {userBooks.slice(0, 3).map((book) => (
                        <div key={book.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-semibold text-primary">{book.title}</h4>
                            <p className="text-sm text-slate-600">by {book.author}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-accent">${parseFloat(book.price).toFixed(2)}</p>
                            <Badge variant={book.isSold ? "destructive" : "default"}>
                              {book.isSold ? "Sold" : "Available"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                      <p className="text-slate-600">No books listed yet</p>
                      <Button 
                        className="mt-4" 
                        onClick={() => setActiveTab('sell-books')}
                      >
                        List Your First Book
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Blogs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PenTool className="mr-2 h-5 w-5" />
                    Recent Blog Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userBlogs.slice(0, 3).length > 0 ? (
                    <div className="space-y-4">
                      {userBlogs.slice(0, 3).map((blog) => (
                        <div key={blog.id} className="p-3 border rounded-lg">
                          <h4 className="font-semibold text-primary mb-1">{blog.title}</h4>
                          <p className="text-sm text-slate-600 line-clamp-2">{blog.excerpt}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-slate-500">
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </p>
                            <Link href={`/blogs/${blog.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <PenTool className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                      <p className="text-slate-600">No blog posts yet</p>
                      <Button 
                        className="mt-4" 
                        onClick={() => setActiveTab('blogs')}
                      >
                        Write Your First Post
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sell Books Tab */}
          <TabsContent value="sell-books">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  List a New Book
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBookSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title">Book Title *</Label>
                      <Input
                        id="title"
                        value={bookForm.title}
                        onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                        placeholder="Enter book title"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="author">Author *</Label>
                      <Input
                        id="author"
                        value={bookForm.author}
                        onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                        placeholder="Enter author name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={bookForm.price}
                        onChange={(e) => setBookForm({ ...bookForm, price: e.target.value })}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="condition">Condition *</Label>
                      <Select value={bookForm.condition} onValueChange={(value) => setBookForm({ ...bookForm, condition: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Like New">Like New</SelectItem>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="genre">Genre *</Label>
                      <Select value={bookForm.genre} onValueChange={(value) => setBookForm({ ...bookForm, genre: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fiction">Fiction</SelectItem>
                          <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                          <SelectItem value="Science">Science</SelectItem>
                          <SelectItem value="History">History</SelectItem>
                          <SelectItem value="Philosophy">Philosophy</SelectItem>
                          <SelectItem value="Biography">Biography</SelectItem>
                          <SelectItem value="Romance">Romance</SelectItem>
                          <SelectItem value="Mystery">Mystery</SelectItem>
                          <SelectItem value="Fantasy">Fantasy</SelectItem>
                          <SelectItem value="Self-Help">Self-Help</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={bookForm.imageUrl}
                        onChange={(e) => setBookForm({ ...bookForm, imageUrl: e.target.value })}
                        placeholder="https://example.com/book-cover.jpg"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={bookForm.description}
                      onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                      placeholder="Describe the book's condition, any notable features, etc."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={bookForm.tags}
                      onChange={(e) => setBookForm({ ...bookForm, tags: e.target.value })}
                      placeholder="e.g., classic, literature, bestseller"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={createBookMutation.isPending}
                    className="w-full bg-slate-200 text-black border-black  hover:bg-black hover:text-white"
                  >
                    {createBookMutation.isPending ? "Listing Book..." : "List Book for Sale"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Books Tab */}
          <TabsContent value="my-books">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  My Book Listings ({userBooks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userBooks.length > 0 ? (
                  <div className="space-y-4">
                    {userBooks.map((book) => (
                      <div key={book.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          {book.imageUrl ? (
                            <img 
                              src={book.imageUrl} 
                              alt={book.title}
                              className="w-16 h-20 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-20 bg-slate-200 rounded flex items-center justify-center">
                              <BookOpen className="h-6 w-6 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold text-primary">{book.title}</h4>
                            <p className="text-sm text-slate-600">by {book.author}</p>
                            <p className="text-sm text-slate-500">{book.genre} • {book.condition}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant={book.isSold ? "destructive" : "default"}>
                                {book.isSold ? "Sold" : "Available"}
                              </Badge>
                              <span className="font-bold text-accent">${parseFloat(book.price).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteBookMutation.mutate(book.id)}
                            disabled={deleteBookMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">No Books Listed</h3>
                    <p className="text-slate-500 mb-6">Start selling by listing your first book.</p>
                    <Button onClick={() => setActiveTab('sell-books')}>
                      List Your First Book
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blogs Tab */}
          <TabsContent value="blogs" className="space-y-6">
            {/* Create Blog Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Write a New Blog Post
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBlogSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="blog-title">Title *</Label>
                    <Input
                      id="blog-title"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      placeholder="Enter blog post title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="blog-excerpt">Excerpt *</Label>
                    <Textarea
                      id="blog-excerpt"
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                      placeholder="A brief summary of your blog post"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="blog-content">Content *</Label>
                    <Textarea
                      id="blog-content"
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      placeholder="Write your blog post content here..."
                      rows={8}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="blog-imageUrl">Featured Image URL</Label>
                      <Input
                        id="blog-imageUrl"
                        value={blogForm.imageUrl}
                        onChange={(e) => setBlogForm({ ...blogForm, imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="blog-tags">Tags (comma-separated)</Label>
                      <Input
                        id="blog-tags"
                        value={blogForm.tags}
                        onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                        placeholder="e.g., book review, reading tips, literature"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={createBlogMutation.isPending}
                    className="w-full bg-slate-200 text-black border-black  hover:bg-black hover:text-white"
                  >
                    {createBlogMutation.isPending ? "Publishing..." : "Publish Blog Post"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* My Blogs List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PenTool className="mr-2 h-5 w-5" />
                  My Blog Posts ({userBlogs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userBlogs.length > 0 ? (
                  <div className="space-y-4">
                    {userBlogs.map((blog) => (
                      <div key={blog.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold text-primary">{blog.title}</h4>
                          <p className="text-sm text-slate-600 line-clamp-2">{blog.excerpt}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            Published on {new Date(blog.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link href={`/blogs/${blog.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteBlogMutation.mutate(blog.id)}
                            disabled={deleteBlogMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <PenTool className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">No Blog Posts</h3>
                    <p className="text-slate-500 mb-6">Share your literary insights with the community.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {user.username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-primary">{user.username}</h3>
                      <p className="text-slate-600">{user.email}</p>
                      <p className="text-sm text-slate-500">Member since {new Date().getFullYear()}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" value={user.username} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user.email} readOnly />
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h4 className="text-lg font-semibold text-primary mb-4">Account Actions</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full md:w-auto">
                        Change Password
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={logout}
                        className="w-full md:w-auto ml-0 md:ml-3"
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
