<template>
  <div :style="{ width: width || '100%' }" class="u-tag-input">
    <u-tooltip v-for="tag in visibleTags" :key="getTagKey(tag)">
      <el-tag
        :closable="!disabled"
        :disable-transitions="false"
        @close="handleTagClose(tag)"
        @click="handleTagClick(tag)"
      >
        <icon-base
          v-if="tag.icon"
          :icon="tag.icon"
          :size="20"
          :color="tag.color ? tag.color : 'var(--color-white)'"
        />
        <span class="tag-name" :title="getTagLabel(tag)">{{
          formatTagValue(tag)
        }}</span>
      </el-tag>
      <template #content>
        <slot name="tooltip" :tag="tag">
          <span>{{ getTagLabel(tag) }}</span>
          <div v-if="tag.value?.hasOwnProperty('filters')">
            <u>{{ $t('commons.taginput.filters') }}</u>
            <ul>
              <li v-for="filter of getTagFilters(tag)" :key="filter.key">
                {{ filter.key }} : {{ filter.value }}
              </li>
            </ul>
          </div>
        </slot>
      </template>
    </u-tooltip>

    <u-tooltip v-if="invisibleTags.length > 0">
      <el-tag>
        <span>+{{ invisibleTags.length }} </span>
      </el-tag>
      <template #content>
        <ul>
          <li
            v-for="tag in invisibleTags"
            :key="getTagKey(tag)"
            class="collapsed-tag-item"
          >
            <span>{{ formatTagValue(tag) }}</span>
            <div
              class="close-icon-wrapper -button-like"
              @click="handleTagClose(tag)"
            >
              <icon-base
                icon="icon-close"
                color="var(--color-neutral-500)"
                :size="12"
              />
            </div>
          </li>
        </ul>
      </template>
    </u-tooltip>

    <template v-if="inputVisible">
      <template v-if="type === '' || type === 'number' || type === 'string'">
        <el-autocomplete
          v-if="autocompletion"
          ref="saveTagInput"
          v-model="inputValue"
          class="input-new-tag"
          :fetch-suggestions="querySearchAsync"
          size="small"
          @keyup.enter="handleInputConfirm"
          @select="handleAutocompleteSelect"
          @paste="handlePaste"
        >
          <template #default="{ item }">
            <u-tooltip
              v-if="hasAutocompleteTooltip(item.value)"
              placement="right"
            >
              <div class="autocomplete-tooltip-text">
                {{ item.value }}
              </div>
              <template #content>
                {{ item.value }}
              </template>
            </u-tooltip>
            <div v-else>
              {{ item.value }}
            </div>
          </template>
        </el-autocomplete>
        <el-input
          v-else
          ref="saveTagInput"
          v-model="inputValue"
          class="input-new-tag"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
          @paste="handlePaste"
        />
      </template>
      <u-select-group
        v-else-if="type === 'enum'"
        ref="select-group"
        v-model="inputValue"
        :options="filteredEnumOptions"
        :automatic-dropdown="true"
        :teleported="false"
        :popper-append-to-body="false"
        :popper-class="'tag-input-select-group-popper'"
        :focus-on-mount="true"
        placeholder=""
        class="input-new-tag-select"
        @change="handleInputConfirm"
        @blur="onBlur"
        @visible-change="onSelectVisibleChange"
      />
    </template>
    <template v-else>
      <u-tooltip v-if="isFull">
        <template #default>
          <div>
            <button class="button-new-tag -button-like" disabled>+</button>
          </div>
        </template>
        <template #content>
          {{
            $t('commons.taginput.too-much-elements.tooltip', {
              limit: maxTotalValues,
            })
          }}
        </template>
      </u-tooltip>
      <button
        v-else-if="!disabled"
        class="button-new-tag -button-like"
        @click.stop="showInput"
      >
        +
      </button>
    </template>
  </div>
