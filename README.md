# frontend.template.vue

Un template complet pour des applications frontend Vue 3, riche en composants, utilitaires et bonnes pratiques. Ce projet est conçu pour démarrer rapidement le développement d'interfaces utilisateur modernes et robustes.

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-~5.5.0-blue)
![Vite](https://img.shields.io/badge/Vite-^6.1.0-purple)
![Storybook](https://img.shields.io/badge/Storybook-^8.5.3-ff69b4)
![Vitest](https://img.shields.io/badge/Vitest-^3.1.3-yellowgreen)
![ESLint](https://img.shields.io/badge/ESLint-^8.57.1-4B32C3)
![Prettier](https://img.shields.io/badge/Prettier-^3.5.0-F7B93E)

## ✨ Fonctionnalités Principales

- **Stack Moderne** : Vue 3, TypeScript, Vite.
- **Bibliothèque de Composants UI** : Un ensemble de composants réutilisables et personnalisables, documentés avec Storybook.
- **Gestion d'État** : Pinia pour une gestion d'état simple et typée.
- **Internationalisation** : Prise en charge de `vue-i18n`.
- **Qualité de Code** : ESLint, Prettier, et Husky pour les hooks pre-commit.
- **Tests** : Vitest pour les tests unitaires.
- **Build & Déploiement** : Scripts pour le build et configuration Docker.
- **Intégration Continue** : Workflows GitHub Actions pour CI et Renovate.

## 📋 Prérequis

Assurez-vous d'avoir les versions suivantes (ou supérieures) installées :

- [Node.js](https://nodejs.org/): `^20.0.0`
- [npm](https://www.npmjs.com/): `^10.0.0`

Ces versions sont spécifiées dans la section `engines` du fichier [`package.json`](package.json:86).

## 🚀 Démarrage Rapide

1.  **Cloner le repository (ou utiliser comme template) :**

    ```bash
    # Exemple avec git clone
    git clone https://github.com/adamsbarry18/frontend.template.vue.git
    cd nom-du-projet
    ```

2.  **Installer les dépendances :**

    ```bash
    npm install
    ```

3.  **Lancer le serveur de développement :**
    L'application sera disponible sur `http://localhost:5173` (ou un autre port si celui-ci est occupé).

    ```bash
    npm run dev
    ```

4.  **Explorer les composants avec Storybook :**
    Storybook démarrera sur `http://localhost:6006`.
    ```bash
    npm run storybook
    ```

## 🛠️ Scripts Disponibles

Voici une liste des principaux scripts disponibles dans [`package.json`](package.json:5) :

- `npm run dev`: Lance le serveur de développement Vite avec HMR.
- `npm run prod`: Lance le serveur de développement Vite en mode production.
- `npm run build`: Construit l'application pour la production (optimisée et minifiée).
- `npm run build:test`: Construit l'application pour un environnement de test.
- `npm run build:prod`: Construit l'application pour la production (similaire à `npm run build`).
- `npm run preview`: Lance un serveur local pour prévisualiser le build de production.
- `npm run test:unit`: Exécute les tests unitaires avec Vitest.
- `npm run test:watch`: Exécute les tests unitaires en mode "watch".
- `npm run storybook`: Démarre Storybook pour visualiser et développer les composants UI.
- `npm run build-storybook`: Construit une version statique de Storybook.
- `npm run lint`: Analyse le code avec ESLint pour détecter les erreurs et les problèmes de style.
- `npm run format`: Formate automatiquement le code avec Prettier.
- `npm run prepare`: Script exécuté par Husky lors de l'installation des dépendances pour configurer les hooks Git.

## 📁 Structure du Projet

Le projet est organisé comme suit (structure principale) :

```
📦frontend.template.vue
 ┣ 📂.github/            # Workflows GitHub Actions (CI, Renovate)
 ┃ ┗ ...
 ┣ 📂.husky/             # Hooks Git configurés avec Husky
 ┃ ┗ ...
 ┣ 📂.storybook/         # Configuration de Storybook
 ┃ ┗ ...
 ┣ 📂build/              # Scripts et Dockerfile pour le build et déploiement
 ┃ ┗ ...
 ┣ 📂public/             # Fichiers statiques servis directement
 ┃ ┗ ...
 ┣ 📂src/                # Code source de l'application
 ┃ ┣ 📂assets/           # Images, polices, styles globaux (...)
 ┃ ┣ 📂composables/      # Fonctions réutilisables Vue Composables (...)
 ┃ ┣ 📂libs/             # Utilitaires et bibliothèques spécifiques (...)
 ┃ ┣ 📂locales/          # Fichiers de traduction (i18n) (...)
 ┃ ┣ 📂modules/          # Modules fonctionnels de l'application
 ┃ ┃ ┣ 📂app/            # Configuration globale de l'application, composants partagés
 ┃ ┃ ┃ ┗ ...
 ┃ ┃ ┣ 📂auth/           # Authentification, tests d'autorisation
 ┃ ┃ ┃ ┗ ...
 ┃ ┃ ┣ 📂dashboard/      # Module du tableau de bord
 ┃ ┃ ┃ ┗ ...
 ┃ ┃ ┣ 📂login/          # Module de connexion
 ┃ ┃ ┃ ┗ ...
 ┃ ┃ ┣ 📂not-found/      # Page 404
 ┃ ┃ ┃ ┗ ...
 ┃ ┃ ┣ 📂shared/         # Composants et logique partagés (menu, notifications)
 ┃ ┃ ┃ ┗ ...
 ┃ ┃ ┣ 📂ui/             # Bibliothèque de composants UI de base (UButton, UInput, etc.)
 ┃ ┃ ┃ ┣ 📂basic/
 ┃ ┃ ┃ ┣ 📂data/
 ┃ ┃ ┃ ┣ 📂filter/
 ┃ ┃ ┃ ┣ 📂forms/
 ┃ ┃ ┃ ┣ 📂icons/
 ┃ ┃ ┃ ┣ 📂layout/
 ┃ ┃ ┃ ┣ 📂navigation/
 ┃ ┃ ┃ ┣ 📂notice/
 ┃ ┃ ┃ ┣ 📂others/
 ┃ ┃ ┃ ┗ ...
 ┃ ┃ ┗ 📂users/          # Module de gestion des utilisateurs
 ┃ ┃ ┃ ┣ 📂_components/  # Composants spécifiques au module users
 ┃ ┃ ┃ ┃ ┗ ...
 ┃ ┃ ┣ ┣ 📂_views/       # Vues spécifiques au module users (ex: Users.vue, UserSettings.vue)
 ┃ ┃ ┃ ┃ ┗ ...
 ┃ ┃ ┃ ┣ 📂settings/     # Composants pour les paramètres utilisateur
 ┃ ┃ ┃ ┃ ┗ ...
 ┃ ┃ ┃ ┗ ...
 ┃ ┃ ┗ ...
 ┃ ┣ 📂plugins/          # Plugins Vue (ex: i18n, axios) (...)
 ┃ ┣ 📂router/           # Configuration du routing avec Vue Router (...)
 ┃ ┣ 📂stores/           # Modules Pinia pour la gestion d'état (...)
 ┃ ┣ 📂types/            # Définitions de types TypeScript (...)
 ┃ ┣ 📜App.vue           # Composant racine de l'application
 ┃ ┣ 📜main.ts           # Point d'entrée principal de l'application
 ┃ ┗ 📜vite-env.d.ts     # Définitions de types pour Vite
 ┣ 📂_resources/         # Ressources pour Storybook (non incluses dans le build final)
 ┃ ┗ ...
 ┣ 📜.dockerignore
 ┣ 📜.editorconfig
 ┣ 📜.env.example        # Exemple de variables d'environnement
 ┣ 📜.eslintignore
 ┣ 📜.eslintrc.cjs
 ┣ 📜.gitignore
 ┣ 📜.npmrc
 ┣ 📜.prettierignore
 ┣ 📜.prettierrc.cjs
 ┣ 📜index.html
 ┣ 📜package.json
 ┣ 📜README.md           # Ce fichier
 ┣ 📜renovate.json
 ┣ 📜tsconfig.json
 ┗ 📜vite.config.ts
```

## 📚 Bibliothèque de Composants (Storybook)

Ce template inclut une riche bibliothèque de composants UI prêts à l'emploi, situés principalement dans [`src/modules/ui/`](src/modules/ui/).
Chaque composant est documenté et testable via Storybook.

### Exemples de Catégories de Composants :

- **Basiques** : [`UButton`](src/modules/ui/basic/UButton.vue), [`UMultiActionButton`](src/modules/ui/basic/UMultiActionButton.vue)
- **Formulaires** : [`UNumberInput`](src/modules/ui/forms/UNumberInput.vue), [`UPasswordInput`](src/modules/ui/forms/UPasswordInput.vue), [`UDatePicker`](src/modules/ui/forms/UDatePicker.vue), [`USelectGroup`](src/modules/ui/forms/USelectGroup.vue)
- **Données** : [`UList`](src/modules/ui/data/UList.vue), [`UBar`](src/modules/ui/data/UBar.vue) (pour graphiques), [`UKpiCard`](src/modules/ui/data/UKpiCard.vue)
- **Navigation** : [`UTabs`](src/modules/ui/navigation/UTabs.vue), [`UContextualMenu`](src/modules/ui/navigation/UContextualMenu.vue)
- **Notifications** : [`UMessage.ts`](src/modules/ui/notice/UMessage.ts), [`UMessageBox.ts`](src/modules/ui/notice/UMessageBox.ts)
- **Layout & Autres** : [`UCard`](src/modules/ui/layout/UCard.vue), [`UDialog`](src/modules/ui/others/UDialog.vue), [`ULoader`](src/modules/ui/others/ULoader.vue)

Pour une liste exhaustive et des démonstrations interactives :

```bash
npm run storybook
```

## 🎨 Theming

Le theming est géré via des variables SCSS. Vous pouvez personnaliser l'apparence en modifiant les fichiers situés dans [`src/assets/style/themes/`](src/assets/style/themes/):

- [`colors.scss`](src/assets/style/themes/colors.scss): Variables de couleurs primaires, secondaires, de feedback, etc.
- [`font.scss`](src/assets/style/themes/font.scss): Variables pour les polices, tailles, graisses.

Ces thèmes sont importés globalement dans [`src/assets/style/main.scss`](src/assets/style/main.scss).

## 🌐 Internationalisation (i18n)

Le projet utilise `vue-i18n` pour la gestion des traductions.
Les fichiers de langue se trouvent dans [`src/locales/`](src/locales/) (ex: [`en.json`](src/locales/en.json), [`fr.json`](src/locales/fr.json)).
La configuration est initialisée dans [`src/i18n.ts`](src/i18n.ts).

Langues supportées par défaut :

- Anglais (en)
- Français (fr)

## ⚙️ Configuration de l'Environnement

Les variables d'environnement sont gérées via des fichiers `.env` à la racine du projet, en utilisant le [mode de Vite pour les variables d'environnement](https://vitejs.dev/guide/env-and-mode.html).

- `.env`: Variables par défaut (non versionnées, pour les secrets locaux).
- `.env.development`: Variables pour l'environnement de développement.
- `.env.production`: Variables pour le build de production.
- `.env.test`: Variables pour l'environnement de test.

Un fichier `.env.example` devrait être versionné pour indiquer les variables nécessaires.

## 🐳 Build & Déploiement (Docker)

Un [`Dockerfile`](build/Dockerfile) est fourni dans le répertoire [`build/`](build/) pour faciliter la conteneurisation de l'application.
Des scripts d'aide (`build.sh`, `start.sh`, `deploy.sh`) sont également présents.

Pour construire l'image Docker (exemple) :

```bash
docker build -t nom-de-votre-image . -f build/Dockerfile
```

Pour lancer un conteneur (exemple) :

```bash
docker run -d -p 8080:80 nom-de-votre-image
```

Consultez le [`README.md`](README.md) spécifique au build ou les scripts pour des instructions plus détaillées.

## 🔧 Qualité du Code & Intégration Continue

### Linting & Formatting

- **ESLint** ([`.eslintrc.cjs`](.eslintrc.cjs)): Pour l'analyse statique du code et le respect des conventions.
- **Prettier** ([`.prettierrc.cjs`](.prettierrc.cjs)): Pour le formatage automatique du code.
  ```bash
  npm run lint
  npm run format
  ```

### Hooks Git

- **Husky** ([`.husky/`](.husky/)): Utilisé pour configurer des hooks Git. Par défaut, un hook `pre-commit` est configuré pour exécuter le linting et le formatage avant chaque commit.

### Intégration Continue (GitHub Actions)

Le répertoire [`.github/workflows/`](.github/workflows/) contient :

- [`ci.yml`](.github/workflows/ci.yml): Workflow pour l'intégration continue (build, tests, linting) à chaque push/pull request.
- [`renovate.yml`](.github/workflows/renovate.yml): Configuration pour Renovate Bot pour la mise à jour automatique des dépendances.

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` (s'il existe) ou ajouter une section de licence si nécessaire.
(Actuellement, le `README.md` original mentionne "MIT License" mais aucun fichier `LICENSE` n'est listé dans l'arborescence fournie. Il est recommandé d'en ajouter un si c'est le cas.)

## 🤝 Contributing

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1.  Fork le repository.
2.  Créez une nouvelle branche pour votre fonctionnalité (`git checkout -b feature/ma-nouvelle-feature`).
3.  Commitez vos changements (`git commit -am 'Ajout de ma nouvelle feature'`).
    - Assurez-vous que les hooks pre-commit passent (linting, formatting).
4.  Poussez vers la branche (`git push origin feature/ma-nouvelle-feature`).
5.  Ouvrez une Pull Request.
