<template>
  <div class="faq-page bg-background text-primary d-flex flex-column">
    <v-container class="flex-grow-1 pt-12 pb-16 faq-page__content">
      <h1 class="text-h2 font-weight-bold mb-8 text-primary mt-md-8 text-center" id="faq-heading" tabindex="-1">
        Frequently Asked Questions
      </h1>

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

      <div class="text-center mt-8">
        <p class="text-body-1 text-secondary">
          Still have questions? Reach out to us at 
          <a href="mailto:fieldfriends.team@gmail.com" class="text-primary font-weight-bold text-decoration-none">fieldfriends.team@gmail.com</a>.
        </p>
      </div>

    </v-container>
  </div>
</template>

<script lang="ts" setup>
const faqs = [
  {
    question: "Who can use Field Friends?",
    answerHtml: "Anyone in the UIUC community with a valid <strong>@illinois.edu</strong> email address, including undergraduates, graduate students, and university staff/professionals. This is currently limited to ages 18&ndash;29 and is not intended for faculty."
  },
  {
    question: "How does the matching algorithm work?",
    answerHtml: "We use natural language processing to understand your survey answers and group you with 2-3 other people who share similar interests and social preferences. We also group by university status (undergrad/grad) to ensure balanced connections. For step-by-step details, check out the <a href='/about#process-heading' class='text-link font-weight-bold text-decoration-none'>How it Works</a> section on our <a href='/about' class='text-link font-weight-bold text-decoration-none'>About page</a>."
  },
  {
    question: "How is my data handled?",
    answerHtml: "Your data is secured using end-to-end encryption the moment you submit your survey, and it is permanently deleted immediately after matches are sent out. You can read more about our <a href='/about#security-heading' class='text-link font-weight-bold text-decoration-none'>Security Architecture</a> on the <a href='/about' class='text-link font-weight-bold text-decoration-none'>About page</a>, or review our full <a href='/legal#privacy-heading' class='text-link font-weight-bold text-decoration-none'>Privacy Policy</a>."
  },
  {
    question: "How will I be contacted?",
    answerHtml: "Once a monthly round closes and matches are finalized, you will receive an automated introduction email from <strong>noreply@fieldfriends.org</strong> connecting you with your group."
  },
  {
    question: "What if I don't want to get matched with someone?",
    answerHtml: "If there's someone you'd rather not be matched with, just add their email to the \"blocked email\" section on the survey. Our algorithm ensures you aren't grouped together, and they will not be notified."
  },
  {
    question: "I didn't get matched this round. Why?",
    answerHtml: "Sometimes the matching algorithm leaves a few people out to avoid awkwardly sized groups or forced matches without genuine overlapping interests. You're always welcome to try again by signing up for the next monthly round!"
  }
];
</script>

<style scoped lang="scss">
.faq-page {
  min-height: 100vh;
  
  &__content {
    max-width: 800px;
    margin: 0 auto;
  }

  :deep(.v-expansion-panel-title) {
    font-weight: 600;
    font-size: 1.1rem;
    color: rgb(var(--v-theme-primary));
  }

  .page-text {
    line-height: 1.6;
  }

  :deep(code) {
    background-color: rgba(var(--v-theme-surface-variant), 0.3);
    padding: 0.1em 0.3em;
    border-radius: 4px;
    font-family: monospace;
    color: rgb(var(--v-theme-primary));
  }
}
</style>