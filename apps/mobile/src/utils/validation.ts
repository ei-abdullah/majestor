/**
 * Validation utilities for form inputs
 */

/**
 * Validates any university email format (validation handled by backend)
 * @param email - Email string to validate
 * @returns true if valid, error message if invalid
 */
export const validateUniEmail = (email: string): true | string => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
        return "Email is required";
    }
    if (!emailRegex.test(email)) {
        return "Invalid email address";
    }
    return true;
};

/**
 * Validates CUST email format (must end with specific domain)
 * @param email - Email string to validate
 * @returns true if valid, error message if invalid
 */
export const validateCustEmail = (email: string): true | string => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@cust\.pk$/;
    if (!email) {
        return "Email is required";
    }
    if (!emailRegex.test(email)) {
        return "Invalid email address";
    }
    return true;
};

/**
 * Validates generic email format
 * @param email - Email string to validate
 * @returns true if valid, error message if invalid
 */
export const validateEmail = (email: string): true | string => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
        return "Email is required";
    }
    if (!emailRegex.test(email)) {
        return "Invalid email format";
    }
    return true;
};

/**
 * Validates Pakistani phone number format (03xxxxxxxxx where x = 0-9)
 * @param phone - Phone number string to validate
 * @returns true if valid, error message if invalid
 */
export const validatePhone = (phone: string): true | string => {
    const phoneRegex = /^03[0-9]{9}$/;
    if (!phone) {
        return "Phone number is required";
    }
    if (!phoneRegex.test(phone)) {
        return "Phone number must be in format 03xxxxxxxxx (11 digits starting with 03)";
    }
    return true;
};

/**
 * Regular expressions exported for direct use
 */
export const REGEX = {
    UNI_EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    CUST_EMAIL: /^[a-zA-Z0-9._%+-]+@cust\.pk$/,
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PHONE: /^03[0-9]{9}$/,
};

