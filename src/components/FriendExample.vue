<template>
  <div class="friend-example position-relative px-4 pt-4 pb-3 mt-4 bg-surface-variant rounded-e-lg">
    <div class="friend-example__title bg-surface-variant px-1 py-1 text-caption font-weight-bold text-secondary text-uppercase">
      <!-- Example -->
       Ex.
    </div>
    <div class="friend-example__content text-body-2 text-primary font-italic">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.friend-example {
  border-left: 4px solid rgb(var(--v-theme-accent));
}

.friend-example__title {
  letter-spacing: 0.05em;
  position: absolute;
  top: 0;
  left: 0.3rem;
  transform: translateY(-40%);
  line-height: 1;
  text-transform: none !important;
  font-size: 0.7rem !important;
}
</style>
