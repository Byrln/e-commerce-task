# E-Commerce Backend API

A comprehensive e-commerce backend built with Next.js 15, TypeScript, Prisma, PostgreSQL, and NextAuth.js.

## Tech Stack

- **Frontend**: Next.js 15, TailwindCSS, Framer Motion, shadcn/ui
- **Backend**: Next.js API Routes, TypeScript
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **Password Hashing**: bcrypt

## Features

### Authentication & Authorization
- User registration and login
- Admin role-based access control
- JWT session management
- Google OAuth integration (optional)
- Password hashing with bcrypt

### Product Management
- CRUD operations for products
- Product categories and features
- Image management
- Inventory tracking
- Product search and filtering
- Pagination support

### Order Management
- Order creation and tracking
- Order status management
- Order history
- Inventory management on orders
- Order cancellation with inventory restoration

### Review System
- Product reviews and ratings
- User-based review restrictions
- Review aggregation and statistics

### Admin Analytics
- Revenue tracking
- Sales analytics
- User and product statistics
- Monthly sales data
- Top-selling products

## Database Schema

The application uses the following main models:

- **User**: User accounts with role-based access
- **Product**: Product catalog with inventory
- **Order**: Order management with items
- **Review**: Product reviews and ratings
- **Analytics**: Business analytics data

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login (NextAuth)
```http
POST /api/auth/signin
```

### Products

#### Get Products
```http
GET /api/products?page=1&limit=10&category=T-Shirts&search=cotton&sort=price_asc
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product Name",
  "price": 29.99,
  "description": "Product description",
  "images": ["/images/product.png"],
  "category": "T-Shirts",
  "features": ["100% Cotton", "Machine Washable"],
  "inventory": 50
}
```

#### Get Product by ID
```http
GET /api/products/[id]
```

#### Update Product (Admin Only)
```http
PUT /api/products/[id]
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 34.99,
  "inventory": 45
}
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/[id]
Authorization: Bearer <token>
```

### Orders

#### Get Orders
```http
GET /api/orders?page=1&limit=10&status=PENDING
Authorization: Bearer <token>
```

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "items": [
    {
      "productId": "product_id_here",
      "quantity": 2,
      "price": 29.99
    }
  ]
}
```

#### Get Order by ID
```http
GET /api/orders/[id]
Authorization: Bearer <token>
```

#### Update Order (Admin Only)
```http
PUT /api/orders/[id]
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "SHIPPED",
  "customerName": "Updated Name"
}
```

#### Cancel Order
```http
DELETE /api/orders/[id]
Authorization: Bearer <token>
```

### Reviews

#### Get Reviews
```http
GET /api/reviews?productId=product_id&rating=5&page=1&limit=10
```

#### Create Review
```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id_here",
  "rating": 5,
  "comment": "Great product!"
}
```

### Admin Analytics

#### Get Analytics Dashboard
```http
GET /api/admin/analytics
Authorization: Bearer <admin_token>
```

Returns:
- Total revenue and growth
- Total orders and growth
- Total users and growth
- Total products
- Recent orders
- Top-selling products
- Sales by category
- Monthly sales data

### Database Seeding

#### Seed Database
```http
POST /api/seed
```

Seeds the database with:
- Admin user (admin@example.com / admin123)
- Test user (user@example.com / user123)
- 8 sample products
- Sample reviews
- Sample order

## Setup Instructions

### 1. Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 2. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
curl -X POST http://localhost:3000/api/seed
```

### 3. Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open Prisma Studio (optional)
npm run db:studio
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

## Authentication

### Default Users

After seeding, you can use these accounts:

**Admin Account:**
- Email: admin@example.com
- Password: admin123
- Role: ADMIN

**Test User Account:**
- Email: user@example.com
- Password: user123
- Role: USER

### Protected Routes

- Admin-only routes require `role: 'ADMIN'`
- User routes require valid authentication
- Public routes: product listing, product details, reviews (read-only)

## Error Handling

All API endpoints include comprehensive error handling with:
- Input validation using Zod schemas
- Authentication checks
- Authorization checks
- Database error handling
- Standardized error responses

## Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- SQL injection prevention (Prisma ORM)
- CORS configuration
- Rate limiting (can be added)

## Performance Features

- Database query optimization
- Pagination for large datasets
- Efficient database indexes
- Connection pooling with Prisma
- Caching strategies (can be extended)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.