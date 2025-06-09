import { 
  users, 
  books, 
  blogs, 
  orders,
  type User, 
  type InsertUser,
  type Book,
  type InsertBook,
  type Blog,
  type InsertBlog,
  type Order,
  type InsertOrder,
  type BookWithSeller,
  type BlogWithAuthor
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Book operations
  getBooks(): Promise<BookWithSeller[]>;
  getBook(id: number): Promise<BookWithSeller | undefined>;
  getBooksBySeller(sellerId: number): Promise<Book[]>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: number, updates: Partial<InsertBook>): Promise<Book | undefined>;
  deleteBook(id: number): Promise<boolean>;
  searchBooks(query: string): Promise<BookWithSeller[]>;
  filterBooks(filters: { genre?: string; minPrice?: number; maxPrice?: number; condition?: string; }): Promise<BookWithSeller[]>;
  
  // Blog operations
  getBlogs(): Promise<BlogWithAuthor[]>;
  getBlog(id: number): Promise<BlogWithAuthor | undefined>;
  getBlogsByAuthor(authorId: number): Promise<Blog[]>;
  createBlog(blog: InsertBlog): Promise<Blog>;
  updateBlog(id: number, updates: Partial<InsertBlog>): Promise<Blog | undefined>;
  deleteBlog(id: number): Promise<boolean>;
  
  // Order operations
  getOrdersByBuyer(buyerId: number): Promise<Order[]>;
  getOrdersBySeller(sellerId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private books: Map<number, Book>;
  private blogs: Map<number, Blog>;
  private orders: Map<number, Order>;
  private currentUserId: number;
  private currentBookId: number;
  private currentBlogId: number;
  private currentOrderId: number;

  constructor() {
    this.users = new Map();
    this.books = new Map();
    this.blogs = new Map();
    this.orders = new Map();
    this.currentUserId = 1;
    this.currentBookId = 1;
    this.currentBlogId = 1;
    this.currentOrderId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Book operations
  async getBooks(): Promise<BookWithSeller[]> {
    const books = Array.from(this.books.values());
    return books.map(book => ({
      ...book,
      seller: {
        id: book.sellerId,
        username: this.users.get(book.sellerId)?.username || "Unknown",
        email: this.users.get(book.sellerId)?.email || "unknown@email.com"
      }
    }));
  }

  async getBook(id: number): Promise<BookWithSeller | undefined> {
    const book = this.books.get(id);
    if (!book) return undefined;
    
    return {
      ...book,
      seller: {
        id: book.sellerId,
        username: this.users.get(book.sellerId)?.username || "Unknown",
        email: this.users.get(book.sellerId)?.email || "unknown@email.com"
      }
    };
  }

  async getBooksBySeller(sellerId: number): Promise<Book[]> {
    return Array.from(this.books.values()).filter(book => book.sellerId === sellerId);
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const id = this.currentBookId++;
    const book: Book = {
      ...insertBook,
      id,
      isSold: false,
      createdAt: new Date()
    };
    this.books.set(id, book);
    return book;
  }

  async updateBook(id: number, updates: Partial<InsertBook>): Promise<Book | undefined> {
    const book = this.books.get(id);
    if (!book) return undefined;
    
    const updatedBook = { ...book, ...updates };
    this.books.set(id, updatedBook);
    return updatedBook;
  }

  async deleteBook(id: number): Promise<boolean> {
    return this.books.delete(id);
  }

  async searchBooks(query: string): Promise<BookWithSeller[]> {
    const allBooks = await this.getBooks();
    const lowerQuery = query.toLowerCase();
    
    return allBooks.filter(book => 
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      book.description?.toLowerCase().includes(lowerQuery) ||
      book.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async filterBooks(filters: { genre?: string; minPrice?: number; maxPrice?: number; condition?: string; }): Promise<BookWithSeller[]> {
    const allBooks = await this.getBooks();
    
    return allBooks.filter(book => {
      if (filters.genre && book.genre !== filters.genre) return false;
      if (filters.condition && book.condition !== filters.condition) return false;
      if (filters.minPrice && parseFloat(book.price) < filters.minPrice) return false;
      if (filters.maxPrice && parseFloat(book.price) > filters.maxPrice) return false;
      return true;
    });
  }

  // Blog operations
  async getBlogs(): Promise<BlogWithAuthor[]> {
    const blogs = Array.from(this.blogs.values());
    return blogs.map(blog => ({
      ...blog,
      author: {
        id: blog.authorId,
        username: this.users.get(blog.authorId)?.username || "Unknown",
        email: this.users.get(blog.authorId)?.email || "unknown@email.com"
      }
    }));
  }

  async getBlog(id: number): Promise<BlogWithAuthor | undefined> {
    const blog = this.blogs.get(id);
    if (!blog) return undefined;
    
    return {
      ...blog,
      author: {
        id: blog.authorId,
        username: this.users.get(blog.authorId)?.username || "Unknown",
        email: this.users.get(blog.authorId)?.email || "unknown@email.com"
      }
    };
  }

  async getBlogsByAuthor(authorId: number): Promise<Blog[]> {
    return Array.from(this.blogs.values()).filter(blog => blog.authorId === authorId);
  }

  async createBlog(insertBlog: InsertBlog): Promise<Blog> {
    const id = this.currentBlogId++;
    const blog: Blog = {
      ...insertBlog,
      id,
      createdAt: new Date()
    };
    this.blogs.set(id, blog);
    return blog;
  }

  async updateBlog(id: number, updates: Partial<InsertBlog>): Promise<Blog | undefined> {
    const blog = this.blogs.get(id);
    if (!blog) return undefined;
    
    const updatedBlog = { ...blog, ...updates };
    this.blogs.set(id, updatedBlog);
    return updatedBlog;
  }

  async deleteBlog(id: number): Promise<boolean> {
    return this.blogs.delete(id);
  }

  // Order operations
  async getOrdersByBuyer(buyerId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.buyerId === buyerId);
  }

  async getOrdersBySeller(sellerId: number): Promise<Order[]> {
    const sellerBookIds = (await this.getBooksBySeller(sellerId)).map(book => book.id);
    return Array.from(this.orders.values()).filter(order => sellerBookIds.includes(order.bookId));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      id,
      orderDate: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
}

export const storage = new MemStorage();