</template>
<script setup lang="ts">
  import {
    type PropType,
    ref,
    computed,
    onMounted,
    onBeforeUnmount,
    nextTick,
    getCurrentInstance,
  } from 'vue';
  import { ellipsis } from '@/libs/utils/String';
  import UTooltip from '@/commons/others/UTooltip.vue';
  import USelectGroup from '@/commons/forms/USelectGroup.vue';
  import IconBase from '@/commons/icones/IconBase.vue';
  import { ElTag, ElAutocomplete, ElInput } from 'element-plus';
  import i18n from '@/i18n';

  const MAX_TAG_LENGTH = 25;
  const MAX_TOTAL_VALUES = 100;

  const props = defineProps({
    type: {
      default: '',
      type: String as PropType<'' | 'override' | 'enum' | 'number' | 'string'>,
      validator: (item: string) =>
        ['', 'override', 'enum', 'number', 'string'].includes(item),
    },
    values: {
      required: true,
      type: Array as PropType<any[]>,
    },
    width: {
      type: String,
      default: '',
    },
    enumOptions: {
      type: Array as PropType<any[]>,
      default: null,
    },
    autocompletion: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    collapseLimit: {
      type: Number,
      default: 0,
    },
    maxTotalValues: {
      type: Number,
      default: MAX_TOTAL_VALUES,
    },
  });

  const emit = defineEmits([
    'tag-click',
    'remove-item',
    'change',
    'show-input',
    'add-tag-click',
    'add-item',
    'query-search-async',
    'blur',
  ]);
  const inputVisible = ref(false);
  const inputValue = ref('');
  const saveTagInput = ref<HTMLInputElement | null>(null);
  const selectGroup = ref<any>(null); // Type as needed

  const visibleTags = computed(() => {
    if (props.collapseLimit === 0) {
      return props.values;
    }
    return props.values.slice(0, props.collapseLimit);
  });
  const invisibleTags = computed(() => {
    if (
      props.collapseLimit === 0 ||
      props.values.length < props.collapseLimit
    ) {
      return [];
    }
    return props.values.slice(props.collapseLimit);
  });
  const filteredEnumOptions = computed(() => {
    return (props.enumOptions || []).filter(
      (o) => !props.values.map((v) => v.value).includes(o.value)
    );
  });
  const isFull = computed(() => {
    return props.values.length >= props.maxTotalValues;
  });

  const getTagLabel = (tag: any) => {
    let tagLabel = tag.value;

    if (props.type === 'enum' && props.enumOptions) {
      const option = props.enumOptions.find((o) => o.value === tag.value);
      if (option && option.label) {
        tagLabel = option.label;
      }
    } else if (tag.value?.hasOwnProperty('text')) {
      tagLabel = tag.value.text;
    } else if (tag.label) {
      tagLabel = tag.label;
    }

    return tagLabel;
  };
  const getTagKey = (tag: any) => {
    if (typeof tag.value === 'string' || typeof tag.value === 'number') {
      return tag.value;
    }
    const ordered: any = {};
    Object.keys(tag.value)
      .sort()
      .forEach((key) => {
        ordered[key] = tag.value[key];
      });
    return JSON.stringify(ordered);
  };
  const getTagFilters = (tag: any) => {
    if (!tag.value?.hasOwnProperty('filters')) {
      return [];
    }

    return Object.keys(tag.value.filters).map((key) => ({
      key,
      value: tag.value.filters[key],
    }));
  };
  const handleTagClick = (tag: any) => {
    emit('tag-click', tag);
  };
  const handleTagClose = (tag: any) => {
    emit('remove-item', tag);
    emit(
      'change',
      props.values.filter((item) => item !== tag)
    );
  };
  const onSelectVisibleChange = (visible: boolean) => {
    if (!visible) {
      inputVisible.value = false;
    }
  };
  const showInput = () => {
    emit('show-input');
    if (props.type === 'override') {
      emit('add-tag-click');
    } else {
      inputVisible.value = true;
      if (
        props.type === '' ||
        props.type === 'string' ||
        props.type === 'number'
      ) {
        nextTick(() => {
          saveTagInput.value?.focus();
        });
      }
    }
  };
  const handleInputConfirm = () => {
    const localInputValue = inputValue.value;
    if (validateInput(localInputValue)) {
      emit('add-item', localInputValue);
      const tag: any = { value: localInputValue };
      if (props.type === 'enum') {
        const option = props.enumOptions.find(
          (o) => o.value === localInputValue
        );
        if (option?.icon) {
          tag.icon = option.icon;
        }
        if (option?.color) {
          tag.color = option.color;
        }
      }

      emit('change', [...props.values, tag]);
    }
    inputVisible.value = false;
    inputValue.value = '';
    if (props.type === 'enum') {
      // Allow multiple successive selections for enums
      openSelectGroup();
    }
  };
  const openSelectGroup = () => {
    setTimeout(() => {
      if (filteredEnumOptions.value.length !== 0 && !isFull.value) {
        showInput();
        if (selectGroup.value) {
          // In case select group was already instancied
          selectGroup.value.focus();
        }
      }
    }, 100);
  };
  const validateInput = (localInputValue: string | number) => {
    if (!localInputValue) {
      return false;
    }
    // No duplicates
    if (
      props.values.find(
        (v) => getTagKey(v) === getTagKey({ value: localInputValue })
      )
    ) {
      return false;
    }

    // Validate number type
    if (props.type === 'number' && isNaN(Number(localInputValue))) {
      return false;
    }

    if (isFull.value) {
      return false;
    }

    return true;
  };
  const querySearchAsync = (queryString: string, cb: any) => {
    emit('query-search-async', { queryString, cb });
  };
  const handleAutocompleteSelect = ({ value }: any) => {
    if (value !== i18n.global.t('commons.autocomplete.no-result')) {
      inputValue.value = value;
      handleInputConfirm();
    } else {
      inputValue.value = '';
    }
  };
  const handlePaste = (event: ClipboardEvent) => {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const data = clipboardData?.getData('Text');

    if (data) {
      const splittedData = data
        .split(/;|\t|\n|(?: \/ )/) // Allow to paste multiple values separated by ";", "\t", "\n" or " / "
        .map((e) => e.trim())
        .filter((e) => validateInput(e));

      if (splittedData.length > 1) {
        event.stopPropagation();
        event.preventDefault();

        if (props.values.length + splittedData.length > props.maxTotalValues) {
          splittedData.length = props.maxTotalValues - props.values.length;
          console.error(
            i18n.global.t('audience.taginput.too-much-elements.toast', {
              added: splittedData.length,
              limit: props.maxTotalValues,
            })
          );
        }

        const formattedValues = splittedData.map((value) => {
          emit('add-item', value);
          return { value };
        });
        emit('change', [...props.values, ...formattedValues]);
        inputVisible.value = false;
      }
    }
  };
  const formatTagValue = (tag: any) => {
    const displayString = getTagLabel(tag);

    // Manual ellipsis if needed (css prop is not used because we want to show a tooltip when an ellipsis is present)
    return ellipsis(displayString, MAX_TAG_LENGTH);
  };
  const hasTooltip = (tag: any) => {
    return (
      getTagLabel(tag).length > MAX_TAG_LENGTH ||
      getTagFilters(tag).length > 0 ||
      !!getCurrentInstance()?.slots.tooltip
    );
  };
  const hasAutocompleteTooltip = (value: string) => {
    const element = document.createElement('canvas');
    const context = element.getContext('2d') as CanvasRenderingContext2D;
    context.font = '12px Roboto';
    return context.measureText(value).width > 170;
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (inputVisible.value) {
      const tagInputEl = saveTagInput.value;
      const selectGroupEl = selectGroup.value?.$el;
      const plusButton =
        getCurrentInstance()?.proxy?.$el.querySelector('.button-new-tag');

      if (
        tagInputEl &&
        !tagInputEl.contains(event.target as Node) &&
        !plusButton.contains(event.target as Node) &&
        (!selectGroupEl || !selectGroupEl.contains(event.target as Node))
      ) {
        handleInputConfirm();
      }
    }
  };
  const onBlur = () => {
    // Workaround tags not being rendered immediately after selection
    setTimeout(() => emit('blur'), 100);
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<style lang="scss" scoped>
  .u-tag-input {
    display: flex;
    position: relative;
    flex-wrap: wrap;
    transition: border-color 0.2s;
    margin-bottom: 20px;
    border: 1px solid var(--color-input-border);
    border-radius: 4px;
    background-color: var(--color-background-white);
    padding: 4px;
    min-width: 180px;
    min-height: 40px;

    &:focus-within {
      outline: 3px solid var(--color-input-outline-focus);
    }
    &:hover {
      border-color: var(--color-input-border-hover);
    }

    .tag-name {
      padding-right: 20px;
      font-weight: 500;
    }
    .el-tag {
      position: relative;
      z-index: 2;
      margin: 2px 4px;
      border: none;
      border-radius: 3px;
      background: var(--color-neutral-800);
      height: 26px;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 26px;
      white-space: nowrap;
      span {
        color: var(--color-white);
      }

      .el-tag__close.el-icon-close {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 16px;
        height: 16px;
        line-height: 18px;
        color: var(--color-white);
        font-size: var(--paragraph-02);
        font-weight: 700;
        cursor: pointer; // Make sure the close icon is clickable
      }

      .el-tag__close:hover {
        background-color: transparent;
      }
    }

    .button-new-tag {
      margin: 2px 4px;
      border: 1px solid var(--color-input-border);
      border-radius: 4px;
      padding: 0;
      width: 26px;
      height: 26px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--color-neutral-800);
      font-size: var(--paragraph-03);
      background: var(--color-white);
      span {
        font-size: var(--paragraph-02);
        line-height: 100%;
      }

      &.is-disabled {
        border-color: var(--color-input-disabled-border);
        color: var(--color-input-disabled-content);
        background-color: var(--color-disabled-bg);
      }
      &:hover:not(.is-disabled) {
        border-color: var(--color-input-border-hover);
        background: var(--color-white);
      }
    }
  }

  .input-new-tag {
    margin-right: 10px;
    width: auto;
    min-width: 180px;
    &.el-autocomplete.el-autocomplete--small,
    &.el-input.el-input--small {
      --el-input-content-height: 28px;

      .el-input__inner {
        margin-left: 4px;
        padding: 0 10px;
        height: var(--el-input-content-height);
        line-height: var(--el-input-content-height);
      }
    }
  }

  .input-new-tag-select {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    :deep(.el-input) {
      height: 100%;

      .el-input__wrapper {
        height: 100%;
        box-shadow: none;
        &::after {
          content: none;
        }
        &::before {
          content: none;
        }
      }

      .el-input__inner {
        border: transparent;
        background-color: transparent;
        padding: 0;
        height: 100%;
      }
    }
  }
  .collapsed-tag-item {
    display: flex;
    justify-content: space-between;
    min-width: 150px;
    .close-icon-wrapper {
      margin-left: 16px;
    }
  }
  .autocomplete-tooltip-text {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tag-input-select-group-popper {
    .el-popper__content {
      padding: 0;
      margin: 0;
      box-shadow: var(--el-box-shadow-light);
      border: none;
      overflow: hidden;
      border-radius: var(--el-border-radius-base);
    }
  }
</style>
