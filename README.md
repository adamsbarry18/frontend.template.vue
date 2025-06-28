# Vue.js Frontend Template

A modern, modular, and scalable **Vite + Vue.js 3** frontend template for quickly initializing web applications with robust architecture and built-in best practices.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Vue.js](https://img.shields.io/badge/Vue.js-3.x-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-~5.5.0-blue)
![Vite](https://img.shields.io/badge/Vite-^6.1.0-purple)
![Storybook](https://img.shields.io/badge/Storybook-^8.5.3-ff69b4)
![Vitest](https://img.shields.io/badge/Vitest-^3.1.3-yellowgreen)
![ESLint](https://img.shields.io/badge/ESLint-^8.57.1-4B32C3)
![Prettier](https://img.shields.io/badge/Prettier-^3.5.0-F7B93E)

---

## 🚀 Introduction

### What is this template?

This **Vite + Vue.js 3** frontend template is designed to **accelerate development** of your web applications by providing a **modular and scalable architecture** ready to use with:

- ✅ **Modern Stack** : Vite + Vue.js 3 + TypeScript
- ✅ **Complete Authentication** : JWT + OAuth providers (Google)
- ✅ **Modular Architecture** : Feature-based module organization
- ✅ **Rich UI Component Library** : 100+ reusable components with Storybook
- ✅ **State Management** : Pinia with modular stores
- ✅ **Internationalization** : Multi-language support (EN/FR)
- ✅ **Type Safety** : Full TypeScript integration
- ✅ **Modern Build System** : Vite for fast development and HMR
- ✅ **Testing Suite** : Vitest for unit testing
- ✅ **Code Quality** : ESLint + Prettier + Husky
- ✅ **Component Documentation** : Storybook integration

### Why use this template?

- **Save time** : Ready architecture, no need to configure everything
- **Best practices** : Structured and maintainable code
- **Scalable** : Easy to add new modules and features
- **Production-ready** : Tests, CI/CD, Docker, monitoring
- **Documented** : Commented code and complete documentation
- **Rich UI** : Comprehensive component library with 100+ components
- **Modern Development** : Fast HMR with Vite, Vue 3 Composition API

---

## 🏗️ Architecture

### Modular Structure

```
src/
├── assets/                 # Static assets (images, fonts, styles)
├── composables/           # Vue 3 composables (reusable logic)
├── libs/                  # Utility libraries and services
├── locales/               # i18n translation files
├── modules/               # Feature modules (auth, users, dashboard, etc.)
│   ├── app/              # Global app configuration
│   ├── auth/             # Authentication module
│   ├── dashboard/        # Dashboard module
│   ├── login/            # Login module
│   ├── not-found/        # 404 page
│   ├── shared/           # Shared components (menu, notifications)
│   ├── ui/               # UI component library
│   │   ├── basic/        # Basic components (Button, Input, etc.)
│   │   ├── data/         # Data display components (List, Charts, etc.)
│   │   ├── filter/       # Filter components
│   │   ├── forms/        # Form components
│   │   ├── icons/        # Icon components
│   │   ├── layout/       # Layout components
│   │   ├── navigation/   # Navigation components
│   │   ├── notice/       # Notification components
│   │   └── others/       # Miscellaneous components
│   └── users/            # User management module
├── plugins/               # Vue plugins
├── router/                # Vue Router configuration
├── stores/                # Pinia stores
├── types/                 # TypeScript type definitions
├── views/                 # Global views
├── App.vue               # Root component
├── main.ts               # Application entry point
└── i18n.ts               # Internationalization setup
```

### Architecture Principles

- **Feature-Based Modules** : Clear separation of business logic
- **Component-Driven Development** : Reusable UI components
- **Type Safety** : Full TypeScript integration
- **State Management** : Centralized state with Pinia
- **Internationalization** : Multi-language support
- **Testing** : Unit and integration tests

---

## 🛠️ Features

### 🔐 Authentication & Authorization

- **JWT Authentication** : Secure token-based authentication
- **OAuth 2.0 Providers** : Integrated Google OAuth
- **Role Management** : Flexible permission system
- **Route Guards** : Protected routes with authorization
- **Session Management** : Automatic token refresh

### 🎨 Rich UI Component Library

- **100+ Components** : Comprehensive component library
- **Storybook Integration** : Interactive component documentation
- **Responsive Design** : Mobile-first approach
- **Theme System** : Customizable theming with SCSS
- **Accessibility** : WCAG compliant components

### 📊 Data Management

- **Pinia Stores** : Modular state management
- **API Integration** : Axios with interceptors
- **Data Visualization** : Charts and KPI components
- **List Management** : Advanced list components with filtering
- **Form Handling** : Comprehensive form components

### 🌍 Internationalization

- **Multi-language Support** : EN/FR with vue-i18n
- **Dynamic Language Switching** : Runtime language changes
- **Date/Number Formatting** : Locale-aware formatting
- **RTL Support** : Ready for right-to-left languages

### 🧪 Testing & Quality

- **Unit Tests** : Vitest for component testing
- **Component Testing** : Vue Test Utils integration
- **CI/CD** : Automated GitHub Actions pipeline
- **Linting & Formatting** : ESLint + Prettier
- **Git Hooks** : Husky for pre-commit checks

### 📚 Documentation

- **Storybook** : Interactive component documentation
- **JSDoc Comments** : Comprehensive code documentation
- **TypeScript Types** : Full type definitions
- **README Guides** : Complete setup and usage documentation

---

## 🚀 Quick Start

### Prerequisites

```bash
node >= 20.0.0
npm >= 10.0.0
```

### Installation

1. **Clone the template**

   ```bash
   git clone https://github.com/adamsbarry18/frontend.template.vue.git my-vue-project
   cd my-vue-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Access the application**

   ```bash
   http://localhost:8080
   ```

5. **Explore components with Storybook**
   ```bash
   npm run storybook
   ```
   ```
   http://localhost:6006
   ```

### Testing

```bash
# Run unit tests
npm run test:unit

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## 🔧 Configuration

### Environment Variables

| Variable                | Description            | Required | Default                 |
| ----------------------- | ---------------------- | -------- | ----------------------- |
| `VITE_API_BASE_URL`     | API base URL           | ❌       | `http://localhost:8000` |
| `VITE_APP_TITLE`        | Application title      | ❌       | `Vue.js App`            |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | ❌       | -                       |

See `.env.example` for all available options.

### Adding a new module

1. **Create module structure**

   ```bash
   mkdir -p src/modules/my-module/{_components,_views,__tests__}
   ```

2. **Create module components**

   ```vue
   <!-- src/modules/my-module/_components/MyComponent.vue -->
   <template>
     <div class="my-component">
       <h1>{{ $t('my-module.title') }}</h1>
     </div>
   </template>

   <script setup lang="ts">
     // Component logic here
   </script>
   ```

3. **Add module routes**

   ```typescript
   // src/router/my-module.routes.ts
   import { RouteRecordRaw } from 'vue-router';

   const routes: RouteRecordRaw[] = [
     {
       path: '/my-module',
       name: 'my-module',
       component: () => import('@/modules/my-module/_views/MyModule.vue'),
       meta: {
         authenticated: true,
         breadcrumb: [{ label: 'my-module' }],
       },
     },
   ];

   export default routes;
   ```

4. **Register module**
   ```typescript
   // src/modules/my-module/index.ts
   export * from './_components/MyComponent.vue';
   export * from './_views/MyModule.vue';
   ```

---

## 🎨 UI Component Library

### Component Categories

#### Basic Components

- **UButton** : Primary, secondary, tertiary buttons with icons
- **UMultiActionButton** : Button with multiple actions
- **USplitButton** : Button with dropdown actions
- **ULottiePlayer** : Lottie animation player

#### Form Components

- **UFormInput** : Text input with validation
- **UDatePicker** : Date selection component
- **USelectGroup** : Dropdown selection
- **UCheckboxGroup** : Checkbox group
- **URadio** : Radio button group
- **USwitch** : Toggle switch
- **USlider** : Range slider
- **UColorPicker** : Color selection
- **UTagInput** : Tag input with autocomplete
- **UUploader** : File upload component

#### Data Components

- **UList** : Advanced list with sorting, filtering, pagination
- **UKpiCard** : Key Performance Indicator cards
- **UBar** : Bar chart component
- **UDonutChart** : Donut chart component
- **UFunnel** : Funnel chart component
- **UFigure** : Data figure display
- **UDateDisplay** : Date formatting component

#### Navigation Components

- **UTabs** : Tab navigation
- **UContextualMenu** : Context menu
- **UVerticalStepper** : Step-by-step navigation
- **UExplorer** : File/folder explorer
- **UWizardNav** : Wizard navigation

#### Layout Components

- **UCard** : Content card container
- **UGrid** : CSS Grid layout
- **UNavBar** : Navigation bar
- **UContentWrapper** : Page content wrapper
- **USectionsWithMenu** : Layout with sidebar menu

#### Notice Components

- **UMessage** : Toast notifications
- **UMessageBox** : Modal message boxes
- **UConfirm** : Confirmation dialogs
- **UConfirmDelete** : Delete confirmation

#### Other Components

- **UDialog** : Modal dialog
- **ULoader** : Loading spinner
- **UTooltip** : Tooltip component
- **UBadge** : Status badges
- **UTag** : Tag component
- **UProgressBar** : Progress indicator
- **USearchBar** : Search input
- **UCodeEditor** : Code editor with syntax highlighting

### Using Components

```vue
<template>
  <u-card>
    <u-button type="primary" @click="handleClick">
      {{ $t('common.save') }}
    </u-button>

    <u-list :data="items" :loading="loading" entity-label-key="items.list.header">
      <u-list-column column-key="name" :label="$t('items.name')" sortable sort-prop="name" />
    </u-list>
  </u-card>
</template>

<script setup lang="ts">
  import { UCard, UButton, UList, UListColumn } from '@/modules/ui';
</script>
```

---

## 🐳 Docker

### Quick Start with Docker

The easiest way to test the application is using Docker. The project includes a multi-stage Dockerfile that builds the application for production.

#### Prerequisites

```bash
docker >= 20.0.0
```

#### Build and Run

1. **Build the Docker image**

   ```bash
   # Build for development
   docker build -t vue-frontend-template .

   # Build for production
   docker build --build-arg BUILD_ENV=production -t vue-frontend-template:prod .
   ```

2. **Run the container**

   ```bash
   # Run development version
   docker run -p 8080:80 --name vue-app vue-frontend-template

   # Run production version
   docker run -p 8080:80 --name vue-app-prod vue-frontend-template:prod
   ```

3. **Access the application**

   ```
   Application: http://localhost:8080
   Storybook:   http://localhost:8080/storybook
   ```

4. **For Storybook (separate process)**

   ```bash
   # Install dependencies locally
   npm install

   # Start Storybook
   npm run storybook
   ```

   ```
   Storybook: http://localhost:6006
   ```

### Docker Build Arguments

The Dockerfile accepts several build arguments:

| Argument       | Description                                       | Default                 | Example      |
| -------------- | ------------------------------------------------- | ----------------------- | ------------ |
| `BUILD_ENV`    | Build environment (development, production, test) | `development`           | `production` |
| `BUILD_ID`     | Build identifier (usually Git SHA)                | `local`                 | `abc1234`    |
| `APP_NAME`     | Application name                                  | `vue-frontend-template` | `my-app`     |
| `GITHUB_TOKEN` | GitHub token for private packages                 | -                       | `ghp_xxx`    |

### Docker Features

- **Multi-stage build** : Optimized image size
- **Nginx server** : Production-ready web server
- **Environment-specific builds** : Different builds for dev/prod
- **Security optimized** : Alpine Linux base image
- **Caching optimized** : Layer caching for faster builds

### Development with Docker

For development with hot-reload:

```bash
# Build development image
docker build --target builder -t vue-frontend-template:dev .

# Run with volume mount for hot-reload
docker run -p 8080:80 -v $(pwd)/src:/app/src vue-frontend-template:dev
```

### Production Deployment

For production deployment:

```bash
# Build production image
docker build --build-arg BUILD_ENV=production \
             --build-arg BUILD_ID=$(git rev-parse HEAD) \
             --build-arg APP_NAME=my-vue-app \
             -t my-vue-app:latest .

# Run production container
docker run -p 80:80 --name my-vue-app my-vue-app:latest
```

### Docker Commands Reference

```bash
# Build images
docker build -t vue-app .                                    # Development
docker build --build-arg BUILD_ENV=production -t vue-app .  # Production

# Run containers
docker run -p 8080:80 vue-app                               # Run in foreground
docker run -it -p 8080:80 vue-app                           # Run interactively
docker run -d -p 8080:80 vue-app                            # Run in background

# Manage containers
docker ps                                                   # List running containers
docker logs vue-app                                         # View logs
docker stop vue-app                                         # Stop container
docker rm vue-app                                           # Remove container

# Clean up
docker system prune -a                                      # Remove unused images
docker volume prune                                         # Remove unused volumes
```

---

## 🐳 Deployment

### Docker

```bash
# Build image
docker build -t my-vue-app .

# Run with environment variables
docker run --rm --env-file .env -p 8080:80 my-vue-app
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🧪 Testing

### Test Structure

```
src/modules/
├── auth/
│   └── __tests__/
│       └── authorization.spec.ts
└── users/
    └── __tests__/
        └── user.spec.ts
```

### Run Tests

```bash
# Unit tests
npm run test:unit

# Tests in watch mode
npm run test:watch

# Tests with coverage
npm run test:coverage
```

---

## 🔐 Security

- **JWT Authentication** : Secure token-based auth
- **OAuth 2.0** : Google integration
- **Route Guards** : Protected routes
- **Input Validation** : Form validation
- **XSS Protection** : Content Security Policy
- **CSRF Protection** : Cross-Site Request Forgery protection

---

## 🌍 Internationalization

- **Multi-language Support** : EN/FR with vue-i18n
- **Dynamic Language Switching** : Runtime changes
- **Date/Number Formatting** : Locale-aware
- **RTL Support** : Right-to-left languages
- **Translation Management** : Organized translation files

---

## 📚 API Integration

### RESTful API Endpoints

#### Authentication

- `POST /api/v1/auth/login` - JWT login
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/google` - Google OAuth

#### Users

- `GET /api/v1/users` - List users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/:id` - Get user details
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### API Configuration

```typescript
// src/stores/modules/api.ts
import { useApiStore } from '@/stores/modules/api';

const apiStore = useApiStore();

// Configure base URL
apiStore.setBaseURL(import.meta.env.VITE_API_BASE_URL);

// Add request/response interceptors
apiStore.addRequestInterceptor(/* your interceptor */);
apiStore.addResponseInterceptor(/* your interceptor */);
```

---

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow Vue.js 3 Composition API best practices
- Use TypeScript for type safety
- Write unit tests for components
- Follow ESLint and Prettier rules
- Update Storybook documentation for new components
- Add JSDoc comments for functions and components

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## 🆘 Support

- **Issues** : [GitHub Issues](https://github.com/adamsbarry18/frontend.template.vue/issues)
- **Documentation** : [Storybook](http://localhost:6006) (when running locally)

---

**⭐ Don't forget to star if this template helped you!**
