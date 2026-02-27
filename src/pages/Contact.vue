<template>
  <div class="contact-page bg-background text-primary d-flex flex-column">
    <v-container class="flex-grow-1 pt-12 pb-16 contact-page__content">
      <h1 class="text-h2 font-weight-bold mb-8 text-primary mt-md-8 text-center" id="contact-heading" tabindex="-1">
        Contact Us
      </h1>

      <div class="mb-12 d-flex flex-column ga-8">
        <div>
          <p class="text-body-1 text-secondary page-text">
            For questions, feedback, or assistance, please reach out to:
            <a href="mailto:fieldfriends.team@gmail.com" class="text-primary font-weight-bold text-decoration-none">fieldfriends.team@gmail.com</a>
          </p>
        </div>

        <div>
          <p class="text-body-1 text-secondary page-text">
            Automated messages, such as login codes and match introductions, will be sent from:
            <a href="mailto:noreply@fieldfriends.org" class="text-primary font-weight-bold text-decoration-none" tabindex="-1" style="pointer-events: none;">noreply@fieldfriends.org</a>
          </p>
        </div>
      </div>

      <div class="mt-8">
        <p class="text-body-1 text-secondary page-text">
          We will never contact you from any other email addresses. Additionally, because Field Friends operates in distinct monthly rounds, you will only receive automated emails during a round you have actively signed up for.
        </p>
      </div>

    </v-container>
  </div>
</template>

<style scoped lang="scss">
.contact-page {
  min-height: 100vh;
  
  &__content {
    max-width: 800px;
    margin: 0 auto;
  }

  .page-text {
    line-height: 1.8;
  }
}
</style>
