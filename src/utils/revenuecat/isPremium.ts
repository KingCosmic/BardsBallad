import { Purchases } from "@revenuecat/purchases-js";

const isPremium = async (): Promise<boolean> => {
  const purchases = Purchases.getSharedInstance();

  try {
    const customerInfo = await purchases.getCustomerInfo();
    if ("BardsBallad Pro" in customerInfo.entitlements.active) {
      // Grant user access to entitlement
      return true
    }

    return false
  } catch(error) {
    console.error(error);
  }

  return false
}

export default isPremium
