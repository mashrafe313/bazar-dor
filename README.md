# বাজার দর (BazarDor)

**BazarDor** is a responsive web application that helps users explore daily market prices of essential products in Bangladesh. Users can browse products by category, view product details, compare prices, and manage their accounts.

## 🌐 Live Website

[https://bazar-dor-mash.vercel.app](https://bazar-dor-mash.vercel.app)

## 📂 GitHub Repository

[https://github.com/mashrafe313/bazar-dor](https://github.com/mashrafe313/bazar-dor)

## 🚀 Technologies Used

- **Next.js 16** – React framework and App Router
- **React** – User interface development
- **TypeScript** – Type-safe development
- **Tailwind CSS** – Styling
- **daisyUI** – UI components
- **Better Auth** – Authentication and social login
- **MongoDB** – Database
- **Vercel** – Deployment
- **Programming Hero BazarDor API** – Market data

## ✨ Key Features

1. **Daily Market Prices** – View daily prices of essential products in Bangladesh.
2. **Product Categories** – Browse products by categories such as rice, lentils, oil, vegetables, and fish.
3. **Product Details** – View individual product information and price details.
4. **Price Comparison** – Compare today's prices with previous prices.
5. **User Authentication** – Sign up and sign in using email and password.
6. **Social Login** – Sign in using Google and GitHub.
7. **User Profile Management** – View and update profile information.
8. **Responsive Design** – Accessible on mobile, tablet, and desktop devices.
9. **Toast Notifications** – Display feedback for user actions.
10. **Custom 404 Page** – Show a friendly page when a route is not found.

## 🔌 API Information

**Main API URL:**

```text
https://openapi.programming-hero.com/api/bazardor
```

**Available Endpoints:**

| Endpoint | Description |
|---|---|
| `/products` | Get all products |
| `/products?category=chal` | Get products by category |
| `/products/1` | Get product details |
| `/categories` | Get all categories |
| `/categories/chal` | Get category details |

## 💻 Run Locally

Follow these steps to run the project on your computer.

### 1. Clone the repository

```bash
git clone https://github.com/mashrafe313/bazar-dor.git
```

### 2. Navigate to the project folder

```bash
cd bazar-dor
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the root directory and add your own credentials:

```env
MONGODB_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```


### 5. Start the development server

```bash
npm run dev
```

### 6. Open the application

Visit:

```text
http://localhost:3000
```

## 📁 Project Structure

```text
bazar-dor/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── category/
│   │   ├── product/
│   │   ├── profile/
│   │   ├── signin/
│   │   └── signup/
│   ├── components/
│   └── lib/
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Deployment

The application is deployed using **Vercel**.

Live URL: https://bazar-dor-mash.vercel.app

## 👨‍💻 Author

**BazarDor Project**

GitHub: https://github.com/mashrafe313/bazar-dor

---

*BazarDor – Making daily market prices easier to explore.*