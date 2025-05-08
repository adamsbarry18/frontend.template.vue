<template>
  <div class="password-security-indicators">
    <span class="validator-indicator" :class="{ '-valid': isIndicatorValid(indicators.isLength) }">
      {{ $t('user.settings.password-validator.minimum-length') }}
    </span>
    <span class="validator-indicator" :class="{ '-valid': isIndicatorValid(indicators.haveLowercase) }">
      {{ $t('user.settings.password-validator.lowercase') }}
    </span>
    <span class="validator-indicator" :class="{ '-valid': isIndicatorValid(indicators.haveUppercase) }">
      {{ $t('user.settings.password-validator.uppercase') }}
    </span>
    <span class="validator-indicator" :class="{ '-valid': isIndicatorValid(indicators.haveNumber) }">
      {{ $t('user.settings.password-validator.number') }}
    </span>
    <span
      class="validator-indicator"
      :class="{ '-valid': isIndicatorValid(indicators.haveSpecialCharacter) }"
    >
      {{ $t('user.settings.password-validator.special') }}
    </span>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    indicators: {
      type: Object,
      required: true,
    },
  });
  function isIndicatorValid(indicator: any): boolean {
    // Vuelidate indicator handling
    if (typeof indicator === 'object') {
      return !indicator.$invalid;
    }
    // Custom indicator handling
    if (typeof indicator === 'boolean') {
      return indicator;
    }
    return false;
  }
</script>

<style lang="scss" scoped>
  .password-security-indicators {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: flex-start;
    padding-top: 12px;
    max-height: 120px;
    .validator-indicator {
      flex: 1 1 30px;
      margin-right: 20px;
      &::before {
        display: inline-block;
        margin-right: 10px;
        border-radius: 50%;
        background-color: var(--color-neutral-300);
        width: 8px;
        height: 8px;
        content: ' ';
      }
      &.-valid {
        &::before {
          background-color: var(--color-green-500);
        }
      }
    }
  }
</style>
