<template>
  <!-- Ce composant n'affiche rien -->
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue';

  interface ShortcutEvent {
    /** Type d'événement à écouter : 'keyup', 'keydown', 'click', etc. */
    event: string;
    /** Pour les événements clavier, la touche à surveiller (par exemple, 'Escape', 'Enter') */
    key?: string;
  }

  // Prop "events" : un tableau d'objets ShortcutEvent.
  // Si aucun événement n'est passé, on écoute par défaut "keyup" sur la touche "Escape".
  const props = defineProps<{ events?: ShortcutEvent[] }>();
  const eventsToListen =
    props.events && props.events.length > 0
      ? props.events
      : [{ event: 'keyup', key: 'Escape' }];

  const emit = defineEmits<{ (e: 'shortcut-trigger', event: Event): void }>();

  function handleEvent(ev: Event) {
    // Pour chaque configuration d'événement, vérifier si l'événement déclenché correspond
    for (const shortcut of eventsToListen) {
      if (ev.type === shortcut.event) {
        // Pour les événements clavier, vérifier la touche
        if ('key' in ev && shortcut.key) {
          const keyboardEvent = ev as KeyboardEvent;
          if (keyboardEvent.key === shortcut.key) {
            emit('shortcut-trigger', ev);
          }
        } else {
          // Pour les autres types d'événements, on déclenche directement
          emit('shortcut-trigger', ev);
        }
      }
    }
  }

  onMounted(() => {
    // Ajoute un écouteur pour chaque type d'événement défini
    for (const shortcut of eventsToListen) {
      document.addEventListener(shortcut.event, handleEvent);
    }
  });

  onUnmounted(() => {
    for (const shortcut of eventsToListen) {
      document.removeEventListener(shortcut.event, handleEvent);
    }
  });

  /**
   * Exemple d'utilisation
   *   <div>
    <UShortcutSubscriber
      :events="[
        { event: 'keyup', key: 'Escape' },
        { event: 'click' }
      ]"
      @shortcut-trigger="handleShortcut"
    />
    <div v-if="isOpen">Contenu affiché. Appuyez sur Échap ou cliquez à l'extérieur pour fermer.</div>
  </div>
   */
</script>
