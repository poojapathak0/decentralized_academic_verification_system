# Academic Credentials Verification System - Frontend

A modern, interactive React frontend for managing and verifying academic credentials on the blockchain.

## Features

✨ **Key Capabilities**
- **Public Verifier**: Instantly verify academic credentials using Certificate ID or QR code
- **Student Dashboard**: View, download, and share your academic credentials
- **Admin/Institution Dashboard**: Issue, manage, and revoke academic credentials
- **Professional UI**: Beautiful, responsive interface with dark mode support
- **Real-time Notifications**: Toast notifications for all user actions
- **QR Code Support**: Generate and scan QR codes for instant sharing
- **Mobile Optimized**: Fully responsive design for all devices

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - State management
- **React Router v6** - Client-side routing
- **Radix UI** - Accessible component primitives
- **Lucide Icons** - Beautiful icon library
- **react-hot-toast** - Notification system

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Card, Input, etc.)
│   ├── layout/          # Layout components (Navbar, Container)
│   └── shared/          # Shared domain components (CertificateCard, WalletConnectModal)
├── features/            # Feature-based modules
│   ├── admin/           # Admin Dashboard feature
│   ├── student/         # Student Dashboard feature
│   ├── verifier/        # Public Verifier feature
│   └── certificates/    # Shared certificate components
├── pages/               # Main page components
├── store/               # Zustand stores (auth, certificates, ui)
├── lib/
│   ├── api.ts          # API abstraction layer - 100% decoupled from blockchain
│   └── utils.ts        # Utility functions
├── types/              # TypeScript type definitions
├── App.tsx             # Main app component with routing
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd decentralized-academic-verification-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:
```env
VITE_API_URL=http://localhost:3000
VITE_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

## API Layer Architecture

The entire frontend is **100% decoupled** from blockchain, smart contracts, and IPFS through a clean abstraction layer in `src/lib/api.ts`.

### API Functions

```typescript
// Authentication
api.auth.connectWallet()        // Connect user wallet
api.auth.disconnectWallet()     // Disconnect wallet
api.auth.getCurrentUser()       // Get current user data

// Certificate Operations
api.certificates.verify(id)           // Verify certificate by ID
api.certificates.verifyByQRCode(data) // Verify certificate by QR
api.certificates.getByStudent(addr)   // Get student's certificates
api.certificates.getById(id)          // Get specific certificate
api.certificates.download(id)         // Download certificate

// Admin Operations
api.admin.issue(payload)              // Issue new certificate
api.admin.revoke(id)                  // Revoke certificate
api.admin.listCertificates(addr)      // List admin's certificates
api.admin.getDashboardStats(addr)     // Get admin statistics

// QR Code Utilities
api.qrCode.generateQRCode(data)          // Generate QR code
api.qrCode.generateCertificateQRCode(id) // Generate certificate QR
```

### Migration Path

To connect to your backend:
1. Update functions in `src/lib/api.ts` to call your backend APIs
2. No changes needed in components - they only use the API layer
3. All types are predefined and ready for your backend response format

## State Management (Zustand)

Three main stores handle application state:

```typescript
// Authentication
useAuthStore()         // User, wallet, authentication state

// Certificates
useCertificateStore()  // Certificates list, loading, pagination

// UI
useUIStore()           // Dark mode, modals, notifications
```

## Features Breakdown

### 1. Public Verifier Page (`/verify`)
- Search certificates by ID
- Scan QR codes (when connected to backend)
- Display verification results with full details
- Beautiful status badges (Valid/Revoked/Expired)

### 2. Student Dashboard (`/dashboard`)
- View all your certificates
- Statistics: Total, Valid, Credits
- Download certificates
- Share via QR code or link
- Profile information with wallet address

### 3. Admin Dashboard (`/admin`)
- Dashboard statistics and recent issuances
- Issue new certificates with full form
- Manage all issued certificates
- Revoke certificates with confirmation

### 4. Home Page (`/`)
- Hero section with value proposition
- Feature highlights
- Role selection (Verifier, Student, Institution)
- Call-to-action sections

## Styling & Theming

### Dark Mode
- Automatically persisted in localStorage
- Toggle via navbar button
- All components fully styled for both modes

### Color Scheme
- **Primary**: Blue (default actions, highlights)
- **Accent**: Gray (neutral backgrounds, text)
- **Success**: Green
- **Error**: Red
- **Warning**: Yellow

Configured in `tailwind.config.ts`

## Animations

Smooth animations powered by Framer Motion:
- Page transitions
- Card hovers
- Modal open/close
- List item staggering
- Button loading states

## Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly UI elements
- Optimized for all screen sizes

## Testing the Application

### Demo Credentials

**Test Certificate ID**: `cert-001`

**Test Wallet Address**: `0x1234567890123456789012345678901234567890`

### User Roles

1. **Public Verifier** - Access verification page without wallet
2. **Student** - Access personal dashboard
3. **Admin/Institution** - Access admin dashboard

### Demo Flow

1. Visit home page
2. Choose a role and click "Get Started"
3. Enter any valid Ethereum address (0x...)
4. Explore the features in your role

## Production Considerations

### Before Deploying:

1. **Backend Integration**
   - Update `src/lib/api.ts` with real API endpoints
   - Add error handling and retry logic
   - Implement authentication tokens

2. **Security**
   - Add input validation
   - Implement CSRF protection
   - Add rate limiting
   - Secure sensitive data

3. **Performance**
   - Enable code splitting
   - Optimize images
   - Implement lazy loading
   - Add caching strategies

4. **Monitoring**
   - Add error tracking (Sentry)
   - Implement analytics
   - Add performance monitoring

## Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm run build
```

### Port Already in Use
```bash
# Use a different port
npm run dev -- --port 3000
```

### Dark Mode Not Working
- Check localStorage for "darkMode" key
- Ensure `dark` class is applied to html element

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open a GitHub issue or contact the development team.

---

**Built with ❤️ for transparent academic credentialing**
