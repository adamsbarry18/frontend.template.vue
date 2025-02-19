import i18n from '../src/i18n';
import dayjs from 'dayjs';

export function useString() {
  /**
   * Valide une adresse email.
   */
  function isEmailValid(value: string): boolean {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  }

  /**
   * Valide une URL.
   */
  function isUrlValid(value: string): boolean {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Génère un identifiant unique.
   * @param nbParam Nombre de caractères (par défaut 10)
   */
  function generateUID(nbParam: number = 10): string {
    let mask = '';
    for (let i = 0; i < nbParam; i++) {
      mask += 'x';
    }
    return mask.replace(/x/g, () =>
      Math.floor(Math.random() * 16)
        .toString(16)
        .toLowerCase()
    );
  }

  /**
   * Ajoute des ellipses à un texte multi-ligne en tronquant chaque mot trop long.
   * @param value Texte à traiter.
   * @param maxLength Longueur maximale d’un mot (défaut : 7)
   */
  function multilineEllipsis(value: string, maxLength: number = 7): string {
    return value
      .split(' ')
      .map((v) => (v.length > maxLength ? `${v.substring(0, maxLength)}…` : v))
      .join('\n');
  }

  /**
   * Ajoute des ellipses à un texte sur une seule ligne.
   * @param value Texte à traiter.
   * @param maxLength Longueur maximale du texte (défaut : 30)
   */
  function ellipsis(value: string, maxLength: number = 30): string {
    return value.length > maxLength
      ? `${value.substring(0, maxLength - 3)}…`
      : value;
  }

  /**
   * Formate une plage de nombres.
   * @param value Tableau contenant deux nombres (ou null)
   * @param config Optionnellement, une unité à ajouter.
   */
  function formatNumberRange(
    value: [number | null, number | null],
    config: { unit?: string } = {}
  ): string {
    if (
      !value ||
      value.length !== 2 ||
      (!Number.isFinite(value[0] as number) &&
        !Number.isFinite(value[1] as number))
    ) {
      return '-';
    }
    if (!Number.isFinite(value[0] as number)) {
      return `≤ ${value[1]}${config.unit ? ` ${config.unit}` : ''}`;
    }
    if (!Number.isFinite(value[1] as number)) {
      return `≥ ${value[0]}${config.unit ? ` ${config.unit}` : ''}`;
    }
    return `${value[0]} - ${value[1]}${config.unit ? ` ${config.unit}` : ''}`;
  }

  /**
   * Formate une plage de dates.
   * Utilise les fonctions de traduction et de formatage de vue-i18n.
   * @param value Tableau contenant deux dates (ou null)
   */
  function formatDateRange(value: [Date | null, Date | null]): string {
    if (
      !value ||
      value.length !== 2 ||
      (value[0] === null && value[1] === null)
    ) {
      return '-';
    }
    if (value[1] === null) {
      return `${i18n.global.t('commons.after')} ${i18n.global.d(new Date(value[0] as Date), 'short')}`;
    }
    if (value[0] === null) {
      return `${i18n.global.t('commons.before')} ${i18n.global.d(new Date(value[1] as Date), 'short')}`;
    }
    return `${i18n.global.d(new Date(value[0]), 'short')} - ${i18n.global.d(new Date(value[1]), 'short')}`;
  }

  /**
   * Formate une valeur d'énumération.
   * @param value Tableau de valeurs d’énumération.
   * @param config Objet de configuration contenant la liste des options (valeur/label).
   */
  function formatEnum(
    value: string[],
    config: { options: { value: string; label: string }[] }
  ): string {
    const labels =
      value.length > 0
        ? value.map(
            (x) =>
              config.options.find((y) => y.value === x)?.label ||
              i18n.global.t('commons.filter-invalid-value')
          )
        : ['-'];
    return labels.join(', ');
  }

  /**
   * Formate une valeur quelconque en chaîne de caractères en fonction d’un type.
   * Les types pris en charge sont : daterange, numberrange et enum.
   */
  function formatToString(
    value: unknown,
    config: { type: string; [key: string]: unknown }
  ): string {
    const typeFormater: Record<string, (v: any, c: any) => string> = {
      daterange: formatDateRange,
      numberrange: formatNumberRange,
      enum: formatEnum,
    };
    return Object.prototype.hasOwnProperty.call(typeFormater, config.type)
      ? typeFormater[config.type](value, config)
      : `${value}`;
  }

  /**
   * Met en majuscule la première lettre d'une chaîne.
   */
  function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * Formate une date pour l'axe d'un graphique.
   * Utilise vue-i18n pour formater la date et dayjs pour vérifier le mois.
   */
  function dateGraphAxisFormatter(value: string): string {
    const date = new Date(value);
    const label = capitalize(i18n.global.d(date, 'monthYear'));
    if (dayjs(date).get('month') !== 0) {
      return label.split(' ')[0];
    }
    return label.replace(' ', '\n');
  }

  /**
   * Compte le nombre de mots dans une chaîne.
   */
  function countWords(value: string): number {
    return value?.trim().split(/\s+/).length ?? 0;
  }

  /**
   * Compte le nombre de lignes dans une chaîne.
   */
  function countLines(value: string): number {
    return (value.match(/\n+/g)?.length ?? 0) + 1;
  }

  return {
    isEmailValid,
    isUrlValid,
    generateUID,
    multilineEllipsis,
    ellipsis,
    formatNumberRange,
    formatDateRange,
    formatEnum,
    formatToString,
    capitalize,
    dateGraphAxisFormatter,
    countWords,
    countLines,
  };
}
