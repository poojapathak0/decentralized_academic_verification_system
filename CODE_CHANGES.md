# Code Changes Summary

## 1. Backend Service: blockchain.service.ts

### Added at top of file:
```typescript
import { wallet } from "../config/blockchain";  // Added import for wallet

// Track certificates by admin address
const adminCertificates: { [adminAddress: string]: any[] } = {};  // NEW

const ADMIN_ADDRESS = wallet.address.toLowerCase();  // NEW - Admin wallet address
```

### In issueCertificate() - After transaction receipt:
```typescript
// Store blockchain certificate WITH admin tracking
const certData = {
  id: certificateId,
  studentAddress,
  ipfsHash,
  studentName,
  programName,
  graduationDate,
  institutionName,
  certificateId,
  issueDate: new Date().toISOString(),
  isRevoked: false,
  hash: receipt.hash,
  blockNumber: receipt.blockNumber,
  transactionHash: receipt.hash,
  isTestMode: false,
  adminAddress: ADMIN_ADDRESS,  // NEW - Track which admin issued this
};

issuedCertificates[certificateId] = certData;

// Track by admin address  // NEW SECTION
if (!adminCertificates[ADMIN_ADDRESS]) {
  adminCertificates[ADMIN_ADDRESS] = [];
}
adminCertificates[ADMIN_ADDRESS].push(certData);

// Added detailed debug logging
console.log(`[BlockchainService] ✅ Certificate issued successfully`);
console.log(`  - Certificate ID: ${certificateId}`);
console.log(`  - Student: ${studentName} (${studentAddress})`);
console.log(`  - Admin: ${ADMIN_ADDRESS}`);
console.log(`  - Total certs by admin: ${adminCertificates[ADMIN_ADDRESS].length}`);
```

### In issueCertificateTestMode() - Similar changes:
```typescript
const certData = {
  // ... existing fields ...
  adminAddress: ADMIN_ADDRESS,  // NEW
};

// NEW - Track by admin
if (!adminCertificates[ADMIN_ADDRESS]) {
  adminCertificates[ADMIN_ADDRESS] = [];
}
adminCertificates[ADMIN_ADDRESS].push(certData);

// NEW - Better logging
console.log(`[BlockchainService] 🧪 TEST MODE Certificate created`);
console.log(`  - Admin: ${ADMIN_ADDRESS}`);
console.log(`  - Total certs by admin: ${adminCertificates[ADMIN_ADDRESS].length}`);
```

### NEW METHOD - Get certificates by admin:
```typescript
/**
 * Get certificates by admin address
 */
static getCertificatesByAdmin(adminAddress: string) {
  try {
    const normalizedAddress = adminAddress.toLowerCase();
    console.log(`[BlockchainService] 📊 Fetching certificates for admin: ${normalizedAddress}`);

    if (!adminAddress || !adminAddress.startsWith('0x')) {
      throw new Error(`Invalid admin address: ${adminAddress}`);
    }

    const certs = adminCertificates[normalizedAddress] || [];
    console.log(`[BlockchainService] Found ${certs.length} certificates for admin ${normalizedAddress}`);

    return certs;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[BlockchainService] Error fetching admin certificates: ${errorMessage}`, error);
    throw error;
  }
}

/**
 * Get all test certificates (improved logging)
 */
static getAllTestCertificates() {
  console.log(`[BlockchainService] 📋 Getting all certificates (test mode + blockchain)`);
  console.log(`  - Test mode certs: ${Object.keys(testCertificates).length}`);
  console.log(`  - Blockchain certs: ${Object.keys(issuedCertificates).length}`);

  return [
    ...Object.values(testCertificates),
    ...Object.values(issuedCertificates)
  ];
}
```

---

## 2. Backend Controller: certificate.controller.ts

### Fixed getAllAdminCertificates():
```typescript
// BEFORE (Broken):
static async getAllAdminCertificates(req: Request, res: Response, next: NextFunction) {
  try {
    const adminAddress = req.query.address as string;
    
    if (!adminAddress) {
      return res.status(400).json({ 
        success: false, 
        message: "Admin address is required" 
      });
    }

    // ❌ WRONG - Trying to fetch with zero address!
    let blockchainCerts: any[] = [];
    try {
      blockchainCerts = await BlockchainService.getCertificatesByStudent('0x0000000000000000000000000000000000000000');
    } catch (e) {
      // Expected to fail - just use test mode
    }
    // ... rest of broken logic ...
  }
}

// AFTER (Fixed):
static async getAllAdminCertificates(req: Request, res: Response, next: NextFunction) {
  try {
    const adminAddress = req.query.address as string;

    if (!adminAddress) {
      console.error(`[CertificateController] ❌ Admin address is required`);
      return res.status(400).json({
        success: false,
        message: "Admin address is required"
      });
    }

    console.log(`[CertificateController] 📊 Fetching certificates for admin: ${adminAddress}`);

    // ✅ CORRECT - Use new getCertificatesByAdmin method
    const allCerts = BlockchainService.getCertificatesByAdmin(adminAddress);

    console.log(`[CertificateController] ✅ Found ${allCerts.length} certificates for admin ${adminAddress}`);

    // Map to proper format
    const mappedCerts = allCerts.map((cert: any) => ({
      id: cert.id || cert.certificateId || '',
      certificateId: cert.certificateId || '',
      studentAddress: cert.studentAddress || '',
      studentName: cert.studentName || '',
      ipfsHash: cert.ipfsHash || cert.pdfUrl || '',
      isRevoked: cert.isRevoked || false,
      status: (cert.isRevoked || false) ? 'revoked' : 'valid',
      issueDate: cert.issueDate ? (typeof cert.issueDate === 'string' ? cert.issueDate : new Date(Number(cert.issueDate) * 1000).toISOString()) : new Date().toISOString(),
      certificateData: {
        studentName: cert.studentName || '',
        title: cert.certificateId || 'Certificate',
        description: cert.programName || '',
        program: cert.programName || '',
        institution: cert.institutionName || '',
        completionDate: cert.graduationDate || '',
      },
      adminAddress: cert.adminAddress || adminAddress,
      isTestMode: cert.isTestMode || false,
    }))

    res.status(200).json({
      success: true,
      data: {
        data: mappedCerts,
        total: mappedCerts.length,
        page: 1,
        pageSize: 100,
        totalPages: 1,
      }
    });
  } catch (error) {
    console.error(`[CertificateController] ❌ Error in getAllAdminCertificates:`, error);
    next(error);
  }
}
```

### Fixed getDashboardStats():
```typescript
// BEFORE (Broken):
// Got ALL certificates, not filtered by admin

