import { defineStore } from 'pinia';

interface BreadcrumbLink {
  label: string;
  path: string;
}

interface BreadcrumbState {
  breadcrumbLinks: BreadcrumbLink[];
  breadcrumbValue: any | null;
}

export const useBreadcrumbStore = defineStore('breadcrumb', {
  state: (): BreadcrumbState => ({
    breadcrumbLinks: [],
    breadcrumbValue: null,
  }),
  actions: {
    /**
     * Définit les liens et la valeur du breadcrumb.
     * @param links - Tableau des liens du breadcrumb.
     * @param value - Valeur optionnelle associée au breadcrumb (ex: nom de l'élément courant).
     */
    setBreadcrumb(links: BreadcrumbLink[] = [], value: any | null = null) {
      this.breadcrumbLinks = links;
      this.breadcrumbValue = value;
    },
    /**
     * Définit uniquement la valeur associée au breadcrumb.
     * @param value - Valeur optionnelle associée au breadcrumb.
     */
    setBreadcrumbValue(value: any | null) {
      this.breadcrumbValue = value;
    },
    /**
     * Réinitialise le breadcrumb à son état initial.
     */
    resetBreadcrumb() {
      this.breadcrumbLinks = [];
      this.breadcrumbValue = null;
    },
  },
});
