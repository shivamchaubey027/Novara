import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBookSchema, insertBlogSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";

// Authentication middleware
const authenticatedRoutes = new Set<string>();
let currentUser: any = null;

function requireAuth(req: any, res: any, next: any) {
  if (!currentUser) {
    return res.status(401).json({ message: "Authentication required" });
  }
  req.user = currentUser;
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      currentUser = user;
      res.json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      currentUser = user;
      res.json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      res.status(400).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    currentUser = null;
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!currentUser) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json({ user: { id: currentUser.id, username: currentUser.username, email: currentUser.email } });
  });

  // Book routes
  app.get("/api/books", async (req, res) => {
    try {
      const { search, genre, minPrice, maxPrice, condition } = req.query;
      
      let books;
      if (search) {
        books = await storage.searchBooks(search as string);
      } else if (genre || minPrice || maxPrice || condition) {
        books = await storage.filterBooks({
          genre: genre as string,
          minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
          condition: condition as string
        });
      } else {
        books = await storage.getBooks();
      }
      
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch books" });
    }
  });

  app.get("/api/books/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const book = await storage.getBook(id);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch book" });
    }
  });

  app.post("/api/books", requireAuth, async (req, res) => {
    try {
      const bookData = insertBookSchema.parse({
        ...req.body,
        sellerId: currentUser.id
      });
      
      const book = await storage.createBook(bookData);
      res.status(201).json(book);
    } catch (error) {
      res.status(400).json({ message: "Invalid book data" });
    }
  });

  app.put("/api/books/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const book = await storage.getBook(id);
      
      if (!book || book.sellerId !== currentUser.id) {
        return res.status(404).json({ message: "Book not found or unauthorized" });
      }
      
      const updates = insertBookSchema.partial().parse(req.body);
      const updatedBook = await storage.updateBook(id, updates);
      
      res.json(updatedBook);
    } catch (error) {
      res.status(400).json({ message: "Failed to update book" });
    }
  });

  app.delete("/api/books/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const book = await storage.getBook(id);
      
      if (!book || book.sellerId !== currentUser.id) {
        return res.status(404).json({ message: "Book not found or unauthorized" });
      }
      
      await storage.deleteBook(id);
      res.json({ message: "Book deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete book" });
    }
  });

  // Blog routes
  app.get("/api/blogs", async (req, res) => {
    try {
      const { authorId } = req.query;
      if (authorId) {
        const blogs = await storage.getBlogsByAuthor(parseInt(authorId as string));
        const blogsWithAuthor = await Promise.all(
          blogs.map(async (blog) => {
            const author = await storage.getUser(blog.authorId);
            return {
              ...blog,
              author: {
                id: author!.id,
                username: author!.username,
                email: author!.email
              }
            };
          })
        );
        res.json(blogsWithAuthor);
      } else {
        const blogs = await storage.getBlogs();
        res.json(blogs);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blogs" });
    }
  });

  app.get("/api/blogs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const blog = await storage.getBlog(id);
      
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      
      res.json(blog);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog" });
    }
  });

  app.post("/api/blogs", requireAuth, async (req, res) => {
    try {
      const blogData = insertBlogSchema.parse({
        ...req.body,
        authorId: currentUser.id
      });
      
      const blog = await storage.createBlog(blogData);
      res.status(201).json(blog);
    } catch (error) {
      res.status(400).json({ message: "Invalid blog data" });
    }
  });

  app.put("/api/blogs/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const blog = await storage.getBlog(id);
      
      if (!blog || blog.authorId !== currentUser.id) {
        return res.status(404).json({ message: "Blog not found or unauthorized" });
      }
      
      const updates = insertBlogSchema.partial().parse(req.body);
      const updatedBlog = await storage.updateBlog(id, updates);
      
      res.json(updatedBlog);
    } catch (error) {
      res.status(400).json({ message: "Failed to update blog" });
    }
  });

  app.delete("/api/blogs/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const blog = await storage.getBlog(id);
      
      if (!blog || blog.authorId !== currentUser.id) {
        return res.status(404).json({ message: "Blog not found or unauthorized" });
      }
      
      await storage.deleteBlog(id);
      res.json({ message: "Blog deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog" });
    }
  });

  // User dashboard routes
  app.get("/api/dashboard/books", requireAuth, async (req, res) => {
    try {
      const books = await storage.getBooksBySeller(currentUser.id);
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user books" });
    }
  });

  app.get("/api/dashboard/blogs", requireAuth, async (req, res) => {
    try {
      const blogs = await storage.getBlogsByAuthor(currentUser.id);
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user blogs" });
    }
  });

  app.get("/api/dashboard/orders", requireAuth, async (req, res) => {
    try {
      const orders = await storage.getOrdersByBuyer(currentUser.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Order routes
  app.post("/api/orders", requireAuth, async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse({
        ...req.body,
        buyerId: currentUser.id
      });
      
      const order = await storage.createOrder(orderData);
      
      // Mark book as sold
      await storage.updateBook(orderData.bookId, { isSold: true });
      
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Failed to create order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