// AFTER (Fixed):
static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
  try {
    const adminAddress = req.query.address as string;

    if (!adminAddress) {
      console.error(`[CertificateController] ❌ Admin address is required for stats`);
      return res.status(400).json({
        success: false,
        message: "Admin address is required"
      });
    }

    console.log(`[CertificateController] 📈 Fetching dashboard stats for admin: ${adminAddress}`);

    // ✅ CORRECT - Get admin-specific certificates
    const adminCerts = BlockchainService.getCertificatesByAdmin(adminAddress);

    console.log(`[CertificateController] Found ${adminCerts.length} total certificates for admin`);

    // Calculate stats from admin-filtered data
    const totalCerts = adminCerts.length;
    const validCerts = adminCerts.filter((c) => !c.isRevoked).length;
    const revokedCerts = adminCerts.filter((c) => c.isRevoked).length;
    const uniqueStudents = new Set(adminCerts.map((c) => c.studentAddress)).size;

    // Get recent issuances
    const recentIssuances = adminCerts
      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
      .slice(0, 5)
      .map((cert: any) => ({
        id: cert.id || cert.certificateId || '',
        certificateId: cert.certificateId || '',
        studentName: cert.studentName || 'Unknown',
        certificateData: {
          title: cert.certificateId || 'Certificate',
          description: cert.programName || '',
        },
      }));

    console.log(`[CertificateController] ✅ Stats: Total=${totalCerts}, Valid=${validCerts}, Revoked=${revokedCerts}, Students=${uniqueStudents}`);

    res.status(200).json({
      success: true,
      data: {
        totalCertificates: totalCerts,  // ✅ NOW SHOWS ACTUAL COUNT
        validCertificates: validCerts,
        revokedCertificates: revokedCerts,
        pendingCertificates: 0,
        verificationCount: totalCerts,
        issuedByMe: totalCerts,
        totalStudents: uniqueStudents,
        recentIssuances: recentIssuances,
        adminAddress: adminAddress,
        testModeWarning: totalCerts > 0 && adminCerts.some((c: any) => c.isTestMode) 
          ? "⚠️ TEST MODE: Some certificates are in test mode (not on blockchain)." 
          : undefined
      }
    });
  } catch (error) {
    console.error(`[CertificateController] ❌ Error in getDashboardStats:`, error);
    next(error);
  }
}
```

---

## 3. Frontend: AdminDashboardPage.tsx

### Added comprehensive debug logging:
```typescript
const loadData = async () => {
  setIsLoading(true)

  const adminAddress = wallet?.address || '0xe54275B5142200caEe678788362C4328D6D1dCB2'

  // ✅ NEW - Debug logging
  console.log(`[AdminDashboard] 📊 Loading data for admin: ${adminAddress}`)

  try {
    const [statsRes, certsRes] = await Promise.all([
      api.admin.getDashboardStats(adminAddress),
      api.admin.listCertificates(adminAddress),
    ])

    // ✅ NEW - Log responses
    console.log(`[AdminDashboard] Stats response:`, statsRes)
    console.log(`[AdminDashboard] Certificates response:`, certsRes)

    if (statsRes.success && statsRes.data) {
      setStats(statsRes.data)
      console.log(`[AdminDashboard] ✅ Loaded ${statsRes.data.totalCertificates} total certificates`)
    } else if (!statsRes.success) {
      console.error('[AdminDashboard] Dashboard stats error:', statsRes.error)
      toast.error(statsRes.error?.message || 'Failed to load dashboard stats')
    }

    if (certsRes.success && certsRes.data) {
      setCertificates(certsRes.data.data)
      console.log(`[AdminDashboard] ✅ Loaded ${certsRes.data.data.length} certificates for display`)
    } else if (!certsRes.success) {
      console.error('[AdminDashboard] Certificates error:', certsRes.error)
      toast.error(certsRes.error?.message || 'Failed to load certificates')
    }
  } catch (error) {
    console.error('[AdminDashboard] Dashboard loading error:', error)
    toast.error('Failed to load dashboard data')
  } finally {
    setIsLoading(false)
  }
}
```

---

## Summary of Changes

| File | What Changed | Why |
|------|--------------|-----|
| `blockchain.service.ts` | Added admin certificate tracking | Certificates now organized by admin |
| `certificate.controller.ts` | Fixed admin queries | Now retrieves certificates for specific admin |
| `AdminDashboardPage.tsx` | Added debug logging | Easier to diagnose issues |

## Result
✅ Admin dashboard now shows correct certificate count  
✅ Certificates properly tracked by admin address  
✅ Comprehensive logging for debugging  
✅ Both test mode and blockchain certificates tracked  
