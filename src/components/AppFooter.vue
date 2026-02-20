<template>
  <v-footer class="app-footer bg-surface-variant border-t-sm d-flex flex-column justify-center align-center py-12 text-center">
    <div class="app-footer__content d-flex flex-column align-center text-caption text-secondary font-weight-regular ga-2">
      <div>
        &copy; {{ new Date().getFullYear() }} Field Friends
      </div>
      
      <div class="font-italic font-weight-black">
        Not affiliated with the University of Illinois at Urbana-Champaign
      </div>
      
      <a
        href="https://github.com/FieldFriends/field-friends-web"
        target="_blank"
        rel="noopener noreferrer"
        class="d-inline-flex align-center text-decoration-none text-secondary mt-1"
        aria-label="View source code on GitHub"
      >
        <v-icon icon="mdi-github" size="small" class="mr-1" />
        Source code
      </a>
    </div>
  </v-footer>
</template>

<style scoped>
.app-footer {
  height: 200px;
  flex: 0 0 auto;
}

.app-footer__content {
  max-width: 600px;
}
</style>