import { ethers, network } from 'hardhat'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from backend .env
dotenv.config({ path: path.join(__dirname, '../backend/.env') })

async function main() {
  const [deployer] = await ethers.getSigners()

  if (!deployer) {
    throw new Error('No deployer account available. Configure accounts for the target network.')
  }

  const contractAddress = process.env.CONTRACT_ADDRESS
  const backendPrivateKey = process.env.PRIVATE_KEY

  if (!contractAddress) {
    throw new Error('CONTRACT_ADDRESS not found in environment variables')
  }

  if (!backendPrivateKey) {
    throw new Error('PRIVATE_KEY not found in backend/.env')
  }

  // Derive admin address from the backend's private key
  const adminWallet = new ethers.Wallet(backendPrivateKey)
  const adminAddress = adminWallet.address

  console.log(`Network: ${network.name}`)
  console.log(`Deployer: ${deployer.address}`)
  console.log(`Contract Address: ${contractAddress}`)
  console.log(`Backend Wallet Address (to grant role): ${adminAddress}`)

  const AcademicCredential = await ethers.getContractFactory('AcademicCredential')
  const contract = AcademicCredential.attach(contractAddress)

  console.log('\n⏳ Granting INSTITUTION_ADMIN_ROLE...')
  const tx = await contract.grantInstitutionAdmin(adminAddress)
  const receipt = await tx.wait()

  console.log(`✅ Role granted successfully!`)
  console.log(`Transaction Hash: ${receipt?.hash}`)
  console.log(`\nThe backend wallet ${adminAddress} can now issue certificates.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
