<template>
  <div
    ref="editorContainerRef"
    class="u-code-editor"
    :class="{ '-dark': darkMode }"
  />
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
  import { Compartment, EditorState, Extension } from '@codemirror/state';
  import {
    EditorView,
    keymap,
    lineNumbers,
    drawSelection,
    highlightActiveLine,
    highlightActiveLineGutter,
    highlightSpecialChars,
    placeholder as placeholderExtension,
  } from '@codemirror/view';
  import {
    defaultHighlightStyle,
    syntaxHighlighting,
    indentOnInput,
    bracketMatching,
    foldGutter,
  } from '@codemirror/language';
  import {
    defaultKeymap,
    history,
    historyKeymap,
    indentWithTab,
  } from '@codemirror/commands';
  import {
    autocompletion,
    completionKeymap,
    closeBrackets,
    closeBracketsKeymap,
  } from '@codemirror/autocomplete';
  import {
    searchKeymap,
    highlightSelectionMatches,
    search,
  } from '@codemirror/search';
  import { html } from '@codemirror/lang-html';
  import { oneDark } from '@codemirror/theme-one-dark';
  import { linter, lintGutter } from '@codemirror/lint';
  import { css } from '@codemirror/lang-css';
  import { json, jsonParseLinter } from '@codemirror/lang-json';
  import i18n from '@/i18n';

  interface Props {
    modelValue: string;
    placeholder?: string;
    disabled?: boolean;
    darkMode?: boolean;
    lang?: 'html' | 'css' | 'json';
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: '',
    disabled: false,
    darkMode: false,
    lang: 'html',
  });

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'change', value: string): void;
  }>();

  // Refs
  const editorContainerRef = ref<HTMLElement | null>(null);
  const view = ref<EditorView | null>(null);
  const inputValue = ref(props.modelValue);

  // Compartments for dynamic reconfiguration
  const placeholderCompartment = new Compartment();
  const disabledCompartment = new Compartment();
  const darkModeCompartment = new Compartment();

  // Computed properties for extensions
  const translations = computed(() => ({
    next: i18n.global.t('commons.form.next'),
    previous: i18n.global.t('commons.form.previous'),
    all: i18n.global.t('commons.code-editor.search.select-all'),
    Find: i18n.global.t('commons.code-editor.search.find'),
    Replace: i18n.global.t('commons.code-editor.search.replace'),
    replace: i18n.global.t('commons.code-editor.search.replace'),
    'replace all': i18n.global.t('commons.code-editor.search.replace-all'),
    'match case': i18n.global.t('commons.code-editor.search.match-case'),
    regexp: i18n.global.t('commons.code-editor.search.regexp'),
    'by word': i18n.global.t('commons.code-editor.search.by-word'),
  }));

  const jsonLinter = computed(() => linter(jsonParseLinter()));

  const langExtension = computed(() => {
    if (props.lang === 'html') {
      return html();
    }
    if (props.lang === 'css') {
      return css();
    }
    if (props.lang === 'json') {
      return [lintGutter(), json(), jsonLinter.value];
    }
    throw new Error(`Cannot load ${props.lang} extension`);
  });

  const placeholderExt = computed(() =>
    placeholderExtension(props.placeholder)
  );

  const disabledExt = computed(() => EditorState.readOnly.of(props.disabled));

  const darkModeExt = computed<Extension>(() => {
    return props.darkMode ? oneDark : [];
  });

  // Methods
  const initCodeMirror = () => {
    if (!editorContainerRef.value) return;

    const state = EditorState.create({
      doc: inputValue.value,
      extensions: [
        // View features
        lineNumbers(),
        drawSelection(), // Improve selection by overriding browser behavior
        highlightActiveLine(),
        highlightActiveLineGutter(), // Highlight active line in line numbers column
        highlightSpecialChars(), // Highlight strange utf8 characters with ?
        // Language features
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        indentOnInput(),
        bracketMatching(), // Highlight pair of brackets
        foldGutter(), // Allow to fold portions of code
        // Autocomplete features
        autocompletion(),
        closeBrackets(), // Auto close brackets
        // Commands feature
        history(), // Add undo, redo
        // Specific language features
        langExtension.value,
        search({ top: true }),
        highlightSelectionMatches(),
        EditorState.phrases.of(translations.value),
        // Shortcuts
        keymap.of([
          ...defaultKeymap,
          ...closeBracketsKeymap, // Close matching bracket on backspace key
          ...historyKeymap, // ctrl-z, ctrl-y shortcuts
          ...completionKeymap, // ctrl-space shortcut
          ...searchKeymap,
          indentWithTab, // Allow to indent with tab key (not active by default because of accessibility)
        ]),
        // Compartments
        placeholderCompartment.of(placeholderExt.value),
        disabledCompartment.of(disabledExt.value),
        darkModeCompartment.of(darkModeExt.value),
        // Listener
        EditorView.updateListener.of((viewUpdate) => {
          // https://discuss.codemirror.net/t/codemirror-6-proper-way-to-listen-for-changes/2395/11
          if (viewUpdate.docChanged) {
            const newValue = viewUpdate.state.doc.toString();
            inputValue.value = newValue;
            emit('update:modelValue', newValue);
            emit('change', newValue);
          }
        }),
      ],
    });

    view.value = new EditorView({
      state,
      parent: editorContainerRef.value,
    });
  };

  // Method to insert text at the current selection
  const insertTextAtSelection = (text: string) => {
    if (view.value) {
      view.value.dispatch(view.value.state.replaceSelection(text));
    }
  };

  // Watch for prop changes
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue !== inputValue.value && view.value) {
        const transaction = view.value.state.update({
          changes: {
            from: 0,
            to: view.value.state.doc.length,
            insert: newValue,
          },
        });
        view.value.dispatch(transaction);
      }
    }
  );

  watch(
    () => props.placeholder,
    () => {
      if (view.value) {
        view.value.dispatch({
          effects: placeholderCompartment.reconfigure(placeholderExt.value),
        });
      }
    }
  );

  watch(
    () => props.disabled,
    () => {
      if (view.value) {
        view.value.dispatch({
          effects: disabledCompartment.reconfigure(disabledExt.value),
        });
      }
    }
  );

  watch(
    () => props.darkMode,
    () => {
      if (view.value) {
        view.value.dispatch({
          effects: darkModeCompartment.reconfigure(darkModeExt.value),
        });
      }
    }
  );

  watch(
    () => props.lang,
    () => {
      // Language change requires re-initialization of the editor
      if (view.value) {
        view.value.destroy();
        initCodeMirror();
      }
    }
  );

  // Lifecycle hooks
  onMounted(() => {
    initCodeMirror();
  });

  onBeforeUnmount(() => {
    if (view.value) {
      view.value.destroy();
    }
  });

  // Expose methods for parent components
  defineExpose({
    insertTextAtSelection,
  });
</script>

<style lang="scss">
  .u-code-editor {
    height: 100%;

    .cm-panel.cm-search {
      background: var(--color-neutral-100);
      button {
        font-family: 'Roboto', sans-serif;
        border-radius: 4px;
        border: 1px solid var(--color-neutral-100);
        background-color: var(--color-white);
        background-image: none;
        padding: 4px 20px;
        font-size: var(--paragraph-02);
        font-weight: 500;
        line-height: 150%;
        color: var(--color-neutral-700);
      }
      label {
        color: var(--color-neutral-700);
      }
      input {
        background: var(--color-neutral-100);
        color: var(--color-neutral-700);
      }
    }

    .cm-editor {
      text-align: left;
      height: 100%;

      * {
        font-family: monospace;
      }
    }

    &.-dark {
      .cm-editor {
        // Override default black text on dark theme with white text
        [class^='cm-'],
        .cm-gutterElement > span {
          color: #abb2bf;
        }
      }
    }

    .cm-scroller {
      overflow: auto;
    }
  }
</style>
