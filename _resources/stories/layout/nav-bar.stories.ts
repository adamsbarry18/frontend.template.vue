import { ref, computed } from 'vue';
import UNavBar from '@/modules/ui/layout/UNavBar.vue';
import { NavItem } from '@/modules/ui/layout/navbar.types';

export default {
  title: 'Layout/NavBar',
};

export const TopBar = () => ({
  components: { UNavBar },
  setup() {
    const cartItemCount = ref(3);
    const searchQuery = ref('');

    const topBarItems = computed<NavItem[]>(() => [
      { id: 'home', label: 'Accueil', type: 'link', value: '/' },
      { id: 'shop', label: 'Boutique', type: 'link', value: '/shop' },
      { id: 'news', label: 'Nouveautés', type: 'link', value: '/news' },
      { id: 'contact', label: 'Contact', type: 'link', value: '/contact' },
      {
        id: 'search',
        label: 'Rechercher',
        type: 'search',
        align: 'right',
        action: 'search',
        props: { placeholder: 'Rechercher...', modelValue: searchQuery.value, overflowSideShow: true },
      },
      {
        id: 'cart',
        label: 'Panier',
        type: 'badge',
        icon: 'icon-shopping',
        align: 'right',
        action: 'cart-click',
        count: cartItemCount.value,
      },
      {
        id: 'login',
        label: 'Connexion',
        type: 'button',
        icon: 'icon-user',
        align: 'right',
        action: 'login-click',
        props: { text: true },
      },
      {
        id: 'signup',
        label: 'Créer un compte',
        type: 'button',
        icon: 'icon-account',
        align: 'right',
        action: 'signup-click',
        props: { text: true },
      },
    ]);

    const logEvent = (eventName: string, eventData?: any) => {
      console.log(`Event "${eventName}" emitted`, eventData !== undefined ? eventData : '');
      alert(`Event: ${eventName} ${eventData !== undefined ? JSON.stringify(eventData) : ''}`);
    };

    const handleActionClick = (action: string, value?: any) => {
      if (action === 'search-update') {
        searchQuery.value = value;
        console.log('Search query updated:', searchQuery.value);
      } else {
        logEvent(action, value);
      }
    };

    return {
      topBarItems,
      cartItemCount,
      searchQuery,
      logEvent,
      handleActionClick,
    };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 40px; padding: 20px;">
      <div>
        <h2>Top Bar Example</h2>
        <u-nav-bar
          :items="topBarItems"
          type="top"
          @nav-select="logEvent('nav-select', $event)"
          @action-click="handleActionClick"
        />
      </div>
    </div>
  `,
});

export const SideBar = () => ({
  components: { UNavBar },
  setup() {
    const sideBarItems = computed<NavItem[]>(() => [
      { id: 'dashboard', label: 'Dashboard', type: 'link', icon: 'icon-dashboard', value: '/dashboard' },
      { id: 'products', label: 'Produits', type: 'link', icon: 'icon-product', value: '/products' },
      {
        id: 'orders',
        label: 'Commandes',
        type: 'submenu',
        icon: 'icon-shopping',
        children: [
          { id: 'orders-list', label: 'Liste des commandes', type: 'link', value: '/orders' },
          { id: 'orders-calendar', label: 'Calendrier', type: 'link', value: '/orders/calendar' },
        ],
      },
      { id: 'customers', label: 'Clients', type: 'link', icon: 'icon-user', value: '/customers' },
      { id: 'settings', label: 'Paramètres', type: 'link', icon: 'icon-settings', value: '/settings' },
      {
        id: 'logout',
        label: 'Déconnexion',
        type: 'button',
        icon: 'icon-logout',
        action: 'logout-click',
        props: { type: 'danger' },
      },
    ]);

    const logEvent = (eventName: string, eventData?: any) => {
      console.log(`Event "${eventName}" emitted`, eventData !== undefined ? eventData : '');
      alert(`Event: ${eventName} ${eventData !== undefined ? JSON.stringify(eventData) : ''}`);
    };

    const handleActionClick = (action: string, value?: any) => {
      logEvent(action, value);
    };

    return {
      sideBarItems,
      logEvent,
      handleActionClick,
    };
  },
  template: `
    <div style="display: flex; height: 500px; border: 1px solid #ccc;">
      <u-nav-bar
        :items="sideBarItems"
        type="side"
        @nav-select="logEvent('nav-select', $event)"
        @action-click="handleActionClick"
      />
      <div style="flex-grow: 1; padding: 20px;">
        <h2>Side Bar Example</h2>
        <p>Contenu principal ici...</p>
      </div>
    </div>
  `,
});

export const TopBarWithCustomLogo = () => ({
  components: { UNavBar },
  setup() {
    const cartItemCount = ref(5);
    const searchQuery = ref('');

    const topBarItems = computed<NavItem[]>(() => [
      { id: 'home', label: 'Accueil', type: 'link', value: '/' },
      { id: 'shop', label: 'Boutique', type: 'link', value: '/shop' },
      { id: 'news', label: 'Nouveautés', type: 'link', value: '/news' },
      { id: 'contact', label: 'Contact', type: 'link', value: '/contact' },
      {
        id: 'search',
        label: 'Rechercher',
        type: 'search',
        align: 'right',
        action: 'search',
        props: { placeholder: 'Rechercher...', modelValue: searchQuery.value, overflowSideShow: true },
      },
      {
        id: 'cart',
        label: 'Panier',
        type: 'badge',
        icon: 'icon-shopping',
        align: 'right',
        action: 'cart-click',
        count: cartItemCount.value,
      },
      {
        id: 'login',
        label: 'Connexion',
        type: 'button',
        icon: 'icon-user',
        align: 'right',
        action: 'login-click',
        props: { text: true },
      },
      {
        id: 'signup',
        label: 'Créer un compte',
        type: 'button',
        icon: 'icon-account',
        align: 'right',
        action: 'signup-click',
        props: { text: true },
      },
    ]);

    const logEvent = (eventName: string, eventData?: any) => {
      console.log(`Event "${eventName}" emitted`, eventData !== undefined ? eventData : '');
      alert(`Event: ${eventName} ${eventData !== undefined ? JSON.stringify(eventData) : ''}`);
    };

    const handleActionClick = (action: string, value?: any) => {
      if (action === 'search-update') {
        searchQuery.value = value;
        console.log('Search query updated:', searchQuery.value);
      } else {
        logEvent(action, value);
      }
    };

    return {
      topBarItems,
      cartItemCount,
      searchQuery,
      logEvent,
      handleActionClick,
    };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 40px; padding: 20px;">
      <div>
        <h2>Top Bar with Custom Logo Slot</h2>
        <u-nav-bar
          :items="topBarItems"
          type="top"
          @nav-select="logEvent('nav-select', $event)"
          @action-click="handleActionClick"
        >
          <template #logo>
            <div style="display: flex; align-items: center;">
              <img src="../../../src/assets/images/logo_stock_app.png" alt="Custom Logo" style="height: 40px; margin-right: 10px;" />
              <span style="font-weight: bold; color: #303133;">Mon E-Shop</span>
            </div>
          </template>
        </u-nav-bar>
      </div>
    </div>
  `,
});
