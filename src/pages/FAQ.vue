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
    answerHtml: "Undergraduates, Graduate Students, and Professionals in the UIUC community with a valid <strong>@illinois.edu</strong> email address."
  },
  {
    question: "How does the matching algorithm work?",
    answerHtml: "We use natural language processing (NLP) to understand the meaning of your interests, activities, and intro to find people with similar vibes. We also group by undergrad/grad status and balance \"social energy\" so everyone feels comfortable."
  },
  {
    question: "Is my data safe?",
    answerHtml: "Yes. All your information is encrypted before it's saved. Once matches are sent out for a round, that round's data is permanently deleted. You can read the specific details of our local encryption and data handling in our <a href='/legal#privacy-heading' class='text-primary font-weight-bold text-decoration-none'>Privacy Policy</a>."
  },
  {
    question: "How will I be contacted?",
    answerHtml: "You will receive an automated email from <strong>TODO: final_email_here</strong> when you've been placed in a group. We don't spam."
  },
  {
    question: "Can I block certain people?",
    answerHtml: "Yep! If there's someone you'd rather not be matched with, just drop their email in the form. We'll make sure you don't cross paths, and they won't be notified."
  },
  {
    question: "I didn't get matched this round. Why?",
    answerHtml: "Sometimes the math leaves a few people out to avoid awkwardly sized groups or bad matches. If you want to try again, you'll need to submit the form again for the next round."
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