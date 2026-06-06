# Fixing "Failed to Issue Certificate" - INSTITUTION_ADMIN_ROLE Issue

## Problem

When you try to issue a certificate as a university admin, you get this error:
```
Failed to issue certificate on-chain: execution reverted (unknown custom error)
```

## Root Cause

The smart contract `AcademicCredential` has role-based access control. The `issueCertificate()` function requires the caller to have the `INSTITUTION_ADMIN_ROLE`. 

When you try to issue a certificate, the backend wallet (derived from `PRIVATE_KEY` in `backend/.env`) attempts to call this function, but it doesn't have the required role, so the transaction reverts.

### Why This Happens

1. The contract is deployed and the deployer gets `DEFAULT_ADMIN_ROLE`
2. But the backend wallet (which issues certificates) needs `INSTITUTION_ADMIN_ROLE`
3. Someone with `DEFAULT_ADMIN_ROLE` must explicitly grant `INSTITUTION_ADMIN_ROLE` to the backend wallet

## Solution

You need to grant the `INSTITUTION_ADMIN_ROLE` to the backend wallet. Follow these steps:

### Step 1: Get Your Backend Wallet Address

The backend uses the `PRIVATE_KEY` from `backend/.env`. To find out what wallet address this corresponds to, you can:

**Option A: Use the grant admin role script (Easiest)**
```bash
npm run grant-admin-role
```

This script will:
1. Read your `PRIVATE_KEY` from `backend/.env`
2. Derive the wallet address
3. Grant the `INSTITUTION_ADMIN_ROLE` to that wallet
4. Confirm the role was granted

**Option B: Manual approach**
1. Visit [Remix IDE](https://remix.ethereum.org/)
2. Import your `backend/.env` PRIVATE_KEY
3. Or use a script to derive the address from the private key

### Step 2: Verify the Role Was Granted

You can verify by checking the contract on Polygon Amoy block explorer:

1. Go to [Polygon Amoy Testnet Explorer](https://amoy.polygonscan.com/)
2. Search for your contract address: `0xE224FfB8b81854c60AB0FcB62768425EDa1d0399`
3. View the transactions to confirm the `grantInstitutionAdmin()` transaction succeeded

### Step 3: Test Certificate Issuance

Now you should be able to:
1. Log in as University Admin
2. Go to the Admin Dashboard
3. Click "Issue Certificate"
4. Fill in the form and submit

## Technical Details

### Contract Role Check
```solidity
function issueCertificate(...) external onlyRole(INSTITUTION_ADMIN_ROLE) {
    // Function body
}
```

The `onlyRole` modifier checks if the caller has the required role. If not, it reverts with a custom error.

### Backend Wallet Configuration
```javascript
// backend/.env
PRIVATE_KEY=0x05ac8db5497b821c8a4e46e12df87c279abebb5844c3455cbb35cd730005fba0
CONTRACT_ADDRESS=0xE224FfB8b81854c60AB0FcB62768425EDa1d0399
```

The backend creates a wallet from this private key and uses it to sign all contract transactions.

## Troubleshooting

### Still Getting the Error After Running the Script?

1. **Verify the transaction succeeded:**
   ```bash
   npm run grant-admin-role
   ```
   Look for "✅ Role granted successfully!" message and the transaction hash

2. **Check the contract is deployed:**
   - Make sure `CONTRACT_ADDRESS` in `backend/.env` is correct
   - Verify the contract exists on Polygon Amoy explorer

3. **Restart the backend server:**
   ```bash
   # In backend folder
   npm run dev
   ```

### The Script Says "No Signer Available"

This means you need to have an account that can sign transactions:
1. Make sure you're using the correct Hardhat network configuration
2. The account running the script should be the deployer or have `DEFAULT_ADMIN_ROLE`

## Prevention for Next Time

To avoid this in the future:

1. **Auto-grant on deployment:** Modify `scripts/deploy.ts` to automatically grant the role
2. **Documentation:** Keep this guide handy
3. **Environment setup:** Include role setup in your initialization checklist

## Related Files

- Smart Contract: `contracts/AcademicCredential.sol`
- Deployment Script: `scripts/deploy.ts`
- Role Grant Script: `scripts/grantAdminRole.ts`
- Backend Config: `backend/src/config/blockchain.ts`
