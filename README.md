# Novara Bookstore

A modern, full-stack bookstore application built with React, TypeScript, Express, and Tailwind CSS. Novara provides an elegant marketplace for buying and selling books, featuring a sophisticated user interface and comprehensive functionality for both buyers and sellers.

## Features

### For Buyers
- Browse available books with advanced filtering and search
- View detailed product pages with comprehensive book information
- Shopping cart functionality with persistent storage
- Secure user authentication and account management
- Responsive design optimized for all devices

### For Sellers
- Personal dashboard for managing listings and sales
- Easy book listing with image upload support
- Blog platform for sharing content with the community
- Sales analytics and order management
- Revenue tracking and performance metrics

### Additional Features
- Real-time toast notifications for user feedback
- Dark mode support throughout the application
- Elegant UI with smooth animations and transitions
- SEO-optimized pages for better discoverability
- Mobile-first responsive design

## Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Wouter** - Lightweight client-side routing
- **TanStack Query** - Server state management
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Backend
- **Express.js** - Fast, minimalist web framework
- **TypeScript** - End-to-end type safety
- **Zod** - Schema validation library
- **Drizzle ORM** - Type-safe database toolkit

### Development Tools
- **Vite** - Fast build tool and development server
- **ESBuild** - Ultra-fast JavaScript bundler
- **PostCSS** - CSS transformation tool
- **TSX** - TypeScript execution environment

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Modern web browser

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd novara-bookstore
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5000`

## Project Structure

```
novara-bookstore/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   └── main.tsx        # Application entry point
├── server/                 # Backend Express server
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Data storage layer
│   └── vite.ts             # Vite integration
├── shared/                 # Shared TypeScript definitions
│   └── schema.ts           # Database schemas and types
├── package.json            # Project dependencies
├── tailwind.config.ts      # Tailwind CSS configuration
├── vite.config.ts          # Vite build configuration
└── tsconfig.json           # TypeScript configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Books
- `GET /api/books` - Fetch all books with optional filtering
- `GET /api/books/:id` - Get single book details
- `POST /api/books` - Create new book listing (authenticated)
- `PUT /api/books/:id` - Update book listing (authenticated)
- `DELETE /api/books/:id` - Delete book listing (authenticated)

### Blogs
- `GET /api/blogs` - Fetch all blog posts
- `GET /api/blogs/:id` - Get single blog post
- `POST /api/blogs` - Create new blog post (authenticated)
- `PUT /api/blogs/:id` - Update blog post (authenticated)
- `DELETE /api/blogs/:id` - Delete blog post (authenticated)

### Dashboard
- `GET /api/dashboard/books` - Get user's book listings
- `GET /api/dashboard/blogs` - Get user's blog posts
- `GET /api/dashboard/orders` - Get user's orders

## Data Models

### User
- id: Unique identifier
- username: Display name
- email: Email address
- password: Encrypted password
- createdAt: Account creation timestamp

### Book
- id: Unique identifier
- title: Book title
- author: Author name
- description: Book description
- price: Sale price
- condition: Book condition (New, Like New, Very Good, Good, Fair)
- genre: Book category
- imageUrl: Cover image URL
- tags: Searchable tags
- sellerId: Reference to seller user
- isSold: Sale status
- createdAt: Listing creation timestamp

### Blog
- id: Unique identifier
- title: Blog post title
- content: Full blog content
- excerpt: Short description
- imageUrl: Featured image URL
- tags: Searchable tags
- authorId: Reference to author user
- createdAt: Publication timestamp

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run type-check

# Lint code
npm run lint
```

## Configuration

### Environment Variables
The application uses in-memory storage by default. For production deployment, configure the following environment variables:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - Database connection string (if using external database)

### Tailwind CSS
The application uses a custom Tailwind configuration with:
- Custom color palette optimized for the bookstore theme
- Extended typography settings for better readability
- Custom animations and transitions
- Dark mode support

## Storage

The application currently uses an in-memory storage system suitable for development and demonstration purposes. For production deployment, the storage layer can be easily replaced with:

- PostgreSQL with Drizzle ORM
- SQLite for lightweight deployments
- MongoDB for document-based storage
- Any database supported by Drizzle ORM

## Authentication

The application implements a simple session-based authentication system. Users can:
- Register new accounts with email and password
- Log in to access protected features
- Maintain login state across browser sessions
- Access role-based features (buyer/seller)

## UI Components

The application uses a comprehensive component library built on Radix UI primitives:
- Buttons with multiple variants and states
- Form components with validation
- Modal dialogs and overlays
- Navigation components
- Data display components
- Feedback components (toasts, alerts)

## Responsive Design

The application is fully responsive and optimized for:
- Desktop computers (1024px and above)
- Tablets (768px to 1023px)
- Mobile phones (below 768px)
- High-DPI displays and retina screens

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## Performance Optimization

The application includes several performance optimizations:
- Code splitting at the route level
- Lazy loading of images and components
- Optimized bundle sizes with tree shaking
- Efficient re-rendering with React Query caching
- Compressed assets for faster loading

## Security Features

- Input validation with Zod schemas
- XSS protection through React's built-in escaping
- CSRF protection for state-changing operations
- Secure password handling
- Session management with secure cookies

## Testing

The application is structured to support comprehensive testing:
- Unit tests for utility functions
- Component tests with React Testing Library
- Integration tests for API endpoints
- End-to-end tests with Playwright

## Deployment

The application can be deployed to various platforms:
- Vercel (recommended for frontend)
- Netlify for static hosting
- Railway for full-stack deployment
- Heroku for traditional hosting
- Docker containers for custom deployments

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For support and questions:
- Open an issue on GitHub
- Check the documentation for common solutions
- Review the troubleshooting section in the installation guide

## Changelog

### Version 1.0.0
- Initial release with core bookstore functionality
- User authentication and registration
- Book listing and browsing
- Shopping cart implementation
- Blog platform integration
- Responsive design implementation
- Dashboard for sellers