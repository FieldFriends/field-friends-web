<template>
  <div class="bg-background text-primary d-flex flex-column min-vh-100">
    <v-container class="flex-grow-1 pt-12 pb-16">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h1 class="text-h4 text-md-h2 font-weight-bold mb-8 text-primary mt-md-8 text-center" id="faq-heading" tabindex="-1">
            Frequently Asked Questions
          </h1>

      <section aria-labelledby="faq-heading">
        <v-expansion-panels multiple class="mb-12">
          <v-expansion-panel
            v-for="(faq, index) in faqs"
            :key="index"
            :title="faq.question"
            class="bg-surface"
          >
            <template v-slot:text>
              <div v-html="faq.answerHtml" class="text-body-1 text-secondary page-text"></div>
            </template>
          </v-expansion-panel>
        </v-expansion-panels>
      </section>

      <div class="text-center mt-8">
        <p class="text-body-1 text-secondary">
          Still have questions? Visit our
          <router-link
            :to="AppRoutes.Contact.path"
            class="text-decoration-none font-weight-bold font-dm-sans text-link d-inline-flex align-center mb-12"
          >
            Contact page
          </router-link>
          to reach out to us.
        </p>
      </div>

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
:deep(.v-expansion-panel-title) {
  font-weight: 600;
  font-size: 1.1rem;
  color: rgb(var(--v-theme-primary));
}
</style>

<script lang="ts" setup>
import { AppRoutes } from '@/router/routeConfig';
import { AGE_LIMITS } from '@shared/friendConfig';

const faqs = [
  {
    question: "Who can use Field Friends?",
    answerHtml: `Anyone in the UIUC community with a valid <strong>@illinois.edu</strong> email address, including undergraduates, graduate students, staff, faculty, and alumni. Field Friends is currently limited to ages ${AGE_LIMITS.min}&ndash;${AGE_LIMITS.max}.`
  },
  {
    question: "How does the matching algorithm work?",
    answerHtml: "We use natural language processing to understand your survey responses and group you with 2-3 other people who share similar interests and social preferences. Undergraduates get to choose which class years they're comfortable being matched with, while graduate students, staff, faculty, and alumni match within interconnected pools. You can also choose which age ranges you're comfortable being matched with. For more details, check out the <a href='/about#process-heading' class='text-link font-weight-bold text-decoration-none'>How it Works</a> section on our <a href='/about' class='text-link font-weight-bold text-decoration-none'>About page</a>."
  },
  {
    question: "How is my data handled?",
    answerHtml: "Your data is encrypted with post-quantum encryption after submission. Your profile and survey responses are deleted after matches have been sent out. You can read more about our <a href='/about#security-heading' class='text-link font-weight-bold text-decoration-none'>Security Architecture</a> on the <a href='/about' class='text-link font-weight-bold text-decoration-none'>About page</a>, or review our full <a href='/legal#privacy-heading' class='text-link font-weight-bold text-decoration-none'>Privacy Policy</a>."
  },
  {
    question: "How will I be contacted?",
    answerHtml: "Once a round closes and matches have been formed, you'll receive an email from <strong>noreply@fieldfriends.org</strong> introducing you to your group."
  },
  {
    question: "What if I don't want to get matched with someone?",
    answerHtml: "If there's someone you'd rather not be matched with, just add their email to the \"blocked email\" section on the survey. Our algorithm ensures you aren't grouped together, and they won't be notified."
  },
  {
    question: "I didn't get matched this round. Why?",
    answerHtml: "The algorithm can't always find matches for everyone, mainly due to compatibility issues or smaller matching pools. However, you're always welcome to sign up again for the next round!"
  }
];
</script>