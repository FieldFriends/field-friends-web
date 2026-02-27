<template>
  <div class="about-page bg-background text-primary d-flex flex-column">
    <v-container class="flex-grow-1 pt-12 pb-16 about-page__content">
      <h1 class="text-h2 font-weight-bold mb-8 text-primary mt-md-8 text-center" id="about-heading" tabindex="-1">
        About Us
      </h1>

      <section class="mb-12" aria-labelledby="mission-heading">
        <h2 id="mission-heading" class="text-h4 font-weight-bold mb-4 text-primary">
          Our Mission
        </h2>
        <p class="text-body-1 text-secondary mb-4 page-text">
          <strong class="text-primary font-italic font-eb-garamond">
            To help people in the university community make friends by matching people into small groups based on shared interests.
          </strong>
        </p>
      </section>

      <v-divider class="mb-12 border-opacity-25" color="secondary" aria-hidden="true" />

      <section class="mb-12" aria-labelledby="story-heading">
        <h2 id="story-heading" class="text-h4 font-weight-bold mb-4 text-primary">
          The Story
        </h2>
        <p class="text-body-1 text-secondary mb-4 page-text">
          Finding genuine friends on a massive campus can be challenging.
          Often, we meet people based purely on proximity—who we sit next to in class or work, or who lives in our building.
          These connections are valuable, but they often lack shared interests and are becoming increasingly difficult to come by.
        </p>
        <p class="text-body-1 text-secondary mb-4 page-text">
          Field Friends was created to help combat loneliness and foster connections that are rooted in mutual interests.
          By moving beyond who you encounter in your day-to-day, we aim to help you find genuine connections.
        </p>
      </section>

      <v-divider class="mb-12 border-opacity-25" color="secondary" aria-hidden="true" />

      <section class="mb-12" aria-labelledby="process-heading">
        <h2 id="process-heading" class="text-h4 font-weight-bold mb-4 text-primary">
          How it Works
        </h2>
        <p class="text-body-1 text-secondary mb-4">
          Field Friends runs in monthly rounds.
          To participate:
        </p>
        <p class="text-body-1 text-secondary mb-4 page-text">
          1. <strong>Sign Up:</strong>
          You fill out a short survey detailing your hobbies, interests, and social preferences.
        </p>
        <p class="text-body-1 text-secondary mb-4 page-text">
          2. <strong>The Algorithm:</strong>
          Once the matching window closes, 

          Once a month, our system uses natural language processing (NLP) to analyze the semantic meaning of your responses.
          It finds 2-3 other people whose interests align with yours while balancing social energy.
        </p>
        <p class="text-body-1 text-secondary mb-4 page-text">
          3. <strong>The Group Reveal:</strong>
          You'll receive an email introducing you to your new small group. From there, it's up to you to plan a meetup!
        </p>
      </section>

      <v-divider class="mb-12 border-opacity-25" color="secondary" aria-hidden="true" />

      <section class="mb-8" aria-labelledby="disclaimer-heading">
        <h2 id="disclaimer-heading" class="text-h4 font-weight-bold mb-4 text-primary">
          Not Affiliated
        </h2>
        <p class="text-body-1 text-secondary page-text">
          Field Friends is an independent project run by private individuals. We are <strong class="text-primary">not</strong>
          affiliated with, endorsed by, or sponsored by the University of Illinois Urbana-Champaign (UIUC) or any of its departments.
        </p>
      </section>

    </v-container>
  </div>
</template>

<style scoped lang="scss">
.about-page {
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