<template>
  <div />
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { registerToShortcutQueue, removeFromShortcutQueue } from '@/plugins/shortcutManager';

  // Définition des props
  const props = defineProps<{
    shortcut?: string;
  }>();

  // Valeur par défaut pour la prop `shortcut`
  const shortcut = props.shortcut || 'esc';

  // Définition des événements
  const emit = defineEmits<{
    (event: 'shortcut-trigger'): void;
  }>();

  // État de l'abonnement au raccourci
  const isSub = ref(false);

  // Fonction déclenchée lors de l'activation du raccourci
  const onShortcutTrigger = () => {
    isSub.value = false;
    emit('shortcut-trigger');
  };

  // Enregistrement du raccourci au montage du composant
  onMounted(() => {
    isSub.value = true;
    registerToShortcutQueue(onShortcutTrigger, shortcut);
  });

  // Suppression du raccourci lors de la destruction du composant
  onBeforeUnmount(() => {
    if (isSub.value) {
      removeFromShortcutQueue(onShortcutTrigger, shortcut);
    }
  });
</script>
