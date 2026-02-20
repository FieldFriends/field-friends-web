<template>
  <div class="landing-page bg-background text-primary d-flex flex-column">
    
    <!-- Hero / Header -->
    <v-container class="flex-grow-1 d-flex flex-column justify-center align-center text-center pt-16 pb-16">
      <h1 class="text-h1 font-weight-bold mb-6 text-primary">
        Field Friends
      </h1>
      
      <p class="landing-page__subtitle text-h4 text-secondary mb-12 font-dm-sans font-weight-regular">
        Get matched with friends at UIUC without having to swipe.
      </p>

      <v-btn
        class="px-12 mb-16"
        :to="AppRoutes.Login.path"
      >
        Sign up
      </v-btn>

      <div class="landing-page__content w-100 mb-12">
        <v-divider :thickness="2" />
      </div>

      <div class="landing-page__goal mb-1">
        <h2 class="font-playfair">
          Our goal:
        </h2>

        <p class="text-h6 text-primary font-italic font-eb-garamond mb-6">
          &OpenCurlyDoubleQuote;To help people in the university community make friends by matching people into small groups based on shared interests.&CloseCurlyDoubleQuote;
        </p>
        <p class="text-body-1 text-secondary">
          Powered by our smart, local, private algorithm to connect you with 2-3 other people who share your interests.
        </p>
      </div>

    </v-container>

    <v-container class="landing-page__content pb-16">
      <v-divider class="mb-12 border-opacity-25" color="secondary"></v-divider>
      
      <h2 class="text-h4 text-center mb-12 font-weight-bold text-primary">How it works</h2>

      <v-row>
        <v-col cols="12" md="4" class="text-center px-6 mb-8 mb-md-0">
          <div class="text-h2 text-accent mb-4 opacity-80">
            1
          </div>
          <h3 class="text-h6 font-dm-sans font-weight-bold text-primary mb-2">
            Verify
          </h3>
          <p class="text-body-2 text-secondary">
            Sign in with and verify your <strong>@illinois.edu</strong> email with a one-time code.
          </p>
        </v-col>

        <v-col cols="12" md="4" class="text-center px-6 mb-8 mb-md-0">
          <div class="text-h2 text-accent mb-4 opacity-80">
            2
          </div>
          <h3 class="text-h6 font-dm-sans font-weight-bold text-primary mb-2">
            Sign up
          </h3>
          <p class="text-body-2 text-secondary">
            Fill out a short survey where you write about your interests, hobbies, and social pace.
          </p>
        </v-col>

        <v-col cols="12" md="4" class="text-center px-6">
          <div class="text-h2 text-accent mb-4 opacity-80">
            3
          </div>
          <h3 class="text-h6 font-dm-sans font-weight-bold text-primary mb-2">
            Connect
          </h3>
          <p class="text-body-2 text-secondary">
            Get introduced to your new group via email.
          </p>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="landing-page__content py-8 text-center">
      <v-divider class="mb-12 border-opacity-25" color="secondary"></v-divider>
        <h3 class="text-h4 text-primary mb-4 font-weight-bold">
          Privacy First
        </h3>
        
        <p class="text-body-1 font-weight-regular text-secondary">
          Your data is encrypted before it's ever stored on our database.
          All of your information, including the connection to your email, is <strong>permanently deleted</strong> after you're matched.
        </p>
        <p class="landing-page__privacy-details text-body-1 mt-8 font-weight-regular text-secondary">
          Our algorithm is run locally; your data is never processed online for matching.
          The
          <a
            href="https://github.com/FieldFriends/field-friends-web"
            target="_blank"
            rel="noopener noreferrer"
            class="text-decoration-none font-weight-bold text-primary d-inline-flex align-center"
          >
            code for this site
            <v-icon
              icon="mdi-open-in-new"
              size="x-small"
              class="ms-1"
            />
          </a>
          is also publicly available, so you can see exactly how your data is handled.
        </p>
    </v-container>

  </div>
</template>



<script lang="ts" setup>
import { AppRoutes } from '@/router/routeConfig';
</script>

<style scoped lang="scss">
.landing-page {
  min-height: 100vh;

  &__subtitle {
    max-width: 690px;
    font-size: 1.92rem !important;
    line-height: 1.3 !important;
  }

  &__goal {
    max-width: 700px;
  }

  &__content {
    max-width: 800px;
  }

  &__privacy-details {
    line-height: 1.6 !important;
  }
}
</style>