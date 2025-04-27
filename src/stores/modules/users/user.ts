import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import UserModel from './models/UserModel';
import { useApiStore } from '@/stores/modules/api';
import { debounce } from '@/libs/utils/Debounce';
import { updateActiveLanguage } from '@/libs/utils/Language';
import { ServerError } from '@/libs/utils/Errors';
import { useAuthorisationsStore } from '../auth/authorisations';

const LEVEL_USER = {
  EXTERNAL: 1,
  READER: 2,
  USER: 3,
  INTEGRATOR: 4,
  ADMIN: 5,
};

export const useUsersStore = defineStore('users', () => {
  // État
  const idCurrentUser = ref<number | string | null>(null);
  const fetched = ref(false);
  const isLoggingOut = ref(false);
  const users = ref<UserModel[]>([]);

  // Persist de l'ID de l'utilisateur courant (adapter via plugin persistant de Pinia)
  // Par exemple, via pinia-plugin-persistedstate

  const currentUser = computed(() => {
    if (!idCurrentUser.value) return null;
    return users.value.find((u) => u.id === idCurrentUser.value) || null;
  });

  // Exemple de getters
  const levelForUser = computed(() => {
    const authStore = useAuthorisationsStore();
    return authStore.levelForCurrentUser;
  });

  const email = computed(() =>
    currentUser.value ? currentUser.value.email : null
  );
  const token = computed(() =>
    currentUser.value ? currentUser.value.token : null
  );
  const securityToken = computed(() =>
    currentUser.value ? currentUser.value.security : null
  );
  const isConnected = computed(() => !!currentUser.value);
  const internal = computed(() =>
    currentUser.value ? currentUser.value.internal : false
  );
  const language = computed(() =>
    currentUser.value?.preferences?.language?.toLowerCase?.() || 'en'
  );

  const getAll = computed(() => users.value);
  const getUser = (userId: number | string) => {
    return users.value.find((u) => u.id === userId) || null;
  };

  const getAdmins = computed(() => {
    return users.value.filter(
      (user) => !user.internal && user.level === LEVEL_USER.ADMIN
    );
  });

  const userColorFromId = (userId: number) => {
    const user = getUser(userId);
    const DEFAULT_COLORS = [
      '#fc842c',
      '#b43893',
      '#c98963',
      '#4e8cd4',
      '#18bc91',
      '#cf454a',
    ];
    if (!user || !user.color) {
      return DEFAULT_COLORS[userId % DEFAULT_COLORS.length];
    }
    return user.color;
  };

  const getInitial = computed(() => {
    return currentUser.value && currentUser.value.name
      ? currentUser.value.name.substring(0, 1).toUpperCase()
      : '-';
  });

  // Actions

  function getCredentials() {
    let cleanedPassword = window.localStorage.keepPassword || '';
    if (
      cleanedPassword.length > 2 &&
      cleanedPassword.startsWith('"') &&
      cleanedPassword.endsWith('"')
    ) {
      cleanedPassword = cleanedPassword.slice(1, -1);
    }
    return {
      email: (window.localStorage.keepEmail || '').replace(/"/g, ''),
      password: cleanedPassword,
      isHashed: true,
    };
  }

  function handleAuthenticationError(error): never {
    if (error.response?.status === 401) {
      throw 'BAD_CREDENTIALS';
    } else if ([400, 403, 422].includes(error.response?.status)) {
      throw error.response.data ? error.response.data.data.code : error;
    } else {
      throw new ServerError('users', 'handleAuthenticationError', error);
    }
  }

  function hasValidCredentials() {
    return (
      window.localStorage.keepEmail &&
      window.localStorage.keepEmail.replace(/"/g, '').length &&
      window.localStorage.keepPassword &&
      window.localStorage.keepPassword.replace(/"/g, '').length
    );
  }

  const apiStore = useApiStore();

  async function ensureUsers() {
    if (!fetched.value) {
      debounce(async () => {
        await fetchUsers();
      }, 300)();
    }
    return true;
  }

  async function fetchUsers() {
    try {
      const response = await apiStore.api.get('/users');
      users.value = response.data.data.map((u: any) => UserModel.fromAPI(u));
      fetched.value = true;
    } catch (error) {
      throw new ServerError('users', 'fetchUsers', error, {});
    }
  }

  async function fetchUser(userId: number | string) {
    try {
      const response = await apiStore.api.get(`/users/${userId}`);
      const user = UserModel.fromAPI(response.data.data);
      const index = users.value.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        users.value[index] = user;
      } else {
        users.value.push(user);
      }
      return user;
    } catch (error) {
      throw new ServerError('users', 'fetchUser', error, { userId });
    }
  }

  async function fetchCurrentUser() {
    try {
      const response = await apiStore.api.get('/users/me');
      const user = UserModel.fromAPI(response.data.data);
      idCurrentUser.value = user.id;
      const index = users.value.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        users.value[index] = user;
      } else {
        users.value.push(user);
      }
      return user;
    } catch (error) {
      throw new ServerError('users', 'fetchCurrentUser', error);
    }
  }

  async function login({ email, password }) {
    if (!email || !password) {
      throw new Error('Bad credentials');
    }
    try {
      await apiStore.api.post('/auth/login', { data: { email, password } });
      await fetchCurrentUser();
      return true;
    } catch (error) {
      if (error.message === 'Internal only') {
        throw 'INTERNAL_ONLY';
      }
      handleAuthenticationError(error);
    }
  }

  async function relogin() {
    if (hasValidCredentials()) {
      const credentials = getCredentials();
      await login(credentials);
      return true;
    }
    throw "Can't login";
  }

  async function logout() {
    try {
      await apiStore.api.post('/auth/logout');
      idCurrentUser.value = null;
      users.value = [];
      fetched.value = false;
    } catch (error) {
      throw new ServerError('users', 'logout', error);
    }
  }

  function grantUser(user: UserModel) {
    if (!user) throw 'User not defined';
    sessionStorage.setItem('user', JSON.stringify(user));
    const userInstance = new UserModel(user);
    const index = users.value.findIndex((u) => u.id === userInstance.id);
    if (index !== -1) {
      users.value[index] = userInstance;
    } else {
      users.value.push(userInstance);
    }
    const lang = user.preferences?.language;
    if (lang) {
      updateActiveLanguage(lang.toLowerCase(), false);
    }
    idCurrentUser.value = user.id;
  }

  async function resetPassword({ email }: { email: string }) {
    try {
      await apiStore.api.post('/api/v1/password/reset', {
        data: { email },
      });
    } catch (error) {
      handleAuthenticationError(error);
    }
  }

  async function changePassword({
    email,
    password,
    newPassword,
  }: {
    email: string;
    password: string;
    newPassword: string;
  }) {
    try {
      await apiStore.api.post('/api/v1/password/update', {
        data: { email, password, newPassword },
        skipAuthErrorInterceptor: true,
      });
    } catch (error) {
      handleAuthenticationError(error);
    }
  }

  async function confirmResetPassword({
    email,
    password,
    code,
  }: {
    email: string;
    password: string;
    code: string;
  }) {
    try {
      await apiStore.api.post(`/api/v1/password/reset/${code}/confirm`, {
        data: { email, password },
      });
    } catch (error) {
      handleAuthenticationError(error);
    }
  }

  async function passwordConfirm({ code }: { code: string }) {
    try {
      await apiStore.api.post(`/api/v1/password/${code}/confirm`, {});
    } catch (error) {
      throw new ServerError('users', 'passwordConfirm', error, {});
    }
  }

  /**
   * Recherche un utilisateur par id numérique ou email (route RESTful backend)
   * @param identifier string | number (id ou email)
   * @returns UserModel | null
   */
  async function searchUser(identifier: string | number): Promise<UserModel | null> {
    try {
      const response = await apiStore.api.get(`/users/${identifier}`);
      return response.data && response.data.data ? UserModel.fromAPI(response.data.data) : null;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      if (error.response?.status === 403) {
        return null;
      }
      throw new ServerError('users', 'searchUser', error, { identifier });
    }
  }

  async function updateUser(user: UserModel) {
    try {
      await apiStore.api.put(`/users/${user.id}`, { data: user.toAPI() });
      user.updatedAt = new Date();
      const index = users.value.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        users.value[index] = user;
      }
    } catch (error) {
      throw new ServerError('users', 'updateUser', error, { user });
    }
  }

  async function setPreference({ key, value }) {
    try {
      if (!currentUser.value) return;
      const clonedUser = currentUser.value.clone();
      clonedUser.setPreference(key, value);
      clonedUser.updatedAt = new Date();
      const index = users.value.findIndex((u) => u.id === clonedUser.id);
      if (index !== -1) {
        users.value[index] = clonedUser;
      }
      await apiStore.api.put(
        `/users/${clonedUser.id}/preferences/${key}`,
        { data: { value } }
      );
    } catch (error) {
      throw new ServerError('users', 'setPreference', error, { key, value });
    }
  }

  async function addUser({ email, language, color, name, surname, password }) {
    try {
      const data: Partial<UserModel> & { password?: string } = {
        email,
        internal: internal.value,
        level: 3,
        name,
        color,
        surname,
        password,
        preferences: { language },
      };
      const response = await apiStore.api.post('/users', { data });
      const newUser = UserModel.fromAPI(response.data.data);
      users.value.push(newUser);
      return newUser.id;
    } catch (err) {
      throw new ServerError('users', 'addUser', err, { email, language, color, name, surname });
    }
  }

  // Supprime un utilisateur par son id
  async function deleteUser(userId: number | string) {
    if (!userId) throw new Error('Aucun userId fourni');
    try {
      await apiStore.api.delete(`/users/${userId}`);
    } catch (error) {
      throw new ServerError('users', 'deleteUser', error, { userId });
    }
    if (currentUser.value && currentUser.value.id === userId) {
      await logout();
    }
  }

  return {
    idCurrentUser,
    fetched,
    isLoggingOut,
    currentUser,
    id: idCurrentUser,
    levelForUser,
    email,
    token,
    securityToken,
    isConnected,
    internal,
    language,
    getAll,
    getAdmins,
    getInitial,
    getUser,
    userColorFromId,
    ensureUsers,
    fetchUsers,
    fetchUser,
    login,
    relogin,
    logout,
    grantUser,
    resetPassword,
    changePassword,
    confirmResetPassword,
    passwordConfirm,
    searchUser,
    updateUser,
    setPreference,
    addUser,
    deleteUser,
  };
});
