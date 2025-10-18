# TicketHub - Event Ticket Booking System

A minimalist black and white themed ticket booking system with eSewa payment integration and admin panel for event management.

## Features

- **Client Side:**
  - Browse and view events
  - Book tickets with eSewa payment integration
  - Responsive design with smooth animations
  - Black and white minimalist theme

- **Admin Side:**
  - Secure admin authentication
  - Create and manage events
  - View event statistics and analytics
  - Event status management

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Payment:** eSewa API integration
- **Forms:** React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ticket-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```env
# eSewa Configuration
NEXT_PUBLIC_ESEWA_MERCHANT_ID=EPAYTEST
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
NEXT_PUBLIC_ESEWA_BASE_URL=https://rc-epay.esewa.com.np
NEXT_PUBLIC_ESEWA_SUCCESS_URL=http://localhost:3000/payment/success
NEXT_PUBLIC_ESEWA_FAILURE_URL=http://localhost:3000/payment/failure
```

**Note:** The above credentials are for testing. For production, replace with your actual eSewa merchant credentials.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Client Features

1. **Browse Events:** View all available events on the homepage
2. **Event Details:** Click on any event to see detailed information
3. **Book Tickets:** Fill in your details and pay with eSewa
4. **Payment:** Secure payment processing through eSewa gateway

### Admin Features

1. **Login:** Use the admin credentials to access the dashboard
   - Username: `admin`
   - Password: `admin123`

2. **Dashboard:** View event statistics and quick actions

3. **Create Events:** Add new events with all necessary details

4. **Manage Events:** View, edit, and delete existing events

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin pages
│   ├── events/            # Event pages
│   ├── payment/           # Payment success/failure pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── services/              # API services
│   └── esewa.ts          # eSewa payment integration
└── types/                 # TypeScript type definitions
    └── index.ts
```

## eSewa Integration

The application integrates with eSewa payment gateway for secure ticket purchases. The integration includes:

- Payment request preparation
- Signature generation
- Payment gateway redirection
- Payment verification
- Success/failure handling

## Customization

### Styling
The application uses a black and white minimalist theme. You can customize colors and styles in:
- `src/app/globals.css` - Global CSS variables and styles
- Tailwind classes throughout components

### Animations
Smooth animations are implemented using Framer Motion. You can customize animations in individual components.

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

For deployment on platforms like Vercel, Netlify, or other hosting services, make sure to:
- Set up environment variables in your hosting platform
- Update eSewa URLs to point to your production domain
- Configure your eSewa merchant account for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
