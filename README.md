# My Design System Vue

A comprehensive Vue 3 design system with a rich set of components and utilities.

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue)
![Storybook](https://img.shields.io/badge/Storybook-7.x-ff69b4)

## 📚 Component Library

### Basic Components
- `UButton` - Customizable button component
- `UMultiActionButton` - Button with multiple actions
- `UMultiActionPopper` - Popper for multi-action components

### Form Components
- Input Controls: `UNumberInput`, `UPasswordInput`, `UColorPicker`
- Selection: `URadio`, `USelectGroup`, `USwitch`
- Date & Time: `UDatePicker`, `UTimePicker`
- Others: `USlider`, `UUploader`

### Navigation
- `UTabTitle` - Tab navigation component
- `UWizardNav` - Wizard navigation interface

### Notice Components
- `UMessage` - Toast messages
- `UMessageBox` - Modal message boxes
- `UConfirm` - Confirmation dialogs
- `UPrompt` - User input prompts

### Other Components
- Layout: `UAccordion`, `UDialog`
- Feedback: `ULoader`, `UProgressBar`
- Information: `UTooltip`, `UTag`, `UInfo`

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run Storybook for development
npm run storybook

# Build library
npm run build
```

## 📁 Project Structure

```
src/
├── commons/          # Core components
├── composabes/      # Vue composables
├── assets/          # Styles and images
├── libs/            # Utility functions
├── locales/         # i18n translations
└── plugins/         # Vue plugins
```

## 🎨 Theming

Customizable themes using SCSS variables:
```scss
@import '@/assets/style/themes/colors.scss';
@import '@/assets/style/themes/font.scss';
```

## 🛠️ Development

```bash
# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

## 📖 Documentation

Component documentation and examples available in Storybook:
```bash
npm run storybook
```

## 🌐 i18n Support

Supported languages:
- English (en)
- French (fr)

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Submit a pull request
