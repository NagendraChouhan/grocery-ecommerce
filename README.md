# grocery-ecommerce

An online grocery / vegetable store built as a server-rendered Node.js application. Customers can browse products, add them to a cart, save a delivery address and pay online through Razorpay. Admins manage the catalogue and users from a dashboard, and there is a separate employee login.

Built with Express and Handlebars (hbs) templates, MongoDB via Mongoose, JWT auth in cookies, and SendGrid for OTP email.

---

## Features

**For customers**
- Home page showing featured products, ordered by a `priority` field
- Product listing and individual product detail pages
- Cart with quantity increase/decrease, kept in browser `localStorage`
- Signup with email OTP verification before the account is actually created
- Forgot-password flow using the same OTP mechanism
- Multiple saved delivery addresses per account
- Razorpay checkout — an order is created server-side, then the payment signature is verified on return
- Profile page showing account details and past orders
- Contact page

**For admins**
- Dashboard listing all registered users
- Add, update and delete products (name, price, image ID, description, availability)
- Block a user account
- Create employee/admin accounts from the dashboard signup form
- Separate views for product data, update data and delete data

**For employees**
- Separate login that lands on an employee dashboard

**Auth**
- Three account types — user, admin, employee — each with its own collection and its own token list
- JWT stored in a cookie, verified by middleware on every protected route
- Passwords hashed with bcryptjs
- Middleware variants: `userauthentication`, `adminauthanticaton`, `empauthantication`, and a `commanauth(renderTo)` wrapper that decides which view to render based on who is (or isn't) logged in

---

## Tech stack

| Layer | What's used |
|---|---|
| Server | Node.js, Express 4 |
| Views | Handlebars (`hbs`) with partials |
| Database | MongoDB (Atlas, with a localhost fallback) via Mongoose 6 |
| Auth | jsonwebtoken, bcryptjs, cookie-parser |
| Payments | Razorpay |
| Email | SendGrid (`@sendgrid/mail`) for OTPs |
| Validation | `validator` |
| Storage | Firebase is initialised but not actively used for uploads |
| Frontend | Plain CSS (source + minified `css-dist`) and vanilla JS |

---

## Project structure

```
groceryProject/
├── src/
│   ├── app.js                     # Entry point — view engine, static dirs, route mounting
│   ├── db/conn.js                 # Mongo connection (Atlas, falls back to localhost)
│   ├── firebase/firebasesdk.js    # Firebase init
│   ├── middleware/
│   │   └── authentication.js      # user / admin / employee guards + commanauth
│   ├── functionFile/
│   │   └── functions.js           # OTP generation and SendGrid mailer
│   ├── models/
│   │   ├── usermodel.js               # customer + saved addresses + tokens
│   │   ├── adminmodel.js              # admin account
│   │   ├── employemodel.js            # employee account
│   │   ├── verifyuser.js              # pending signup holding an OTP
│   │   ├── productmodel.js            # product catalogue
│   │   └── ordermodel.js              # placed orders
│   ├── routes/
│   │   ├── home.js                # home, product, cart, OTP, password reset, payment
│   │   ├── login.js               # single login handling all three roles
│   │   ├── signup.js              # customer signup → OTP
│   │   ├── address.js             # add a delivery address, then go to pay
│   │   ├── profile.js             # profile and order history
│   │   ├── dashboard.js           # admin dashboard and product CRUD
│   │   └── empdashboard.js        # employee dashboard
│   └── controllers/
│       └── dashboardController.js # currently empty
│
├── views/                         # Handlebars templates
│   ├── index, product, productdetails, addtocart, pay, successful
│   ├── login, signup, otp, profile, address, contact
│   ├── dashboard, addproduct, updatedata, dashboarddeletedata,
│   │   deshboardproductdata, empdashboard
│   └── partials/                  # header, footer, dashboardmenu, addresspartial
│
├── public/
│   ├── CSS/                       # source stylesheets
│   ├── css-dist/                  # minified stylesheets (what the app serves)
│   ├── img/
│   └── js/script.js               # menu, cart quantity, localStorage cart
│
└── package.json
```

---

## Getting started

### Prerequisites
- Node.js 14+ and npm
- MongoDB — either a local instance on port 27017 or a MongoDB Atlas cluster
- A SendGrid account with a verified sender and an API key
- A Razorpay account (test mode is fine) for key ID and secret

### 1. Install

```bash
git clone https://github.com/NagendraChouhan/groceryProject.git
cd groceryProject
npm install
```

### 2. Environment variables

Create a `.env` file in the project root (it is gitignored):

```env
PORT=3000

# Auth — used by the routes that read process.env.JWT_TOKEN
JWT_TOKEN=any_long_random_secret_string

# SendGrid
SENDEMAIL_API_KEY=your_sendgrid_api_key

# Razorpay
KEY_ID=your_razorpay_key_id
SECRET_KEY=your_razorpay_key_secret
```

> The Mongo connection string is currently hardcoded in `src/db/conn.js` rather than read from `.env`. See the security note below — you will want to change this.

### 3. Run

```bash
npm run dev     # nodemon
# or
npm start       # node src/app.js
```

Then open `http://localhost:3000`.

If the Atlas connection fails, `conn.js` automatically retries against `mongodb://localhost:27017/vegitable`, so a local MongoDB works out of the box.

---

## Routes

### Public / customer

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/` | Home page with the top 5 products by priority |
| `GET` | `/product` | Full product listing |
| `GET` | `/productdetails` | Single product detail |
| `GET` | `/addtocart` | Cart page |
| `GET` | `/contact` | Contact page |
| `GET` | `/login` · `POST` `/login` | Login for user, admin or employee |
| `GET` | `/signup` · `POST` `/signup` | Register, sends an OTP |
| `GET` | `/otp` · `POST` `/otp` | Enter the OTP and finish creating the account |
| `POST` | `/forgotPassword` | Start a password reset, mails an OTP |
| `POST` | `/chechupdatepassotp` | Verify the reset OTP |
| `PATCH` | `/updatepassword` | Set the new password |
| `GET` | `/logout` | Clear the session token |
| `GET` | `/address` · `POST` `/address` | Pick or add a delivery address, then continue to pay |
| `POST` | `/pay` | Create a Razorpay order for the cart total |
| `POST` | `/payment` | Verify the Razorpay signature after checkout |
| `GET` | `/profile` · `POST` `/profile` | Profile and order history |

### Admin

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/dashboard` | User list |
| `GET` `POST` | `/dashboard/signup` | Create admin/employee accounts |
| `GET` `POST` | `/dashboard/addproduct` | Add, update, delete a product, or block a user |
| `GET` | `/dashboard/updatedata` | Product list in update mode |
| `GET` `POST` | `/dashboard/deletedata` | Product list in delete mode |
| `GET` | `/dashboard/productdata` | Read-only product table |

### Employee

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/employe` | Employee dashboard |

Note that `/dashboard/addproduct` is a single endpoint that branches on which checkbox was submitted (`deletecheckbox`, `updatecheckbox`, `blockcheckbox`) rather than using separate routes.

---

## Security notes — read before deploying

These are worth fixing before this runs anywhere public:

1. **A live MongoDB Atlas connection string, including the password, is committed in `src/db/conn.js`.** Anyone who has cloned or viewed the repo has full read/write access to that database. Rotate the Atlas password now, move the URI into `.env`, and read it with `process.env`. Note that removing it from the current file does not remove it from the git history — the credential stays recoverable in old commits, so rotation is the part that actually matters.
2. **The JWT signing secret is hardcoded as a literal string** in `usermodel.js`, `adminmodel.js`, `employemodel.js` and `authentication.js`, while several routes verify with `process.env.JWT_TOKEN`. That mismatch means tokens signed by the models will fail verification anywhere the env var differs. Pick one source — `process.env.JWT_TOKEN` — and use it everywhere.
3. **Razorpay signature verification uses the placeholder `"<YOUR_API_SECRET>"`** in `/payment`, so no real signature will ever match. Swap in `process.env.SECRET_KEY`.
4. **The Firebase web config is committed** in `src/firebase/firebasesdk.js`. Web configs are public by design, but if that project is still live, check its rules.
5. **`/dashboard` routes are not behind the admin guard.** `adminauthanticaton` is imported in `dashboard.js` but never applied to the route handlers, so the admin dashboard and product CRUD are reachable without logging in.
6. **The password-hashing hook in `usermodel.js` is commented out.** Customer passwords get hashed during the OTP flow via the `verifyuser` model, but any code path that saves a user password directly would store it in plain text. Login compares with `bcryptjs.compare`, so an unhashed password would simply fail to match.

---

## Known limitations

- The cart lives entirely in `localStorage`, so it is per-browser and is lost on clear-site-data. It is never reconciled against the server.
- The order total falls back to a hardcoded `60000` if the amount query parameter is missing.
- Product images are stored as a `fileID` string rather than uploaded — there is no upload flow, despite Firebase being initialised.
- `src/controllers/dashboardController.js` is empty; all logic sits in the route files.
- Login state is tracked in module-level variables (`login`, `adminlogin`, `emplogin`) shared across requests, which will misbehave with concurrent users.
- There are some typos baked into the schema field names (`decription`, `Famaly`-style spellings, `generateToten`) — worth renaming if you revisit this, but note that changing them requires a data migration.

---

## Author

[Nagendra Chouhan](https://github.com/NagendraChouhan)
