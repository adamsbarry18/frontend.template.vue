<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import UButton from './commons/basic/UButton.vue';
  import UHelpButton from './commons/others/UHelpButton.vue';
  import UNumberInput from './commons/forms/UNumberInput.vue';
  import UDatePicker from './commons/forms/UDatePicker.vue';
  import { ElSwitch } from 'element-plus';
  import USelectGroup from '@/commons/forms/USelectGroup.vue';
  const value1 = ref(true);
  const isActive = ref(false);
  const seletedDate = ref(null);
  const value = ref('je suis clicked');
  const valeu = ref('');
  const options = reactive([
    { label: 'test1', value: 1, suffix: '(suffix 1)' },
    { label: 'test2', value: 2, suffix: '(suffix 2)' },
    { label: 'test3', value: 3 },
    { label: 'test4', value: 4 },
  ]);
  const handleClick = () => {
    alert(value.value);
  };
  import { ElMessage, ElMessageBox } from 'element-plus';

  const open = () => {
    ElMessageBox.confirm(
      'proxy will permanently delete the file. Continue?',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'success',
      }
    );
  };
</script>

<template>
  <div class="demo">
    <h1>u-button Examples</h1>

    <div class="u-button-group">
      <h3>Different Types</h3>
      <u-button type="default" @click="handleClick">{{
        $t('commons.yes')
      }}</u-button>
      <u-button type="primary" @click="handleClick">Primary</u-button>
      <u-button type="secondary" @click="handleClick">Secondary</u-button>
      <u-button type="tertiary" @click="handleClick">Tertiary</u-button>
      <u-button type="warning" @click="handleClick">Warning</u-button>
      <u-button type="delete" @click="handleClick">delete</u-button>
    </div>

    <div class="u-button-group">
      <h3>Icones et États</h3>
      <u-button icon="IconAdd" type="primary" @click="handleClick"
        >Ajouter</u-button
      >
      <u-button icon="IconDelete" type="delete" @click="handleClick"
        >Supprimer</u-button
      >
      <u-button icon="icon-edit" type="secondary" @click="handleClick"
        >Modifier</u-button
      >
    </div>
    <div>
      <u-help-button
        placement="right"
        :hasLabel="true"
        :active="isActive"
        size="20"
        @click="isActive = !isActive"
      >
        <template #content>
          <p>
            My popover content.zezrzerzqsdqsdqqqqqqqsdddddddddddddddddddddddddr
          </p>
        </template>
      </u-help-button>
    </div>
    <el-switch v-model="value1" />

    <section style="margin-bottom: 24px">
      <h3>Default DatePicker</h3>
      <u-date-picker v-model="seletedDate" />
      <p style="margin-top: 10px">Selected Date: {{ seletedDate }}</p>
    </section>
    <u-button plain @click="open">Click to open the Message Box</u-button>
  </div>
</template>

<style scoped>
  .demo {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .u-button-group {
    margin-bottom: 2rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  h1 {
    margin-bottom: 2rem;
  }

  h3 {
    width: 100%;
    margin-bottom: 1rem;
  }
</style>
