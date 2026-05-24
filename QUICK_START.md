# Quick Start Guide

## Installation & Setup (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Testing the Application

### 1. **Public Verifier** (No wallet needed)
- Click "Verify Credential" button on homepage
- Enter `cert-001` as the certificate ID
- See the verification result with full details

### 2. **Student Dashboard**
- Click "Get Started" on the homepage
- Select "Student" role
- Enter wallet: `0x1234567890123456789012345678901234567890`
- Explore your certificates, download, and share

### 3. **Admin Dashboard**
- Go back to homepage, click "Get Started"
- Select "Institution" role
- Use same wallet address
- Issue new certificates, view dashboard stats
- Try to revoke certificates

---

## Project Features

✅ **Complete**
- 3 main user roles (Verifier, Student, Admin)
- Professional UI with dark/light mode
- Smooth animations throughout
- Fully responsive design
- API-first architecture
- Mock data for instant testing

✅ **Ready to Connect**
- All API calls in `src/lib/api.ts`
- Replace mock implementations with your backend
- Full TypeScript support
- Zero changes needed in components

✅ **Production Ready**
- Tailwind CSS + shadcn/ui styling
- Form validation ready
- Error handling patterns
- State management with Zustand
- Modal and navigation patterns

---

## File Organization

```
src/
├── components/
│   ├── ui/              # Button, Card, Input, Badge, Skeleton, Tabs, Modal
│   ├── layout/          # Navbar, Container
│   └── shared/          # CertificateCard, WalletConnectModal, LoadingSpinner
├── features/
│   ├── verifier/        # Public verification page
│   ├── admin/           # Institution dashboard
│   ├── student/         # Student dashboard
│   └── certificates/    # Shared certificate logic
├── pages/               # HomePage with role selector
├── store/               # Auth, Certificates, UI state
├── lib/
│   ├── api.ts          # ⭐ All backend integration here
│   └── utils.ts        # Helpers, formatters, validators
└── types/              # TypeScript definitions
```

---

## Next Steps: Connect to Your Backend

### Step 1: Update API Functions
Open `src/lib/api.ts` and replace mock functions with real API calls:

```typescript
// Example - Before (mock):
async connectWallet(): Promise<ApiResponse<WalletConnection>> {
  return { success: true, data: {...}, timestamp: ... }
}

// Example - After (real backend):
async connectWallet(): Promise<ApiResponse<WalletConnection>> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/connect`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  return response.json()
}
```

### Step 2: Update Environment Variables
Edit `.env.local`:
```env
VITE_API_URL=https://your-backend.com
VITE_CONTRACT_ADDRESS=0x...
VITE_IPFS_GATEWAY=https://gateway.pinata.cloud
```

### Step 3: Test Connection
- Components automatically use new API functions
- No UI changes needed
- All TypeScript types validated

---

## Key APIs Ready to Integrate

```typescript
// Authentication
api.auth.connectWallet()
api.auth.disconnectWallet()
api.auth.getCurrentUser()

// Verification
api.certificates.verify(id)
api.certificates.verifyByQRCode(data)

// Student Operations
api.certificates.getByStudent(address)
api.certificates.download(id)

// Admin Operations
api.admin.issue(payload)
api.admin.revoke(id)
api.admin.listCertificates(address)
api.admin.getDashboardStats(address)

// Utilities
api.qrCode.generateCertificateQRCode(id)
```

---

## Build for Production

```bash
npm run build
npm run preview
```

Output in `dist/` directory ready for deployment.

---

## Customization

### Colors
Edit `tailwind.config.ts` - change primary/accent color schemes

### Animations
Edit `src/index.css` - customize Framer Motion animations

### Components
All UI components in `src/components/` are fully customizable

### Dark Mode
Toggle via navbar - persisted to localStorage automatically

---

## Support

- **Types**: All functions are fully typed with TypeScript
- **Components**: Reusable and composable
- **State**: Zustand stores with no dependencies
- **Styling**: Tailwind CSS with dark mode built-in

Everything is production-ready. Just connect your backend! 🚀
