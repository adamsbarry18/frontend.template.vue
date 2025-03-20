<template>
  <div class="u-catalogue-card">
    <div class="card-title-wrapper">
      <div class="card-title">
        <slot name="title" />
      </div>
      <div v-if="$slots.actions" class="actions">
        <slot name="actions" />
      </div>
    </div>
    <div class="card-content">
      <slot />
    </div>
    <div v-if="$slots['explore-button']" class="explore-button">
      <slot name="explore-button" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
  .u-catalogue-card {
    --lateral-padding: 16px;
    background-color: var(--color-background-white);
    border: 1px solid var(--color-neutral-300);
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    flex: 1;
    flex-direction: column;
    position: relative;
    text-align: left;
    transition: 0.1s ease-in-out;
    width: 100%;

    &:hover {
      box-shadow: var(--box-shadow-xl);

      .explore-button {
        opacity: 1;
      }
    }

    .card-title-wrapper {
      align-items: center;
      background-color: var(--color-background-white);
      border-radius: 4px 4px 0 0;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      padding: 16px var(--lateral-padding) 8px;

      .card-title,
      .actions {
        align-items: center;
        display: flex;
      }

      .card-title {
        font-weight: 700;
        padding-right: 16px;
      }
    }

    .card-content {
      flex-grow: 1;
      padding: 0 var(--lateral-padding) 16px;
    }

    .explore-button {
      position: absolute;
      bottom: 8px;
      left: 12px;
      right: var(--lateral-padding);
      opacity: 0;
      transition: opacity 0.1s ease-in-out;
      width: 100%;
      .u-button {
        width: auto;
      }
    }
  }
</style>
