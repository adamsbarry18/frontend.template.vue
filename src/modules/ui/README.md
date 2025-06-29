# UI Design System

A comprehensive Vue.js 3 design system built on **Element Plus** with **SCSS** styling and **Composition API**. This modular component library provides 100+ reusable components for building modern web applications.

## 🎨 Component Categories

### Basic Components

- **UButton** - Primary, secondary, tertiary buttons with icons and states
- **UMultiActionButton** - Button with multiple action options
- **USplitButton** - Button with dropdown actions
- **ULottiePlayer** - Lottie animation player

### Form Components

- **UFormInput** - Universal form input with validation
- **UDatePicker** - Date selection component
- **USelectGroup** - Dropdown selection with grouping
- **UCheckboxGroup** - Checkbox group management
- **URadio** - Radio button group
- **USwitch** - Toggle switch component
- **USlider** - Range slider
- **UColorPicker** - Color selection
- **UTagInput** - Tag input with autocomplete
- **UUploader** - File upload component

### Data Components

- **UList** - Advanced list with sorting, filtering, pagination
- **UKpiCard** - Key Performance Indicator cards
- **UBar** - Bar chart component
- **UDonutChart** - Donut chart component
- **UFunnel** - Funnel chart component
- **UFigure** - Data figure display
- **UDateDisplay** - Date formatting component

### Navigation Components

- **UTabs** - Tab navigation
- **UContextualMenu** - Context menu
- **UVerticalStepper** - Step-by-step navigation
- **UExplorer** - File/folder explorer
- **UWizardNav** - Wizard navigation

### Layout Components

- **UCard** - Content card container
- **UGrid** - CSS Grid layout
- **UNavBar** - Navigation bar
- **UContentWrapper** - Page content wrapper
- **USectionsWithMenu** - Layout with sidebar menu

### Notice Components

- **UMessage** - Toast notifications
- **UMessageBox** - Modal message boxes
- **UConfirm** - Confirmation dialogs
- **UConfirmDelete** - Delete confirmation

## 🚀 Usage Examples

### 1. Basic Form with Validation

```vue
<template>
  <u-card>
    <u-form-input
      v-model="user.name"
      label="Full Name"
      placeholder="Enter your full name"
      :validator="validateName"
      type="string"
    />

    <u-form-input
      v-model="user.email"
      label="Email"
      placeholder="Enter your email"
      type="email"
      :error="emailError"
    />

    <u-button type="primary" @click="saveUser"> Save User </u-button>
  </u-card>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { UCard, UFormInput, UButton } from '@/modules/ui';

  const user = ref({ name: '', email: '' });
  const emailError = ref('');

  const validateName = (value: string) => {
    return value.length < 2 ? 'Name must be at least 2 characters' : null;
  };

  const saveUser = () => {
    // Save logic here
  };
</script>
```

### 2. Data List with Filtering and Pagination

```vue
<template>
  <u-list
    :data="users"
    :loading="loading"
    entity-label-key="users.list.header"
    :filter-config="filterConfig"
    @filter-change="onFilterChange"
  >
    <u-list-column column-key="name" :label="$t('users.name')" sortable sort-prop="name" />

    <u-list-column column-key="email" :label="$t('users.email')" sortable sort-prop="email" />

    <u-list-column column-key="status" :label="$t('users.status')" width="120">
      <template #default="{ row }">
        <u-badge :type="row.status === 'active' ? 'success' : 'warning'">
          {{ row.status }}
        </u-badge>
      </template>
    </u-list-column>
  </u-list>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { UList, UListColumn, UBadge } from '@/modules/ui';

  const users = ref([]);
  const loading = ref(false);

  const filterConfig = {
    name: { type: 'string', label: 'Name' },
    status: { type: 'enum', options: ['active', 'inactive'] },
  };

  const onFilterChange = (filters) => {
    // Apply filters logic
  };
</script>
```

### 3. Dashboard with KPI Cards and Charts

```vue
<template>
  <div class="dashboard">
    <div class="kpi-row">
      <u-kpi-card
        :value="totalUsers"
        :label="$t('dashboard.total-users')"
        icon="icon-users"
        trend="+12%"
        trend-positive
      />

      <u-kpi-card
        :value="activeUsers"
        :label="$t('dashboard.active-users')"
        icon="icon-user-check"
        trend="+5%"
        trend-positive
      />
    </div>

    <div class="chart-row">
      <u-card>
        <u-bar :data="userGrowthData" :options="chartOptions" title="User Growth" />
      </u-card>

      <u-card>
        <u-donut-chart :data="userStatusData" :options="donutOptions" title="User Status Distribution" />
      </u-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { UKpiCard, UCard, UBar, UDonutChart } from '@/modules/ui';

  const totalUsers = ref(1250);
  const activeUsers = ref(890);

  const userGrowthData = ref([
    { month: 'Jan', users: 100 },
    { month: 'Feb', users: 150 },
    { month: 'Mar', users: 200 },
  ]);

  const userStatusData = ref([
    { label: 'Active', value: 70, color: '#4CAF50' },
    { label: 'Inactive', value: 30, color: '#FF9800' },
  ]);

  const chartOptions = {
    // Chart configuration
  };

  const donutOptions = {
    // Donut chart configuration
  };
</script>
```

## 📦 Installation

```bash
# Import all components
import { UButton, UFormInput, UList } from '@/modules/ui';

# Or import specific categories
import { UButton } from '@/modules/ui/basic';
import { UFormInput } from '@/modules/ui/forms';
import { UList } from '@/modules/ui/data';
```

## 🎯 Key Features

- **Element Plus Based** - Built on top of Element Plus components
- **Vue 3 Composition API** - Modern Vue.js development patterns
- **SCSS Styling** - Customizable theming with CSS variables
- **TypeScript Support** - Full type safety and IntelliSense
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG compliant components
- **Internationalization** - i18n ready with vue-i18n

## 🔧 Customization

The design system uses CSS custom properties for theming:

```scss
:root {
  --color-primary: #409eff;
  --color-success: #67c23a;
  --color-warning: #e6a23c;
  --color-danger: #f56c6c;
  --color-neutral-100: #ffffff;
  --color-neutral-700: #606266;
  --color-neutral-900: #303133;
}
```

## 📚 Documentation

For detailed component documentation and examples, run Storybook:

```bash
npm run storybook
```

Visit `http://localhost:6006` to explore all components interactively.
