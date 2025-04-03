import { UCodeEditor } from '@/modules/common';
import { ref } from 'vue';

// Configuration Storybook
export default {
  title: 'others/CodeEditor',
  component: UCodeEditor,
};

// Tous les exemples dans un seul bloc
export const CodeEditor = () => ({
  components: { UCodeEditor },
  template: `
  <div>
    <h2>Exemple HTML</h2>
    <div style="height: 200px; width: 100%; border: 1px solid #ccc; margin-bottom: 20px;">
      <u-code-editor
        v-model="htmlCode"
        placeholder="Tapez votre code HTML ici..."
        :disabled="false"
        :dark-mode="false"
        lang="html"
        @change="(value) => handleChange('HTML', value)"
      />
    </div>

    <h2>Exemple CSS</h2>
    <div style="height: 200px; width: 100%; border: 1px solid #ccc; margin-bottom: 20px;">
      <u-code-editor
        v-model="cssCode"
        placeholder="Tapez votre code CSS ici..."
        :disabled="false"
        :dark-mode="false"
        lang="css"
        @change="(value) => handleChange('CSS', value)"
      />
    </div>

    <h2>Exemple JSON</h2>
    <div style="height: 200px; width: 100%; border: 1px solid #ccc; margin-bottom: 20px;">
      <u-code-editor
        v-model="jsonCode"
        placeholder="Tapez votre code JSON ici..."
        :disabled="false"
        :dark-mode="false"
        lang="json"
        @change="(value) => handleChange('JSON', value)"
      />
    </div>

    <h2>Exemple en lecture seule</h2>
    <div style="height: 200px; width: 100%; border: 1px solid #ccc; margin-bottom: 20px;">
      <u-code-editor
        v-model="readOnlyCode"
        placeholder="Ce champ est en lecture seule"
        :disabled="true"
        :dark-mode="false"
        lang="html"
        @change="(value) => handleChange('ReadOnly', value)"
      />
    </div>

    <h2>Exemple en mode sombre</h2>
    <div style="height: 200px; width: 100%; border: 1px solid #ccc; background-color: #1e1e1e; margin-bottom: 20px;">
      <u-code-editor
        v-model="darkModeCode"
        placeholder="Éditeur en mode sombre"
        :disabled="false"
        :dark-mode="true"
        lang="html"
        @change="(value) => handleChange('DarkMode', value)"
      />
    </div>

    <h2>Exemple avec placeholder</h2>
    <div style="height: 200px; width: 100%; border: 1px solid #ccc; margin-bottom: 20px;">
      <u-code-editor
        v-model="emptyCode"
        placeholder="Écrivez votre code JSON ici pour configurer l'application..."
        :disabled="false"
        :dark-mode="false"
        lang="json"
        @change="(value) => handleChange('Placeholder', value)"
      />
    </div>
  </div>
`,
  setup() {
    // Exemples de code pour différents langages
    const htmlCode = ref(
      '<div class="container">\n  <h1>Hello World</h1>\n  <p>Bienvenue sur mon site</p>\n</div>'
    );
    const cssCode = ref(
      '.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 20px;\n}\n\nh1 {\n  color: #333;\n  font-family: sans-serif;\n}'
    );
    const jsonCode = ref(
      '{\n  "name": "Monaco Editor",\n  "version": "1.0.0",\n  "features": [\n    "syntax highlighting",\n    "code completion",\n    "error checking"\n  ],\n  "isActive": true\n}'
    );
    const readOnlyCode = ref(
      '// Ce code est en lecture seule\nfunction helloWorld() {\n  console.log("Hello, world!");\n  return true;\n}'
    );
    const darkModeCode = ref(
      "// Éditeur en mode sombre\nconst darkMode = true;\n\n// Utilisation d'un thème sombre\ntheme.setDarkMode(darkMode);"
    );
    const emptyCode = ref('');

    // Fonction commune pour les événements de changement
    const handleChange = (editor, value) => {
      console.log(`Code modifié dans l'éditeur ${editor}:`, value);
    };

    return {
      htmlCode,
      cssCode,
      jsonCode,
      readOnlyCode,
      darkModeCode,
      emptyCode,
      handleChange,
    };
  },
});
