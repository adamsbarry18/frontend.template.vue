import { ref } from 'vue';
import UUploader from '@/modules/common/forms/UUploader.vue';

export default {
  title: 'Forms/Uploader',
};

export const Uploader = () => ({
  components: { UUploader },
  template: `
    <div style="padding: 16px;">
      <!-- Cas par défaut -->
      <section style="margin-bottom: 24px;">
        <h3>Cas par défaut</h3>
        <u-uploader v-model="defaultFile" :max-file-size="maxFileSize" />
        <p>Fichier sélectionné : {{ defaultFile?.name || 'Aucun' }}</p>
      </section>

      <!-- Cas avec accept et taille max -->
      <section style="margin-bottom: 24px;">
        <h3>Accept et taille max</h3>
        <u-uploader v-model="customFile" :accept="accept" :max-file-size="maxFileSize" />
        <p>Fichier sélectionné : {{ customFile?.name || 'Aucun' }}</p>
      </section>

      <!-- Cas avec fichier initial -->
      <section style="margin-bottom: 24px;">
        <h3>Fichier initial</h3>
        <u-uploader v-model="initialFile" />
        <p>Fichier sélectionné : {{ initialFile?.name || 'Aucun' }}</p>
      </section>
    </div>
  `,
  setup() {
    const defaultFile = ref({});

    const customFile = ref({});
    const accept = '.png,.jpg,.jpeg,.pdf';
    const maxFileSize = 1024 * 1024 * 2; // 2 MB

    const initialFile = ref({
      name: 'example.pdf',
      size: 1024 * 500, // 500 KB
    });

    return {
      defaultFile,
      customFile,
      accept,
      maxFileSize,
      initialFile,
    };
  },
});
