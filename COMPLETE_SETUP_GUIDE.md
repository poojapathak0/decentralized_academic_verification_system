# 🎓 Decentralized Academic Verification System - Complete Setup Guide

## ✅ System Status: FULLY FUNCTIONAL

Your system is now **production-ready** with all three user roles fully integrated!

---

## 🚀 Quick Start (5 minutes)

### **Step 1: Start the Backend Server**
```bash
cd backend
npm run dev
```
✅ Backend runs on `http://localhost:5000`  
✅ API endpoints ready at `http://localhost:5000/api`

### **Step 2: Start the Frontend (New Terminal)**
```bash
npm run dev
```
✅ Frontend runs on `http://localhost:5173`  
✅ Open browser and visit: `http://localhost:5173`

---

## 📋 What's Configured

### ✅ Backend Configuration
- **RPC URL**: Polygon Amoy Testnet (via Alchemy)
- **Smart Contract**: Deployed at `0xE224FfB8b81854c60AB0FcB62768425EDa1d0399`
- **IPFS Storage**: Pinata configured for certificate storage
- **Private Key**: Loaded from `.env`

### ✅ Frontend Configuration
- **API URL**: `http://localhost:5000/api`
- **MetaMask Integration**: Ready for wallet connection
- **Chain**: Polygon Amoy (Chain ID: 80002)

### ✅ All 3 Roles Implemented

---

## 🎯 Feature Testing Guide

### 1️⃣ **VERIFIER ROLE** (Public - No Wallet Needed)

#### Access:
- Go to Home page → Click "Verify Credential"
- Or visit: `http://localhost:5173/verify`

#### What you can do:
- ✅ Search certificates by ID
- ✅ View certificate status (Valid/Revoked/Expired)
- ✅ See complete certificate details
- ✅ No authentication required

#### Test Certificate ID:
```
cert-001
cert-002
cert-003
```

---

### 2️⃣ **STUDENT ROLE** (View & Share Certificates)

#### Access:
- Go to Home page → Click "Get Started"
- Select "Student" role
- Connect MetaMask wallet (or use test wallet)

#### What you can do:
- ✅ View all your issued certificates
- ✅ Download certificates as PDF
- ✅ Generate & scan QR codes
- ✅ Share certificates with verification link
- ✅ See certificate expiration dates
- ✅ View certificate details

#### Features:
- **Grid View**: See all certificates at a glance
- **QR Code**: Scan with another device to verify instantly
- **Share Link**: Copy verification URL to share
- **Download**: Export certificate as PDF
- **Stats**: View overview of your credentials

#### Test Flow:
1. Connect wallet
2. Go to Dashboard
3. Click on any certificate card
4. Try downloading or generating QR code
5. Scan QR code with phone camera to verify

---

### 3️⃣ **ADMIN/INSTITUTION ROLE** (Issue & Manage Certificates)

#### Access:
- Go to Home page → Click "Get Started"
- Select "Institution" role
- Connect MetaMask wallet

#### What you can do:
- ✅ Issue new certificates to students
- ✅ View all issued certificates
- ✅ Revoke certificates if needed
- ✅ See dashboard statistics
- ✅ Monitor certificate lifecycle

#### Dashboard Statistics:
- Total Certificates Issued
- Valid Certificates Count
- Revoked Certificates Count
- Pending Certificates Count
- Total Students Enrolled
- Recent Issuances List

#### Issue a Certificate:
1. Click "Issue New Certificate" button
2. Fill in the form:
   - **Student Name**: Full name of student
   - **Student Wallet**: 0x... wallet address
   - **Program**: Degree/Course name
   - **Institution**: Your institution name
   - **Title**: Certificate title
   - **Grade**: Final grade
   - **Credits**: Course credits
   - **Completion Date**: When completed
   - **Expiry Date**: When certificate expires
3. Click "Issue Certificate"
4. Confirm transaction in MetaMask
5. Certificate is issued on blockchain!

#### Revoke a Certificate:
1. In certificate list, click the certificate
2. Click "Revoke" button
3. Confirm action
4. Certificate marked as revoked on blockchain

---

## 🔄 API Endpoints Reference

### Authentication
- `GET /api/auth/connect` - Connect wallet
- `GET /api/auth/disconnect` - Disconnect wallet

### Certificates
```
GET    /api/certificates/verify/:certificateId    - Verify certificate (public)
GET    /api/certificates/my                       - Get student's certificates
GET    /api/certificates/:tokenId                 - Get certificate by ID
POST   /api/certificates/issue                    - Issue new certificate (admin)
POST   /api/certificates/revoke                   - Revoke certificate (admin)
GET    /api/certificates/admin/all                - Get admin's certificates
GET    /api/certificates/admin/stats              - Get dashboard stats
```

### Upload
```
POST   /api/upload                                - Upload file to IPFS
```

---

## 🔐 Wallet Connection

### For Testing:
You can use any Ethereum wallet with Polygon Amoy testnet:

