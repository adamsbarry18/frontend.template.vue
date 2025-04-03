import { useUsersStore } from '@/stores/modules/users/user';

/**
 * Sets user preference
 * @param key
 * @param value
 */
export async function setUserPreference(
  key: string,
  value: any
): Promise<void> {
  const usersStore = useUsersStore();
  const { isConnected, isLoggingOut } = usersStore;
  if (!isConnected || isLoggingOut) {
    return;
  }
  try {
    await usersStore.setPreference({ key, value });
  } catch (error: any) {
    console.error('An error occurred while updating preferences', error);
  }
}

/**
 * Returns user preference
 * @param key
 * @returns
 */
export function getUserPreference(key: string): any | string | null {
  const usersStore = useUsersStore();
  const { currentUser } = usersStore;
  if (!currentUser) {
    return null;
  }

  const preferenceValue = currentUser.getPreference(key);
  // Fallback in case preference was previously defined in local storage
  if (preferenceValue === null && localStorage.getItem(key)) {
    return localStorage.getItem(key);
  }
  return preferenceValue;
}

export class UserPreferencesStorage {
  getItem(key: string): any | string | null {
    return getUserPreference(key);
  }

  setItem(key: string, value: any): void {
    setUserPreference(key, value);
  }

  removeItem(key: string): void {
    setUserPreference(key, null);
  }
}
