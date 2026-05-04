import Purchases, {
    CustomerInfo,
    LOG_LEVEL,
    PurchasesOffering,
    PurchasesPackage,
} from 'react-native-purchases';
import { Platform } from 'react-native';

export const ENTITLEMENT_ID = 'Majestor Pro';

// Set to true once RevenueCat is legally cleared and production keys are ready
export const PURCHASES_ENABLED = false;

const IOS_API_KEY = 'test_MdcxsKqkHBeuZfRPxoKdyyBRRei';
const ANDROID_API_KEY = 'test_MdcxsKqkHBeuZfRPxoKdyyBRRei';

export function configurePurchases(): void {
    if (!PURCHASES_ENABLED) return;
    Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR);
    if (Platform.OS === 'ios') {
        Purchases.configure({ apiKey: IOS_API_KEY });
    } else if (Platform.OS === 'android') {
        Purchases.configure({ apiKey: ANDROID_API_KEY });
    }
}

// While purchases are disabled, everyone is treated as elite
export function hasEliteEntitlement(customerInfo: CustomerInfo): boolean {
    if (!PURCHASES_ENABLED) return true;
    return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
}

export function addCustomerInfoListener(
    _callback: (info: CustomerInfo) => void
): () => void {
    if (!PURCHASES_ENABLED) return () => {};
    Purchases.addCustomerInfoUpdateListener(_callback);
    return () => Purchases.removeCustomerInfoUpdateListener(_callback);
}

export async function getCustomerInfo(): Promise<CustomerInfo> {
    return Purchases.getCustomerInfo();
}

export async function getCurrentOffering(): Promise<PurchasesOffering | null> {
    if (!PURCHASES_ENABLED) return null;
    const offerings = await Purchases.getOfferings();
    return offerings.current;
}

export async function purchasePackage(pkg: PurchasesPackage): Promise<CustomerInfo> {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo;
}

export async function restorePurchases(): Promise<CustomerInfo> {
    return Purchases.restorePurchases();
}

export async function loginUser(userId: string): Promise<void> {
    if (!PURCHASES_ENABLED) return;
    await Purchases.logIn(userId);
}

export async function logoutUser(): Promise<void> {
    if (!PURCHASES_ENABLED) return;
    try {
        await Purchases.logOut();
    } catch {
        // No-op: logOut throws if the current user is already anonymous
    }
}