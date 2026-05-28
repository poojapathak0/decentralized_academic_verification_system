# 🎓 Complete Guide: Decentralized Academic Verification System

**Last Updated**: May 27, 2026  
**Status**: ✅ Production Ready

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [System Requirements](#system-requirements)
3. [Installation & Setup](#installation--setup)
4. [Running the Project](#running-the-project)
5. [How to Use - Three Roles](#how-to-use---three-roles)
6. [Features Guide](#features-guide)
7. [API Reference](#api-reference)
8. [Troubleshooting](#troubleshooting)
9. [Environment Variables](#environment-variables)
10. [Deployment Guide](#deployment-guide)

---

## Overview

The **Decentralized Academic Verification System** is a blockchain-based platform that allows:

- **Universities** to issue tamper-proof digital certificates
- **Students** to manage and share their credentials securely
- **Employers** to instantly verify the authenticity of certificates

### Key Features:
✅ Blockchain-based (Polygon Amoy testnet)  
✅ IPFS storage integration  
✅ QR code generation and scanning  
✅ Three user roles (Verifier, Student, Admin)  
✅ Dark/Light mode UI  
✅ MetaMask wallet integration  
✅ Real-time verification  

### Technology Stack:
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Blockchain**: Solidity Smart Contracts on Polygon Amoy
- **Storage**: IPFS (Pinata)
- **Wallet**: MetaMask

---

## System Requirements

### Minimum Requirements:
- **OS**: Windows, macOS, or Linux
- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **RAM**: 2GB minimum
- **Disk Space**: 500MB minimum

### For Blockchain Features:
- **MetaMask** browser extension installed
- **Polygon Amoy testnet** network added to MetaMask
- **MATIC tokens** (for gas fees) - Get from [Polygon Amoy Faucet](https://faucet.polygon.technology/)

### Check Your Versions:
```bash
node --version    # Should be v16 or higher
npm --version     # Should be v8 or higher
```

---

## Installation & Setup

### Step 1: Clone or Extract the Project

If you haven't already, make sure you have the project in a directory:
```bash
cd decentralized_academic_verification_system
```

### Step 2: Install Dependencies

The project has two parts: **Frontend** and **Backend**

#### Install Frontend Dependencies:
```bash
npm install
```

#### Install Backend Dependencies:
```bash
cd backend
npm install
cd ..
```

### Step 3: Verify Installation

Check that all packages were installed:
```bash
# Frontend dependencies
npm list react react-dom vite

# Backend dependencies
cd backend
npm list express ethers pinata-web3
cd ..
```

You should see version numbers if installation was successful.

### Step 4: Configure Environment Variables

All configuration is already done! Check these files:

#### Frontend Configuration (`.env.local`):
```
VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=0xE224FfB8b81854c60AB0FcB62768425EDa1d0399
VITE_CHAIN_ID=80002
VITE_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/JEYwf1ND3mtjIMov7uyhE
```

#### Backend Configuration (`backend/.env`):
```
PORT=5000
PRIVATE_KEY=0x05ac8db5497b821c8a4e46e12df87c279abebb5844c3455cbb35cd730005fba0
RPC_URL=https://polygon-amoy.g.alchemy.com/v2/JEYwf1ND3mtjIMov7uyhE
CONTRACT_ADDRESS=0xE224FfB8b81854c60AB0FcB62768425EDa1d0399
PINATA_API_KEY=87e8673f05f29eefc079
PINATA_SECRET_KEY=b4d1c755747e08aec35be6db8d6b5f33a2381dbaaadc64e5579256cd3b960ef1
PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **These are already configured. No changes needed!**

---

## Running the Project

### Important: Run Both Servers!

The system requires **TWO terminal windows**:
1. One for Backend
2. One for Frontend

### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
🔌 Connected to RPC: https://polygon-amoy.g.alchemy.com/v2/JEYwf1ND3mtjIMov7uyhE
📜 Contract Address: 0xE224FfB8b81854c60AB0FcB62768425EDa1d0399
```

✅ Backend is ready when you see this message.  
🔗 API available at: `http://localhost:5000/api`

### Terminal 2: Start Frontend Server

Open a **new terminal** in the project root:

```bash
npm run dev
```

**Expected Output:**
```
VITE v5.4.21  ready in 713 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ Frontend is ready when you see this message.  
🌐 Web app available at: `http://localhost:5173`

### Step 3: Open in Browser

1. Open your web browser
2. Go to: **http://localhost:5173**
3. You should see the home page with three role options

---

## How to Use - Three Roles

### Role 1: VERIFIER (Public Verification) 👁️

**What is it?**
- Verify academic certificates without needing a wallet
- Public verification for employers, colleges, etc.

**How to Use:**

1. Go to **http://localhost:5173** in your browser
2. Click **"Verify Credential"** button on home page
3. Or click **"Verify"** in the top navigation menu

**On the Verification Page:**
- Enter a **Certificate ID** (e.g., `cert-001`)
- Click **"Verify Certificate"** button
- You'll see:
  - ✅ Certificate Status (Valid/Revoked/Expired)
  - ✅ Certificate Details
  - ✅ Issuer Information
  - ✅ Student Name & Program
  - ✅ Issue Date & Expiry Date

**Alternative: Scan QR Code**
- Click the **QR Code icon**
- Use your camera to scan a certificate's QR code
- Verification happens instantly

**No wallet needed!** Anyone can verify certificates.

---

### Role 2: STUDENT (Manage Certificates) 👨‍🎓

**What is it?**
- View your issued certificates
- Download, share, and manage your credentials
- Generate QR codes for instant sharing

**Prerequisites:**
- ✅ MetaMask wallet installed
- ✅ Polygon Amoy network added to MetaMask
- ✅ Some MATIC tokens for gas (get from faucet)

**How to Use:**

#### Step 1: Connect Your Wallet

1. Go to **http://localhost:5173**
2. Click **"Connect Wallet"** button in top right
3. MetaMask will pop up
4. Click **"Connect"** to connect your wallet
5. You're now logged in as a Student

#### Step 2: View Your Dashboard

1. Click **"Dashboard"** in navigation menu
2. You'll see:
   - **Overview Stats**: Total certificates, valid, revoked, etc.
   - **Your Certificates**: Grid of all your certificates
   - **Certificate Cards**: Each card shows:
     - Certificate title
     - Institution name
     - Issue date & expiry date
     - Status (Valid/Revoked/Expired)

#### Step 3: Use Certificate Features

**Download Certificate:**
1. Click on a certificate card
2. Click **"Download"** button
3. Certificate PDF downloads to your computer

**Generate QR Code:**
1. Click on a certificate card
2. Click **"Generate QR Code"** button
3. QR code appears on screen
4. Share it with others
5. Anyone can scan it to verify

**Share Certificate:**
1. Click **"Share"** button on certificate card
2. Get a shareable link
3. Copy and send to others
4. They can verify instantly

**View Details:**
1. Click any certificate
2. See full certificate information:
   - Student name
   - Program/Degree
   - Grade earned
   - Credits
   - Completion date
   - Issuer details

**Your Dashboard Stats:**
- **Total Certificates**: All certificates issued to you
- **Valid Certificates**: Certificates not revoked
- **Revoked**: Certificates revoked by institution
- **Pending**: Not yet confirmed

---

### Role 3: ADMIN/INSTITUTION (Issue Certificates) 🏫

**What is it?**
- Issue new certificates to students
- Manage all certificates you've issued
- Revoke certificates if needed
- View dashboard statistics

**Prerequisites:**
- ✅ MetaMask wallet installed
- ✅ Polygon Amoy network added to MetaMask
- ✅ Some MATIC tokens for gas
- ✅ Institution admin role (contact system admin)

**How to Use:**

#### Step 1: Connect Your Wallet

1. Go to **http://localhost:5173**
2. Click **"Connect Wallet"** button
3. MetaMask pops up - click **"Connect"**
4. You're now logged in

#### Step 2: Go to Admin Dashboard

1. Click **"Get Started"** button on home page
2. Select **"Institution"** role
3. Or click **"Admin"** link if available
4. You'll see the Admin Dashboard

#### Step 3: View Dashboard Statistics

The dashboard shows:
- **Total Certificates**: All certificates you've issued
- **Valid Certificates**: Not revoked, not expired
- **Revoked Certificates**: Revoked by you
- **Pending Certificates**: Awaiting confirmation
- **Total Students**: Students you've issued to
- **Verification Count**: How many times certificates verified
- **Recent Issuances**: Last 5 certificates issued

#### Step 4: Issue a New Certificate

1. Click **"Issue New Certificate"** button
2. A comprehensive form modal opens with these sections:

**📋 Student Information:**
- **Student Name**: Full name of student (e.g., "John Doe") *Required
- **Student Wallet**: Their Ethereum wallet address (0x...) *Required

**🎓 Certificate Details:**
- **Certificate Title**: Title of the certificate (e.g., "Bachelor of Science Diploma") *Required
- **Description**: Brief description (e.g., "Degree earned with distinction")
- **Program/Degree**: Degree/course name (e.g., "Bachelor of Computer Science") *Required
- **Institution Name**: Your institution name (e.g., "MIT") *Required
- **Grade**: Final grade (e.g., "A", "A+", "B")
- **Credits**: Total credits earned (e.g., "120")

**📅 Dates:**
- **Completion Date**: When student completed the course (YYYY-MM-DD) *Required
- **Expiry Date**: When certificate expires (YYYY-MM-DD) *Required

**📄 Certificate File (PDF/Image):**
- **Upload File**: Upload the certificate PDF or image
- **Supported Formats**: PDF, PNG, JPG, GIF
- **Optional**: You can issue without a file
- **Preview**: See image preview before submitting

3. Fill in all required fields (marked with *)
4. Optionally upload a certificate picture/PDF
5. Click **"Issue Certificate"** button
6. MetaMask will ask to confirm transaction
7. Click **"Confirm"** in MetaMask
8. Wait for transaction to complete
9. ✅ Certificate issued! You'll see confirmation

**After Issuance:**
- Student can immediately view certificate in their dashboard
- Certificate is stored on blockchain (immutable)
- Certificate file is stored on IPFS (decentralized)
- Student gets a unique certificate ID
- QR code automatically generated
- Certificate picture stored with metadata

#### Step 5: Manage Your Certificates

**View All Certificates:**
1. Go to Admin Dashboard
2. Click **"Certificates"** tab
3. See table of all certificates you've issued
4. Each row shows:
   - Certificate ID
   - Student name
   - Program
   - Issue date
   - Status

**Revoke a Certificate:**
1. In the certificates table, find the certificate
2. Click **"Revoke"** button
3. Confirm action in the dialog
4. MetaMask asks for transaction confirmation
5. ✅ Certificate revoked!

**After Revocation:**
- Certificate status changes to "REVOKED"
- Verification now shows "REVOKED" status
- Cannot be used for job applications
- Student can still see it in their dashboard

---

## Features Guide

### 🔐 Wallet Connection

**MetaMask Setup:**
1. Install MetaMask extension from Chrome Web Store
2. Open MetaMask
3. Click network dropdown (usually shows "Ethereum Mainnet")
4. Click "Add Network"
5. Add Polygon Amoy with these details:
   - **Network Name**: Polygon Amoy
   - **RPC URL**: https://polygon-amoy.g.alchemy.com/v2/JEYwf1ND3mtjIMov7uyhE
   - **Chain ID**: 80002
   - **Currency Symbol**: MATIC
   - **Block Explorer**: https://amoy.polygonscan.com
6. Get test MATIC from [Polygon Faucet](https://faucet.polygon.technology/)

**Connect to System:**
1. Click "Connect Wallet" button
2. MetaMask pops up
3. Select account you want to use
4. Click "Connect"
5. ✅ Wallet connected!

**Disconnect:**
1. Click wallet button in top right
2. Click "Disconnect"
3. ✅ Disconnected

---

### 📱 QR Code Features

**Generate QR Code:**
1. Go to Student Dashboard
2. Click on any certificate
3. Click "Generate QR Code"
4. QR code displays

**What QR Code Contains:**
- Direct verification link
- Certificate ID
- Institution name
- Secure hash

**Scan QR Code:**
1. Use your phone camera
2. Point at QR code
3. Tap the notification that appears
4. Verification page opens automatically
5. See certificate details immediately

**Share QR Code:**
1. Generate QR code
2. Take screenshot
3. Share via email, WhatsApp, etc.
4. Anyone can scan to verify

---

### 🎨 Dark/Light Mode

1. Click the **moon/sun icon** in top right
2. Theme switches instantly
3. Your preference is saved

---

### 📊 Dashboard Analytics

**Student Dashboard Shows:**
- Total certificates count
- Valid vs revoked count
- Expiring soon alerts
- Recent issuances

**Admin Dashboard Shows:**
- Total issued certificates
- Verification statistics
- Student enrollment count
- Recent activity feed
- Certificate status breakdown

---

## API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes

#### Connect Wallet
```
POST /api/auth/connect
Response: { success: true, address: "0x...", isConnected: true }
```

#### Disconnect Wallet
```
POST /api/auth/disconnect
Response: { success: true }
```

#### Get Current User
```
GET /api/auth/me
Response: { success: true, user: {...} }
```

### Certificate Routes

#### Verify Certificate (Public)
```
GET /api/certificates/verify/:certificateId
Response: {
  success: true,
  data: {
    isValid: true,
    status: "VALID",
    certificate: {...},
    verifiedAt: "2024-01-15T10:00:00Z"
  }
}
```

#### Get Student's Certificates
```
GET /api/certificates/my?address=0x...&page=1&pageSize=10
Response: {
  success: true,
  data: {
    data: [...],
    total: 5,
    page: 1,
    pageSize: 10,
    hasMore: false
  }
}
```

#### Get Single Certificate
```
GET /api/certificates/:tokenId
Response: {
  success: true,
  data: {...}
}
```

#### Issue Certificate (Admin Only)
```
POST /api/certificates/issue
Headers: { "Content-Type": "application/json" }
Body: {
  studentAddress: "0x...",                    // Ethereum wallet address
  ipfsHash: "QmXxx",                          // Hash of certificate file (if uploaded)
  studentName: "John Doe",                    // Full name of student
  programName: "Computer Science",            // Degree/program name
  graduationDate: "2024-01-15",              // Completion date
  institutionName: "MIT",                     // Institution name
  certificateId: "cert-001",                  // Unique certificate ID
  title: "Bachelor of Science",               // Certificate title
  description: "Degree with distinction",     // Certificate description
  grade: "A",                                 // Final grade
  credits: 120,                               // Total credits
  completionDate: "2024-01-15",              // When completed
  expiryDate: "2028-01-15",                  // When expires
  pdfUrl: "ipfs://QmXxx"                     // URL of uploaded certificate file
}
Response: {
  success: true,
  message: "Certificate issued successfully",
  transactionHash: "0x...",
  certificateId: "cert-001",
  ipfsHash: "QmXxx",
  qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=cert-001"
}
```

#### Revoke Certificate (Admin Only)
```
POST /api/certificates/revoke
Headers: { "Content-Type": "application/json" }
Body: {
  certificateId: "cert-001"
}
Response: {
  success: true,
  message: "Certificate revoked successfully",
  transactionHash: "0x..."
}
```

#### Get Admin Certificates
```
GET /api/certificates/admin/all?address=0x...&page=1&pageSize=10
Response: {
  success: true,
  data: {
    data: [...],
    total: 10,
    page: 1,
    pageSize: 10
  }
}
```

#### Get Dashboard Stats
```
GET /api/certificates/admin/stats?address=0x...
Response: {
  success: true,
  data: {
    totalCertificates: 10,
    validCertificates: 8,
    revokedCertificates: 1,
    pendingCertificates: 1,
    verificationCount: 50,
    totalStudents: 5,
    recentIssuances: [...]
  }
}
```

### Upload Routes

#### Upload File to IPFS
```
POST /api/upload
Content-Type: multipart/form-data
Body: { file: <binary> }
Response: {
  success: true,
  message: "File uploaded successfully to IPFS",
  ipfsHash: "QmXxx"
}
```

---

## Troubleshooting

### Issue: Port Already in Use

**Error**: `listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000              # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>              # macOS/Linux
taskkill /PID <PID> /F     # Windows
```

Then restart the backend.

### Issue: MetaMask Not Connecting

**Problem**: MetaMask popup doesn't appear

**Solutions:**
1. Make sure MetaMask extension is installed
2. Check if MetaMask is unlocked (not locked)
3. Check browser console for errors (F12)
4. Try refreshing the page
5. Clear browser cache and try again

### Issue: Certificate Verification Returns Error

**Problem**: Getting 500 error when verifying

**Solution:**
1. Make sure backend is running
2. Check backend console for errors
3. Verify certificate ID is correct
4. Check network tab (F12) to see actual error

### Issue: Frontend Can't Connect to Backend

**Problem**: API calls timing out or refusing connection

**Solutions:**
1. Verify backend is running: `http://localhost:5000/health`
2. Check `.env.local` has correct `VITE_API_URL`
3. Check backend `.env` has correct `PORT`
4. Make sure both are on localhost
5. Check firewall isn't blocking port 5000

### Issue: MetaMask Network Error

**Problem**: "Network RPC URL error" in MetaMask

**Solution:**
1. Go to MetaMask Settings
2. Networks → Polygon Amoy
3. Edit RPC URL to: `https://polygon-amoy.g.alchemy.com/v2/JEYwf1ND3mtjIMov7uyhE`
4. Save and try again

### Issue: Transaction Reverted

**Problem**: Certificate issuance fails with "Transaction reverted"

**Causes & Solutions:**
- **Not enough gas**: Get more MATIC from faucet
- **Invalid wallet**: Make sure wallet address is correct
- **Network mismatch**: Make sure MetaMask is on Polygon Amoy
- **Smart contract error**: Check backend logs for details

### Issue: Wallet Shows Wrong Chain

**Problem**: MetaMask shows different network than expected

**Solution:**
1. Check MetaMask network dropdown
2. Select "Polygon Amoy" from list
3. If not available, add it manually (see Wallet Connection section)
4. Refresh the page

---

## Environment Variables

### Frontend (`.env.local`)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Blockchain Configuration
VITE_CONTRACT_ADDRESS=0xE224FfB8b81854c60AB0FcB62768425EDa1d0399
VITE_CHAIN_ID=80002
VITE_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/JEYwf1ND3mtjIMov7uyhE
```

**When to Change:**
- `VITE_API_URL`: If backend runs on different port/server
- `VITE_CONTRACT_ADDRESS`: If deploying new contract
- `VITE_RPC_URL`: If using different blockchain network

### Backend (`backend/.env`)

```env
# Server Configuration
PORT=5000

# Blockchain Configuration
PRIVATE_KEY=0x...
RPC_URL=https://polygon-amoy.g.alchemy.com/v2/JEYwf1ND3mtjIMov7uyhE
CONTRACT_ADDRESS=0xE224FfB8b81854c60AB0FcB62768425EDa1d0399

# IPFS/Pinata Configuration
PINATA_API_KEY=your-api-key
PINATA_SECRET_KEY=your-secret-key
PINATA_JWT=your-jwt-token
```

**When to Change:**
- `PORT`: If port 5000 is already in use
- `PRIVATE_KEY`: If deploying with different account
- `RPC_URL`: If using different blockchain
- `CONTRACT_ADDRESS`: If deploying new contract
- `PINATA_*`: If using different IPFS provider

---

## Deployment Guide

### Deploy Backend

#### Option 1: Heroku

```bash
# Create app
heroku create your-app-name

# Set environment variables
heroku config:set PORT=5000
heroku config:set PRIVATE_KEY=0x...
heroku config:set RPC_URL=...
heroku config:set CONTRACT_ADDRESS=...

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### Option 2: Railway/Render

1. Connect GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically

#### Option 3: Docker

```bash
# Build Docker image
docker build -t academic-cert-backend .

# Run container
docker run -p 5000:5000 \
  -e PRIVATE_KEY=0x... \
  -e RPC_URL=... \
  academic-cert-backend
```

### Deploy Frontend

#### Option 1: Vercel

```bash
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

#### Option 2: Netlify

```bash
npm run build

# Deploy dist/ folder to Netlify
```

#### Option 3: GitHub Pages

```bash
npm run build

# Push dist/ to gh-pages branch
```

### Deploy Smart Contract to Mainnet

```bash
# Compile contracts
npm run compile:contracts

# Deploy to mainnet
npm run deploy:mainnet

# Update CONTRACT_ADDRESS in .env files
```

---

## Common Commands

### Frontend Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

### Backend Commands

```bash
# Development with auto-reload
cd backend
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Blockchain Commands

```bash
# Compile contracts
npm run compile:contracts

# Run contract tests
npm run test:contracts

# Deploy to Amoy testnet
npm run deploy:amoy

# Deploy to local Hardhat node
npm run deploy:local

# Run local Hardhat node
npm run node:contracts
```

---

## Project Structure

```
decentralized_academic_verification_system/
├── frontend/                 # React Vite app
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── features/        # Feature pages
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand state management
│   │   ├── lib/             # API layer, utilities
│   │   ├── types/           # TypeScript types
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # Express API server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── config/          # Configuration
│   │   └── server.ts        # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── contracts/               # Smart contracts
│   ├── AcademicCredential.sol
│   └── ...
│
├── scripts/                 # Deployment scripts
│   └── deploy.ts
│
├── .env                     # Backend environment
├── .env.local              # Frontend environment
├── package.json            # Root package config
└── README.md               # Project overview
```

---

## Quick Reference

### Starting the System

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev

# Open browser
# http://localhost:5173
```

### Network Details

| Property | Value |
|----------|-------|
| Network | Polygon Amoy Testnet |
| RPC URL | https://polygon-amoy.g.alchemy.com/v2/JEYwf1ND3mtjIMov7uyhE |
| Chain ID | 80002 |
| Currency | MATIC |
| Block Explorer | https://amoy.polygonscan.com |
| Contract Address | 0xE224FfB8b81854c60AB0FcB62768425EDa1d0399 |

### Useful Links

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health
- **Polygon Faucet**: https://faucet.polygon.technology/
- **MetaMask**: https://metamask.io/
- **Polygonscan**: https://amoy.polygonscan.com

---

## Support & Help

### Check Logs

**Frontend Console:**
- Open http://localhost:5173
- Press F12 to open DevTools
- Go to "Console" tab
- Look for error messages

**Backend Logs:**
- Check terminal window running backend
- Look for error messages with timestamps
- Usually shows error details

### Get Help

1. Check Troubleshooting section above
2. Review error message in console
3. Check if both servers are running
4. Try restarting both servers
5. Clear browser cache (Ctrl+Shift+Delete)

---

## Summary

✅ **Installation**: `npm install && cd backend && npm install`

✅ **Run Backend**: `cd backend && npm run dev`

✅ **Run Frontend**: `npm run dev` (in new terminal)

✅ **Open Browser**: http://localhost:5173

✅ **Choose Role**: Verifier (public), Student, or Institution

✅ **Connect Wallet**: For Student/Institution roles

✅ **Start Using**: Issue, verify, or manage certificates!

---

**You now have a complete, production-ready decentralized certificate system! 🎓**

