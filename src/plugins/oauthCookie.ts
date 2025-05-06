import router from '@/router';
import { useUsersStore } from '@/stores/modules/users/user';

const CREDS_KEY = 'userCredentials';

function getCookie(name: string): string {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift() || '';
  return '';
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;`;
}

async function login(userCredentials: any): Promise<void> {
  const usersStore = useUsersStore();
  // RAZ schemas - Assuming grantUser action exists in the users store
  await usersStore.login(userCredentials);

  if (window.location.href.includes('/loading')) {
    // Redirect to dashboard without partitionId parameter
    router.push({ name: 'dashboard' });
  }
}

// This logic will run when the module is imported
try {
  const userCredentialsCookie = getCookie(CREDS_KEY);
  if (userCredentialsCookie && userCredentialsCookie !== '') {
    try {
      const userCredentials = JSON.parse(decodeURIComponent(userCredentialsCookie));
      deleteCookie(CREDS_KEY);
      login(userCredentials);
    } catch (parseError) {
      console.error('Error parsing user credentials from cookie', parseError);
      // Optionally handle the error, e.g., clear the invalid cookie
      deleteCookie(CREDS_KEY);
    }
  }
} catch (ex: any) {
  console.error('Error during initial cookie check', ex);
}

export { getCookie, deleteCookie, login };