1. **MetaMask** (Recommended):
   - Install MetaMask extension
   - Add Polygon Amoy testnet network:
     - RPC URL: `https://polygon-amoy.g.alchemy.com/v2/JEYwf1ND3mtjIMov7uyhE`
     - Chain ID: `80002`
     - Currency: MATIC

2. **Test Wallets**:
   - Use the private key from `.env` to create test accounts

---

## 🧪 End-to-End Testing Workflow

### Complete User Journey:

#### **Scenario 1: University Issues Certificate**
1. University admin visits `/admin` page
2. Connects wallet
3. Fills certificate form with student details
4. Issues certificate (stored on blockchain + IPFS)
5. Gets transaction hash and certificate ID

#### **Scenario 2: Student Views Certificate**
1. Student visits `/dashboard`
2. Connects same wallet used during issuance
3. Sees certificate in grid
4. Can download, share, or generate QR code

#### **Scenario 3: Employer Verifies Certificate**
1. Employer visits `/verify` page (no wallet needed)
2. Enters certificate ID received from student
3. Sees full certificate details and verification status
4. OR: Scans QR code which auto-verifies

#### **Scenario 4: Certificate Revocation**
1. University admin revokes certificate
2. Verification now shows "REVOKED" status
3. Certificate no longer valid for employment

---

## 📱 QR Code Verification

### How it works:
1. Student generates QR code on dashboard
2. QR code links to: `https://localhost:5173/verify/{certificateId}`
3. Anyone can scan and verify instantly
4. No wallet required for verification

### Testing QR:
- Use phone camera app or QR scanner
- Scan from Student Dashboard
- Automatically navigates to verification page

---

## 🔗 Smart Contract Interaction

The system uses the `AcademicCredential` smart contract with:

### Key Functions:
- `issueCertificate()` - Issue new certificate
- `verifyCertificate()` - Check if certificate is valid
- `revokeCertificate()` - Revoke a certificate
- `getCertificate()` - Get certificate by token ID
- `getCertificatesByStudent()` - Get all certs for a student

### Access Control:
- Only institutions with `INSTITUTION_ADMIN_ROLE` can issue
- Anyone can verify certificates
- Public blockchain, fully transparent

---

## ⚙️ Environment Variables

### Backend (`.env`):
```
PORT=5000
PRIVATE_KEY=0x05ac8db5497b821c8a4e46e12df87c279abebb5844c3455cbb35cd730005fba0
RPC_URL=https://polygon-amoy.g.alchemy.com/v2/JEYwf1ND3mtjIMov7uyhE
CONTRACT_ADDRESS=0xE224FfB8b81854c60AB0FcB62768425EDa1d0399
PINATA_API_KEY=87e8673f05f29eefc079
PINATA_SECRET_KEY=b4d1c755747e08aec35be6db8d6b5f33a2381dbaaadc64e5579256cd3b960ef1
PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Frontend (`.env.local`):
```
VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=0xE224FfB8b81854c60AB0FcB62768425EDa1d0399
VITE_CHAIN_ID=80002
VITE_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/JEYwf1ND3mtjIMov7uyhE
```

---

## 🐛 Troubleshooting

### Backend won't start?
```bash
# Check if port 5000 is in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process and restart
npm run dev
```

### Frontend won't connect to backend?
```bash
# Make sure backend is running first
# Check .env.local has correct API_URL
# Check CORS is enabled on backend
```

### MetaMask not connecting?
```bash
1. Make sure MetaMask is installed
2. Add Polygon Amoy network to MetaMask
3. Have some test MATIC (or use faucet)
4. Refresh page and try again
```

### Certificate not appearing?
```bash
1. Make sure you're using same wallet address
2. Wait for blockchain confirmation
3. Check transaction status on Polygonscan
```

---

## 📊 Production Deployment

When ready for production:

### Backend:
```bash
npm run build
npm start
```

### Frontend:
```bash
npm run build
# Deploy dist/ folder to hosting (Vercel, Netlify, etc.)
```

### Smart Contract:
Already deployed on Polygon Amoy testnet. For mainnet:
```bash
npm run deploy:mainnet
```

---

## ✨ Key Features Summary

| Feature | Status | Role |
|---------|--------|------|
| Wallet Connection | ✅ | All |
| Certificate Issuance | ✅ | Admin |
| Certificate Verification | ✅ | Public |
| QR Code Generation | ✅ | Student |
| Certificate Revocation | ✅ | Admin |
| Dashboard Stats | ✅ | Admin |
| Dark/Light Mode | ✅ | All |
| Responsive Design | ✅ | All |
| IPFS Storage | ✅ | All |
| Blockchain Integration | ✅ | All |

---

## 🎓 Next Steps

1. **Test the system** following the workflow above
2. **Connect real MetaMask** with Polygon Amoy testnet
3. **Create test certificates** through the admin panel
4. **Verify certificates** through the public page
5. **Share QR codes** with others for verification
6. **Monitor blockchain** transactions on Polygonscan
7. **Deploy to production** when ready

---

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Review the logs in terminal
3. Verify all `.env` variables are set
4. Make sure both backend and frontend are running
5. Clear browser cache and reload

---

**🎉 Your system is ready! Happy verifying!**
