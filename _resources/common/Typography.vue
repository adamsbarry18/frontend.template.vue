<template>
  <div class="boxContent typography">
    <h1>Heading Level 1 (--heading-01)</h1>
    <h2>Heading Level 2 (--heading-02)</h2>
    <h3>Heading Level 3 (--heading-03)</h3>
    <h4>Heading Level 4 (--heading-04)</h4>
    <p class="paragraph-1">Paragraph 1 (--paragraph-01)</p>
    <p class="paragraph-2">Paragraph 2 (--paragraph-02)</p>
    <p class="paragraph-3">Paragraph 3 (--paragraph-03)</p>
    <div class="caption">Caption (--caption)</div>
    <div class="footer">Footer (--footer)</div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
  .typography {
    .paragraph-1 {
      font-size: var(--paragraph-01);
    }
    .paragraph-2 {
      font-size: var(--paragraph-02);
    }
    .paragraph-3 {
      font-size: var(--paragraph-03);
    }
    .caption {
      font-size: var(--caption);
    }
    .footer {
      font-size: var(--footer);
    }
  }
</style>
