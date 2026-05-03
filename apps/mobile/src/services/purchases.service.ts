import Purchases, {
    CustomerInfo,
    LOG_LEVEL,
    PurchasesOffering,
    PurchasesPackage,
} from 'react-native-purchases';
import { Platform } from 'react-native';

export const ENTITLEMENT_ID = 'Majestor Pro';

const IOS_API_KEY = 'test_MdcxsKqkHBeuZfRPxoKdyyBRRei';
const ANDROID_API_KEY = 'test_MdcxsKqkHBeuZfRPxoKdyyBRRei';

export function configurePurchases(): void {
    Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR);
    if (Platform.OS === 'ios') {
        Purchases.configure({ apiKey: IOS_API_KEY });
    } else if (Platform.OS === 'android') {
        Purchases.configure({ apiKey: ANDROID_API_KEY });
    }
}

export function hasEliteEntitlement(customerInfo: CustomerInfo): boolean {
    return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
}

export function addCustomerInfoListener(
    callback: (info: CustomerInfo) => void
): () => void {
    Purchases.addCustomerInfoUpdateListener(callback);
    return () => Purchases.removeCustomerInfoUpdateListener(callback);
}

export async function getCustomerInfo(): Promise<CustomerInfo> {
    return Purchases.getCustomerInfo();
}

export async function getCurrentOffering(): Promise<PurchasesOffering | null> {
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
    await Purchases.logIn(userId);
}

export async function logoutUser(): Promise<void> {
    try {
        await Purchases.logOut();
    } catch {
        // No-op: logOut throws if the current user is already anonymous
    }
}