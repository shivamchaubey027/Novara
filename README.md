# Novara Bookstore

*A full-stack marketplace born from a journey into React and an unexpected, but welcome, dive into TypeScript.*

![Project Banner](./screenshots/Home.png)

---

### The Story Behind Novara

This project marks one of my first significant steps into the world of React, built in June 2024. The plan was simple: build a beautiful, functional online bookstore to solidify my front-end skills. However, a project rarely goes exactly as planned, and that's where the real learning begins.

When setting up the project with Vite, I enthusiastically selected the `React + TypeScript` template. At the time, I was focused on React and didn't fully grasp the new layer of complexity I had just opted into. What started as a simple misclick turned into a foundational learning experience.

Faced with a choice, I decided to embrace the challenge. I began by writing the core logic and components in the JavaScript I was comfortable with, and then, piece by piece, I meticulously translated my work into TypeScript. This process, though challenging, was incredibly rewarding. I leaned heavily on documentation and online resources, and through this "trial-by-fire," I gained a deep appreciation for type safety and the robustness it brings to an application.

Novara Bookstore is the result of that journey. It's more than just a portfolio piece; it's a testament to my commitment to learning, adapting, and seeing a challenge through to completion.

### A Glimpse of Novara

*A quick tour of the application's key features.*

| Buyer's Home Page | Buy Page | Product Details Page | Shopping Cart | Blog Platform |
| :---: | :---: | :---: | :---: | :---: |
| ![Buyer's Home Page](./screenshots/Home.png) | ![Buy Page](./screenshots/Buy_Page.png) |  ![Product Details Page](./screenshots/Product_Details.png) | ![Shopping Cart](./screenshots/Checkout_Cart.png) | ![Blog Platform](./screenshots/Blog_Page.png) |
| **Registration Page** | **Dashboards Overview** | **Sellers Dashboard** | **Blog Page** | **Blog Page** |
|![Registration Page](./screenshots/Sign_up.png)|![Dashboard Overview](./screenshots/Dashboard_Overview.png)|![Seller's Dashboard](./screenshots/Dashboard_BookListing.png) |  ![Blog Page](./screenshots/Blog1.png) | ![Dark Mode](./screenshots/Blog2.png) | ![Book Listing Form](./screenshots/image10.png) |


### Core Features

The platform is a complete marketplace designed for both book lovers and sellers.

**For Buyers:**
* **Intuitive Browsing:** Search and filter through a modern, clean interface.
* **Detailed Views:** Access comprehensive information for every book.
* **Persistent Shopping Cart:** Your selections are saved as you browse.
* **Secure Authentication:** Manage your account and orders safely.

**For Sellers:**
* **Personal Dashboard:** A central hub to manage listings, orders, and sales analytics.
* **Simple Listing Process:** Easily create new book listings with image uploads.
* **Community Engagement:** A built-in blog platform to share content and connect with readers.

### The Technology Stack

This project was built with a modern, type-safe stack from front to back.

| Area         | Technology                               | Purpose                                                                      |
| :----------- | :--------------------------------------- | :--------------------------------------------------------------------------- |
| **Frontend** | React 18, TypeScript, Tailwind CSS       | For a modern, type-safe, and beautifully styled user interface.              |
|              | TanStack Query, Wouter, Radix UI         | For efficient server state management, lightweight routing, and accessible UI components. |
| **Backend** | Express.js, TypeScript                 | For a fast, reliable, and type-safe server environment.                      |
|              | Drizzle ORM, Zod                         | For type-safe database queries and robust schema validation.                 |
| **Tooling** | Vite, ESBuild, PostCSS                   | For a lightning-fast development experience and build process.               |

### Running the Project Locally

Want to see it in action? Follow these simple steps.

**Prerequisites:**
* Node.js (version 18 or higher)
* `npm` or `yarn` package manager

**Installation:**

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd novara-bookstore
    ```

2.  **Install all the necessary dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the application:**
    Navigate to `http://localhost:5000` in your web browser.

### For the Curious Recruiter (Technical Deep Dive)

For those who want to look under the hood, here are the project's structural and API details.

<details>
<summary><strong>Project Structure</strong></summary>


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
└── package.json            # Project dependencies


</details>

<details>
<summary><strong>API Endpoints</strong></summary>

* **Authentication**: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
* **Books**: `GET /api/books`, `GET /api/books/:id`, `POST /api/books`, `PUT /api/books/:id`, `DELETE /api/books/:id`
* **Blogs**: `GET /api/blogs`, `GET /api/blogs/:id`, `POST /api/blogs`, `PUT /api/blogs/:id`, `DELETE /api/blogs/:id`
* **Dashboard**: `GET /api/dashboard/books`, `GET /api/dashboard/blogs`, `GET /api/dashboard/orders`

</details>

---

Thank you for visiting my project. Feel free to explore the code, run it yourself, and reach out with any questions.
