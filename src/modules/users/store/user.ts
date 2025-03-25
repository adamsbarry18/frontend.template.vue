import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

/**
 * Interface décrivant la structure d'un utilisateur.
 */
export interface User {
  id: number;
  email: string;
  language: string;
  level: number | null;
  name: string;
  surname: string;
  token: string | null;
  security: any;
  internal: boolean;
  created_time: Date | null;
  passwordStatus: string;
  password_time: Date | null;
  updated_time: Date | null;
  color: string | null;
  preferences: any;
  partitions: any[]; // Vous pouvez typer plus précisément selon vos modèles
}

/**
 * Données fictives pour simuler des utilisateurs.
 */
const dummyUsers: User[] = [
  {
    id: 1,
    email: 'user1@example.com',
    language: 'en',
    level: 2,
    name: 'Alice',
    surname: 'Smith',
    token: null,
    security: null,
    internal: false,
    created_time: new Date('2020-01-01T10:00:00'),
    passwordStatus: '',
    password_time: null,
    updated_time: null,
    color: null,
    preferences: {},
    partitions: [],
  },
];

/**
 * Store Pinia pour la gestion des utilisateurs.
 */
export const useUsersStore = defineStore('users', () => {
  // État
  const users = ref<User[]>(dummyUsers);
  const idCurrentUser = ref<number | null>(null);
  const isLoggingOut = ref(false);
  // Getters
  const currentUser = computed(() =>
    idCurrentUser.value
      ? users.value.find((u) => u.id === idCurrentUser.value) || null
      : null
  );
  const securityToken = computed(() =>
    currentUser.value ? currentUser.value.security : null
  );

  const email = computed(() =>
    currentUser.value ? currentUser.value.email : ''
  );
  const isConnected = computed(() => !!currentUser.value);

  const internal = computed(() =>
    currentUser.value ? currentUser.value.internal : false
  );
  const language = computed(() =>
    currentUser.value ? currentUser.value.language.toLowerCase() : 'en'
  );
  const partitions = computed(() =>
    currentUser.value ? currentUser.value.partitions : false
  );

  const token = computed(() =>
    currentUser.value ? currentUser.value.token : null
  );

  // Actions
  function setCurrentUser(id: number): void {
    idCurrentUser.value = id;
  }

  function addUser(user: User): void {
    users.value.push(user);
  }

  function updateUser(updatedUser: User): void {
    const index = users.value.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      users.value[index] = updatedUser;
    }
  }

  // Simuler une "recherche" d'utilisateur par email
  function getUserByEmail(email: string): User | undefined {
    return users.value.find((u) => u.email === email);
  }

  async function login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> {
    console.log(email, password);
  }

  async function relogin(): Promise<boolean> {
    return true;
  }

  async function logout(): Promise<void> {}

  return {
    users,
    login,
    logout,
    relogin,
    idCurrentUser,
    currentUser,
    email,
    isConnected,
    setCurrentUser,
    addUser,
    updateUser,
    getUserByEmail,
    securityToken,
    internal,
    language,
    partitions,
    isLoggingOut,
    token,
  };
});
