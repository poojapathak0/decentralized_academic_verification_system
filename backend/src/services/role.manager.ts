import { contract, wallet } from "../config/blockchain";

export class RoleManager {
  static readonly INSTITUTION_ADMIN_ROLE = "0x3cbf79c0df6c2e8b1c8d1b5b5e5f5a5b5c5d5e5f"; // This is a placeholder

  /**
   * Check if the backend wallet has the INSTITUTION_ADMIN_ROLE
   */
  static async hasAdminRole(): Promise<boolean> {
    try {
      // The INSTITUTION_ADMIN_ROLE is defined in the contract as keccak256('INSTITUTION_ADMIN_ROLE')
      const roleBytes = await contract.INSTITUTION_ADMIN_ROLE();
      
      const hasRole = await contract.hasRole(roleBytes, wallet.address);
      return hasRole;
    } catch (error) {
      console.error("[RoleManager] Error checking admin role:", error);
      return false;
    }
  }

  /**
   * Get the admin wallet address
   */
  static getAdminAddress(): string {
    return wallet.address;
  }

  /**
   * Get role information for logging
   */
  static async getRoleInfo(): Promise<{
    adminAddress: string;
    hasAdminRole: boolean;
  }> {
    const hasRole = await this.hasAdminRole();
    return {
      adminAddress: wallet.address,
      hasAdminRole: hasRole,
    };
  }
}
