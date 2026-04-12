import { Purchases } from "@revenuecat/purchases-js";

/**
 * Opens up paywall and returns a Promise<boolean> indicating whether or not
 * the purchase was successful
 * @returns Promise<boolean>
 */
const presentPaywall = async (): Promise<boolean> => {
  const purchases = Purchases.getSharedInstance();

  try {
    const offerings = await purchases.getOfferings();
    const currentOffering = offerings.current;
    if (!currentOffering) return false;
    const purchaseResult = await purchases.presentPaywall({ offering: currentOffering });
    const { customerInfo, redemptionInfo: _redemptionInfo } = purchaseResult;

    // Handle purchase result
    if ("BardsBallad Pro" in customerInfo.entitlements.active) {
      // Grant user access to entitlement
      return true
    }

    return false
  } catch (error) {
    console.error(error);
  }

  return false
}

export default presentPaywall
