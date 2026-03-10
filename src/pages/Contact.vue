<template>
  <div class="bg-background text-primary d-flex flex-column min-vh-100">
    <v-container class="flex-grow-1 pt-12 pb-16">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h1 class="text-h4 text-md-h2 font-weight-bold mb-8 text-primary mt-md-8 text-center" id="contact-heading" tabindex="-1">
            Contact Us
          </h1>

          <div class="mb-12 d-flex flex-column ga-8">
            <div>
              <p class="text-body-1 text-secondary page-text d-flex flex-wrap align-center ga-2">
                <span>For questions, feedback, or assistance, please reach out to:</span>
                <a
                  href="mailto:support@fieldfriends.org"
                  class="text-primary font-weight-bold text-decoration-none"
                >
                  support@fieldfriends.org
                </a>
                <v-btn
                  prepend-icon="mdi-content-copy"
                  variant="tonal"
                  color="secondary"
                  size="small"
                  class="text-body-2 ml-1"
                  @click="copyEmail"
                >
                  Copy
                </v-btn>
              </p>
            </div>

            <div>
              <p class="text-body-1 text-secondary page-text">
                Automated messages, such as login codes and match introductions, will be sent from:
                <strong>noreply@fieldfriends.org</strong>
              </p>
            </div>

            <div>
              <p class="text-body-1 text-secondary page-text">
                Our official Reddit account is 
                <a 
                  href="https://www.reddit.com/user/FieldFriendsTeam/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="text-decoration-none font-weight-bold text-link d-inline-flex align-center"
                >
                  u/FieldFriendsTeam
                  <v-icon
                    icon="mdi-open-in-new"
                    size="x-small"
                    class="ms-1 pt-1"
                  />
                </a>
              </p>
            </div>
          </div>

          <div class="mt-8">
            <p class="text-body-1 text-secondary page-text">
              We will never contact you from any other email addresses.
              Additionally, because Field Friends operates in distinct monthly rounds,
              <strong>you will only receive automated emails during a round you have actively signed up for.</strong>
            </p>
            <p class="text-body-1 text-secondary page-text mt-4">
              We don't currently have any other social media accounts.
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar
      v-model="snackbar.isVisible"
      timeout="3000"
      location="top center"
      color="success"
    >
      {{ snackbar.message }}
      
      <template v-slot:actions>
        <v-divider
          class="mx-3 my-3 opacity-50"
          color="white"
          vertical
          :thickness="1"
        />

        <v-btn
          color="white"
          variant="text"
          @click="snackbar.isVisible = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const snackbar = ref({
  isVisible: false,
  message: ''
});

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText('support@fieldfriends.org');

    snackbar.value = {
      isVisible: true,
      message: 'Email address copied to clipboard'
    };
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};
</script>
