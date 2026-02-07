// Authentication Utilities for SKKN Architect Pro
// Manages admin login and phone-based feature activation

const STORAGE_KEYS = {
  ADMIN_LOGGED_IN: 'skkn_admin_logged_in',
  USER_PHONE: 'skkn_user_phone',
  PENDING_PHONES: 'skkn_pending_phones',
  ACTIVATED_PHONES: 'skkn_activated_phones',
};

// Admin credentials (hardcoded for simplicity)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '123',
};

/**
 * Validate admin credentials
 */
export const validateAdminCredentials = (username: string, password: string): boolean => {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
};

/**
 * Check if admin is currently logged in
 */
export const isAdmin = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_LOGGED_IN) === 'true';
};

/**
 * Log in as admin
 */
export const loginAdmin = (): void => {
  localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED_IN, 'true');
};

/**
 * Log out admin
 */
export const logoutAdmin = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED_IN);
};

/**
 * Get current user's phone number
 */
export const getCurrentUserPhone = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.USER_PHONE);
};

/**
 * Set current user's phone number
 */
export const setCurrentUserPhone = (phone: string): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PHONE, phone);
};

/**
 * Get list of pending phone registrations
 */
export const getPendingPhones = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_PHONES) || '[]');
  } catch {
    return [];
  }
};

/**
 * Get list of activated phone numbers
 */
export const getActivatedPhones = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVATED_PHONES) || '[]');
  } catch {
    return [];
  }
};

/**
 * Check if current user's phone is activated
 */
export const isUserActivated = (): boolean => {
  const userPhone = getCurrentUserPhone();
  if (!userPhone) return false;

  const activatedPhones = getActivatedPhones();
  return activatedPhones.includes(userPhone);
};

/**
 * Check if user can access premium features
 * Returns true if admin OR user phone is activated
 */
export const canAccessFeature = (): boolean => {
  return isAdmin() || isUserActivated();
};

/**
 * Register a phone number for activation (add to pending list)
 */
export const registerPhone = (phone: string): { success: boolean; error?: string } => {
  // Validate phone format (Vietnamese: 10-11 digits starting with 0)
  const phoneRegex = /^0\d{9,10}$/;
  if (!phoneRegex.test(phone)) {
    return { success: false, error: 'Số điện thoại không hợp lệ (10-11 số, bắt đầu bằng 0)' };
  }

  // Check for duplicates
  const pendingPhones = getPendingPhones();
  const activatedPhones = getActivatedPhones();

  if (pendingPhones.includes(phone)) {
    return { success: false, error: 'Số điện thoại này đang chờ duyệt' };
  }

  if (activatedPhones.includes(phone)) {
    return { success: false, error: 'Số điện thoại này đã được kích hoạt' };
  }

  // Add to pending list
  pendingPhones.push(phone);
  localStorage.setItem(STORAGE_KEYS.PENDING_PHONES, JSON.stringify(pendingPhones));

  // Set as current user phone
  setCurrentUserPhone(phone);

  return { success: true };
};

/**
 * Activate a phone number (move from pending to activated)
 */
export const activatePhone = (phone: string): void => {
  // Remove from pending
  const pendingPhones = getPendingPhones().filter(p => p !== phone);
  localStorage.setItem(STORAGE_KEYS.PENDING_PHONES, JSON.stringify(pendingPhones));

  // Add to activated if not already there
  const activatedPhones = getActivatedPhones();
  if (!activatedPhones.includes(phone)) {
    activatedPhones.push(phone);
    localStorage.setItem(STORAGE_KEYS.ACTIVATED_PHONES, JSON.stringify(activatedPhones));
  }
};

/**
 * Deactivate a phone number (remove from activated list)
 */
export const deactivatePhone = (phone: string): void => {
  const activatedPhones = getActivatedPhones().filter(p => p !== phone);
  localStorage.setItem(STORAGE_KEYS.ACTIVATED_PHONES, JSON.stringify(activatedPhones));
};

/**
 * Check if a phone number is in pending list
 */
export const isPhonePending = (phone: string): boolean => {
  return getPendingPhones().includes(phone);
};

/**
 * Check if a phone number is activated
 */
export const isPhoneActivated = (phone: string): boolean => {
  return getActivatedPhones().includes(phone);
};
