<template>
  <div class="user-authorizations-form">
    <div class="global-card-title">
      <icon-base class="icon" icon="icon-settings" :color="'var(--color-neutral-800)'" size="24" />
      <h3>{{ $t('user.settings.authorizations.title') }}</h3>
    </div>
    <div v-if="localAuthorizations" class="form-layout">
      <div class="level-internal-group">
        <div class="form-section">
          <h4>{{ $t('user.settings.authorizations.level') }}</h4>
          <u-select-group
            :model-value="localAuthorizations.level"
            :options="levelOptions"
            :disabled="!canEdit"
            @update:model-value="updateAuthorization('level', $event)"
          />
        </div>

        <div class="form-section">
          <h4>{{ $t('user.settings.authorizations.internal') }}</h4>
          <u-radio
            :model-value="localAuthorizations.internal"
            :options="internalOptions"
            :disabled="!canEdit"
            @update:model-value="updateAuthorization('internal', $event)"
          />
        </div>
      </div>

      <div class="permissions-status-group">
        <div class="form-section">
          <h4>{{ $t('user.settings.authorizations.permissions') }}</h4>
          <u-select-group
            v-if="availableFeatures"
            :model-value="selectedPermissions"
            :options="permissionOptions"
            :placeholder="$t('user.settings.authorizations.select-permissions')"
            :disabled="!canEdit"
            multiple
            filterable
            group-by="feature"
            with-group-label
            clearable
            @update:model-value="updatePermissions"
          />
          <div v-else>
            {{ $t('commons.loading') }}
          </div>
        </div>

        <div class="form-section">
          <h4>{{ $t('user.settings.authorizations.status') }}</h4>
          <u-radio
            :model-value="localAuthorizations.isActive"
            :options="activeOptions"
            :disabled="!canEdit"
            @update:model-value="updateAuthorization('isActive', $event)"
          />
        </div>
      </div>

      <div class="form-section">
        <h4>{{ $t('user.settings.authorizations.define-expiration') }}</h4>
        <u-switch
          :model-value="expirationEnabled"
          :true-label="$t('commons.yes')"
          :false-label="$t('commons.no')"
          :disabled="!canEdit"
          @update:model-value="toggleExpiration"
        />
      </div>

      <div v-if="expirationEnabled" class="form-section">
        <h4>{{ $t('user.settings.authorizations.expiration') }}</h4>
        <u-date-picker
          :model-value="localAuthorizations.permissionsExpireAt"
          type="datetime"
          :placeholder="$t('user.settings.authorizations.select-expiration')"
          :disabled="!canEdit || !expirationEnabled"
          clearable
          @update:model-value="updateExpireDate"
        />
        <small v-if="localAuthorizations.permissionsExpireAt && expirationEnabled" class="help-text">
          {{ $t('user.settings.authorizations.expiration-info') }}
        </small>
      </div>
    </div>
    <div v-else class="loading-placeholder">
      <p>{{ $t('commons.loading') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, PropType } from 'vue';
  import { USelectGroup, URadio, UDatePicker, USwitch } from '@/modules/ui';
  import IconBase from '@/modules/ui/icons/IconBase.vue';
  import { useAuthorisationsStore } from '@/stores/modules/auth/authorisations';
  import { SecurityLevel } from '@/stores/modules/users/models/UserModel';
  import i18n from '@/i18n';

  interface UserAuthorizationData {
    level: number;
    internal: boolean;
    permissions: Record<string, string[]> | null;
    isActive: boolean;
    permissionsExpireAt: Date | null;
  }

  const props = defineProps({
    authorizations: {
      type: Object as PropType<UserAuthorizationData | null>,
      required: true,
    },
    canEdit: {
      type: Boolean,
      default: true,
    },
  });

  const emit = defineEmits(['update:authorizations']);

  const authorisationsStore = useAuthorisationsStore();

  const localAuthorizations = ref<UserAuthorizationData | null>(null);
  const expirationEnabled = ref(false);
  const hasInitializedExpirationEnabled = ref(false);

  const activeOptions = computed(() => [
    { value: true, label: i18n.global.t('commons.active') },
    { value: false, label: i18n.global.t('commons.inactive') },
  ]);
  const availableFeatures = ref<Record<string, string[]> | null>(null);

  function toggleExpiration(enabled: boolean) {
    expirationEnabled.value = enabled;

    if (localAuthorizations.value) {
      const updatedAuths = {
        ...localAuthorizations.value,
        permissionsExpireAt: enabled ? localAuthorizations.value.permissionsExpireAt || null : null,
      };
      emit('update:authorizations', updatedAuths);
    }
  }

  const levelOptions = computed(() => [
    {
      value: SecurityLevel.EXTERNAL,
      label: i18n.global.t('security.level.external'),
    },
    {
      value: SecurityLevel.READER,
      label: i18n.global.t('security.level.reader'),
    },
    { value: SecurityLevel.USER, label: i18n.global.t('security.level.user') },
    {
      value: SecurityLevel.INTEGRATOR,
      label: i18n.global.t('security.level.integrator'),
    },
    {
      value: SecurityLevel.ADMIN,
      label: i18n.global.t('security.level.admin'),
    },
  ]);

  const internalOptions = computed(() => [
    { value: true, label: i18n.global.t('commons.yes') },
    { value: false, label: i18n.global.t('commons.no') },
  ]);

  const permissionOptions = computed(() => {
    if (!availableFeatures.value) return [];
    const options: { value: string; label: string; feature: string }[] = [];
    for (const feature in availableFeatures.value) {
      availableFeatures.value[feature].forEach((action) => {
        options.push({
          value: `${feature}:${action}`,
          label: `${feature} - ${action}`,
          feature: feature,
        });
      });
    }
    return options;
  });

  // Computed property to transform permissions format for the select component
  const selectedPermissions = computed(() => {
    if (!localAuthorizations.value?.permissions) return [];
    const selected: string[] = [];
    for (const feature in localAuthorizations.value.permissions) {
      localAuthorizations.value.permissions[feature].forEach((action) => {
        selected.push(`${feature}:${action}`);
      });
    }
    return selected;
  });

  function updateAuthorization<K extends keyof Omit<UserAuthorizationData, 'permissions'>>(
    field: K,
    value: UserAuthorizationData[K]
  ) {
    if (localAuthorizations.value && localAuthorizations.value[field] !== value) {
      const updatedAuths = {
        ...localAuthorizations.value,
        [field]: value,
      };
      localAuthorizations.value = updatedAuths;
      emit('update:authorizations', updatedAuths);
    }
  }

  // Function to update permissions based on the select component's output
  function updatePermissions(selectedValues: string[]) {
    const newPermissions: Record<string, string[]> = {};
    selectedValues.forEach((value) => {
      const [feature, action] = value.split(':');
      if (!newPermissions[feature]) {
        newPermissions[feature] = [];
      }
      if (!newPermissions[feature].includes(action)) {
        newPermissions[feature].push(action);
      }
    });

    if (localAuthorizations.value) {
      const updatedAuths = {
        ...localAuthorizations.value,
        permissions: newPermissions,
      };
      localAuthorizations.value = updatedAuths;
      emit('update:authorizations', updatedAuths);
    }
  }

  function updateExpireDate(value: Date | [Date, Date] | null) {
    if (localAuthorizations.value && expirationEnabled.value) {
      let dateToSet: Date | null = null;
      if (Array.isArray(value)) {
        dateToSet = value[0] ?? null;
      } else {
        dateToSet = value;
      }

      const updatedAuths = {
        ...localAuthorizations.value,
        permissionsExpireAt: dateToSet,
      };
      localAuthorizations.value = updatedAuths;
      emit('update:authorizations', updatedAuths);
    } else if (localAuthorizations.value && !expirationEnabled.value) {
      const updatedAuths = {
        ...localAuthorizations.value,
        permissionsExpireAt: null,
      };
      localAuthorizations.value = updatedAuths;
      emit('update:authorizations', updatedAuths);
    }
  }

  watch(
    () => props.authorizations,
    (newAuths) => {
      if (newAuths) {
        localAuthorizations.value = { ...newAuths };

        if (!hasInitializedExpirationEnabled.value) {
          expirationEnabled.value = newAuths.permissionsExpireAt !== null;
          hasInitializedExpirationEnabled.value = true;
        } else {
          const propsDateExists = newAuths.permissionsExpireAt !== null;
          if (propsDateExists !== (localAuthorizations.value?.permissionsExpireAt !== null)) {
            if (propsDateExists && !expirationEnabled.value) {
              expirationEnabled.value = true;
            } else if (!propsDateExists && expirationEnabled.value) {
              expirationEnabled.value = false;
            }
          }
        }
      } else {
        localAuthorizations.value = null;
        expirationEnabled.value = false;
        hasInitializedExpirationEnabled.value = false;
      }
    },
    { immediate: true, deep: true }
  );

  onMounted(async () => {
    try {
      if (!authorisationsStore.features) {
        availableFeatures.value = await authorisationsStore.fetchAllFeatures();
      } else {
        availableFeatures.value = authorisationsStore.features;
      }
    } catch (error) {
      console.error('Failed to fetch features:', error);
    }
  });
</script>

<style lang="scss" scoped>
  .user-authorizations-form {
    .form-layout {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .level-internal-group,
    .permissions-status-group {
      display: flex;
      gap: 20px;

      .form-section {
        flex: 1;
      }
    }

    .form-section {
      h4 {
        margin-bottom: 10px;
        color: var(--color-text-secondary);
      }
      .u-select-group,
      .u-radio,
      .u-date-picker,
      .u-switch {
        width: 100%;
      }
      .u-radio,
      .u-switch {
        margin-top: 5px;
      }
      .u-date-picker {
        margin-top: 10px;
      }
      small {
        margin-left: 5px;
      }
    }

    .global-card-title {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--color-input-border);
      padding-bottom: 12px;

      .icon {
        margin-right: 8px;
      }
    }

    .loading-placeholder {
      padding: 20px;
      text-align: center;
      color: var(--color-text-secondary);
    }
  }
</style>
