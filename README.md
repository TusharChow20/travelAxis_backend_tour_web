# TravelAxis BD — Backend

The REST API backend for TravelAxis BD. Built with Express.js and MongoDB, it handles authentication, tour management, bookings, payments via SSLCommerz, invoice generation, and email delivery.

🔗 API Base URL: https://backend-travel-axis.vercel.app/api/v1  
🔗 Frontend Repo: https://github.com/TusharChow20/travel-axis-frontend

---

## What This API Does

Provides all the data and logic behind the TravelAxis platform. Handles user auth (credentials and Google OAuth), tour CRUD, booking creation, SSLCommerz payment initiation and validation, PDF invoice generation uploaded to Cloudinary, and email delivery via Nodemailer.

---

## Features

**Auth**

- Credentials login with bcrypt password hashing
- Google OAuth via Passport.js
- JWT access tokens (2d) + refresh tokens (30d) stored as httpOnly cookies with `SameSite=None; Secure` in production
- OTP-based email verification on registration
- Forgot password with time-limited reset token via email

**Tours**

- Full CRUD for tours (admin only)
- Filter by division, tour type, price range
- Search with fuzzy matching (Fuse.js)
- Image upload to Cloudinary via Multer
- Slug-based tour URLs

**Bookings**

- Create booking tied to user and tour
- Track booking status (Pending, Complete, Failed, Cancel)

**Payments**

- SSLCommerz payment initialization
- Success/fail/cancel webhook handling
- Auto PDF invoice generation with PDFKit
- Invoice uploaded to Cloudinary and sent via email with Nodemailer

**Admin**

- Manage users, tours, bookings
- Platform stats: revenue, booking status, payment status, tours by division

---

## Tech Stack

| Layer       | Technology                              |
| ----------- | --------------------------------------- |
| Runtime     | Node.js                                 |
| Framework   | Express.js v5                           |
| Database    | MongoDB with Mongoose                   |
| Auth        | JWT, Passport.js (local + Google OAuth) |
| Payment     | SSLCommerz                              |
| Email       | Nodemailer + EJS templates              |
| PDF         | PDFKit                                  |
| File Upload | Multer + Cloudinary                     |
| Caching     | Redis                                   |
| Validation  | Zod                                     |
| Language    | TypeScript                              |

---

## Project Structure

src/
├── app/
│ ├── config/ # cloudinary, passport, redis, env
│ ├── middlewares/ # checkAuth, globalErrorHandler, notFound
│ ├── modules/
│ │ ├── auth/ # login, refresh, logout, google oauth
│ │ ├── user/ # register, profile, update
│ │ ├── tour/ # CRUD, filtering, search
│ │ ├── booking/ # create and manage bookings
│ │ ├── payment/ # SSLCommerz flow
│ │ ├── otp/ # email verification
│ │ ├── division/ # tour divisions
│ │ ├── stats/ # admin statistics
│ │ └── sslCommerz/ # payment service
│ ├── templates/ # EJS email templates
│ ├── routes/ # central route index
│ └── utils/ # jwt, sendMail, generateInvoice, catchAsync...
├── app.ts
└── server.ts

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas or local MongoDB
- Redis instance
- Cloudinary account
- SSLCommerz sandbox/live credentials
- Google OAuth credentials
- SMTP email credentials

### Installation

```bash
git clone https://github.com/TusharChow20/travelAxis_backend_tour_web
cd travelAxis_backend_tour_web
npm install
```

### Environment Variables

Create a `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES=2d
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRE=30d
BCRYPT_SALT_ROUND=10

SUPER_ADMIN_EMAIL=
SUPER_ADMIN_PASSWORD=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK=http://localhost:5000/api/v1/auth/google/callback

EXPRESS_SESSION_SECRET=
FRONTEND_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

REDIS_HOST=
REDIS_PORT=
REDIS_USERNAME=
REDIS_PASSWORD=

SSL_STORE_ID=
SSL_STORE_PASS=
SSL_PAYMENT_API=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
SSL_VALIDATION_API=https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php
SSL_SUCCESS_URL_BACKEND=http://localhost:5000/api/v1/payment/success
SSL_FAIL_URL_BACKEND=http://localhost:5000/api/v1/payment/fail
SSL_CANCEL_URL_BACKEND=http://localhost:5000/api/v1/payment/cancel
SSL_SUCCESS_URL_FRONTEND=http://localhost:3000/payment/success
SSL_FAIL_URL_FRONTEND=http://localhost:3000/payment/fail
SSL_CANCEL_URL_FRONTEND=http://localhost:3000/payment/cancel
```

### Run Locally

```bash
npm run dev
```

Server starts at `http://localhost:5000`

### Build

```bash
npm run build
```

---

## API Endpoints

| Method | Endpoint                            | Auth  | Description            |
| ------ | ----------------------------------- | ----- | ---------------------- |
| POST   | /auth/login                         | No    | Login with credentials |
| POST   | /auth/refresh-token                 | No    | Get new access token   |
| POST   | /auth/logout                        | No    | Clear cookies          |
| GET    | /auth/google                        | No    | Google OAuth           |
| POST   | /auth/forget-password               | No    | Send reset email       |
| POST   | /auth/reset-password-token          | No    | Reset with token       |
| POST   | /user/register                      | No    | Register new user      |
| GET    | /user/me                            | Yes   | Get current user       |
| GET    | /tour                               | No    | List/filter tours      |
| GET    | /tour/:slug                         | No    | Tour detail            |
| POST   | /tour                               | Admin | Create tour            |
| PATCH  | /tour/:id                           | Admin | Update tour            |
| DELETE | /tour/:id                           | Admin | Delete tour            |
| POST   | /booking                            | User  | Create booking         |
| GET    | /booking/my-bookings                | User  | User bookings          |
| POST   | /payment/initial-payment/:bookingId | User  | Init payment           |
| POST   | /payment/success                    | No    | SSLCommerz webhook     |
| GET    | /payment/my-payments                | User  | Payment history        |

---

## Payment Flow

1. User books a tour → booking record created with status `PENDING`
2. Frontend calls `POST /payment/initial-payment/:bookingId` → backend creates payment record and calls SSLCommerz API → returns `GatewayPageURL`
3. User completes payment on SSLCommerz page
4. SSLCommerz POSTs to `/payment/success` with transaction data
5. Backend validates payment, updates booking to `COMPLETE`, generates PDF invoice, uploads to Cloudinary, emails invoice to user
6. User is redirected to the frontend success page

---

## Developer

**Tushar Chowdhury**  
🔗 [Portfolio](https://tushar-chowdhury-protfolio.vercel.app) · [GitHub](https://github.com/TusharChow20) · [LinkedIn](https://www.linkedin.com/in/tusharchowdhury20211/)
