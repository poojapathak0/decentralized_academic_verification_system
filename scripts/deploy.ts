import { ethers, network } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()

  if (!deployer) {
    throw new Error('No deployer account available. Configure accounts for the target network.')
  }

  console.log(`Deploying AcademicCredential from: ${deployer.address}`)
  console.log(`Network: ${network.name}`)

  const AcademicCredential = await ethers.getContractFactory('AcademicCredential')
  const academicCredential = await AcademicCredential.deploy()

  await academicCredential.waitForDeployment()

  const contractAddress = await academicCredential.getAddress()
  console.log(`AcademicCredential deployed to: ${contractAddress}`)

  if (network.name === 'localhost' || network.name === 'hardhat') {
    console.log('Grant an institution admin role before issuing certificates:')
    console.log(`  await contract.grantInstitutionAdmin('${deployer.address}')`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})