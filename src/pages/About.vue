<template>
  <div class="bg-background text-primary d-flex flex-column min-vh-100">
    <v-container class="flex-grow-1 pt-12 pb-16">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h1 class="text-h4 text-md-h2 font-weight-bold mb-8 text-primary mt-md-8 text-center" id="about-heading" tabindex="-1">
            About Us
          </h1>

          <section class="mb-12" aria-labelledby="mission-heading">
            <h2 id="mission-heading" class="text-h4 font-weight-bold mb-4 text-primary">
              Our Goal
            </h2>
            <p class="text-body-1 text-secondary mb-4 page-text">
              <strong class="text-primary font-italic font-eb-garamond">
                To help people in the university community make friends by matching people into small groups based on shared interests.
              </strong>
            </p>
          </section>

          <v-divider class="mb-12 border-opacity-25" color="secondary" aria-hidden="true" />

          <section class="mb-12" aria-labelledby="process-heading">
            <h2 id="process-heading" class="text-h4 font-weight-bold mb-4 text-primary">
              How it Works
            </h2>

            <p class="text-body-1 text-secondary mb-4 page-text">
              Field Friends runs in  <strong>rounds every two weeks</strong>.
              Rounds work as follows:
            </p>

            <ol class="pl-8 mb-0">
              <li class="text-body-1 text-secondary mb-4 page-text">
                <strong>Verification:</strong>
                You sign in using a one-time passcode sent to your
                <strong>@illinois.edu</strong> email address.
              </li>

              <li class="text-body-1 text-secondary mb-4 page-text">
                <strong>Survey:</strong>
                You fill out a short survey about your hobbies and how you'd like to spend time with your group.
              </li>

              <li class="text-body-1 text-secondary mb-4 page-text">
                <strong>Security & Encryption:</strong>
                Once you submit the survey, your identity is decoupled from your responses, and your data is encrypted.
                <a
                  href="#security-heading"
                  class="text-decoration-none font-weight-bold text-link d-inline-flex align-center"
                >
                  Read technical details
                  <v-icon
                    icon="mdi-arrow-down"
                    size="x-small"
                    class="ms-1 pt-1"
                  />
                </a>
              </li>

              <li class="text-body-1 text-secondary mb-4 page-text">
                <p class="mb-2">
                  <strong>The Matching Process:</strong>
                  After the deadline, all responses are downloaded to an offline machine and decrypted to process matches.
                  We use natural language processing to analyze your responses and find 2-3 people with similar interests.
                </p>
                <p class="mb-0">
                  Our algorithm enforces rules to ensure safe and balanced gender representation within every group.
                  Undergrads get granular control over which class years they're comfortable being matched with, while graduate students, staff, faculty, and alums match within their own interconnected pools (though grad students and faculty can't be matched together).
                  Additionally, you can select which age ranges you're comfortable being matched with.
                </p>
              </li>

              <li class="text-body-1 text-secondary mb-6 page-text">
                <strong>Delivery & Deletion:</strong>
                Once groups of 3-4 are formed, introduction emails will be sent out.
                When all emails have been delivered, your profile, survey responses, and all local matching data are permanently deleted.
                From there, it's up to you to reach out to your group!
              </li>
            </ol>
          </section>

          <v-divider class="mb-12 border-opacity-25" color="secondary" aria-hidden="true" />

          <section class="mb-8" aria-labelledby="disclaimer-heading">
            <h2 id="disclaimer-heading" class="text-h4 font-weight-bold mb-4 text-primary">
              Independent
            </h2>
            <p class="text-body-1 text-secondary page-text">
              Field Friends is an independent project. We are
              <strong class="text-primary">
                not affiliated
              </strong>
              with, endorsed by, or sponsored by the University of Illinois at Urbana-Champaign (UIUC).
            </p>
          </section>

          <v-divider class="mb-12 border-opacity-25" color="secondary" aria-hidden="true" />

          <section class="mb-8" aria-labelledby="security-heading">
            <h2 id="security-heading" class="text-h4 font-weight-bold mb-4 text-primary">
              Security Architecture
            </h2>
            <p class="text-body-1 text-secondary page-text mb-4">
              To keep your data safe, we use a hybrid of standard and post-quantum encryption. When you submit the survey, your response is encrypted with a unique, one-time key. We save that encrypted response to the database, and the only keys that can decrypt it are stored on an offline machine.
            </p>
            <p class="text-body-1 text-secondary page-text mb-4">
              Furthermore, we hash your email and response IDs to protect your identity, so your answers can't be linked back to you.
            </p>
            <p class="text-body-1 text-secondary page-text">
              Feel free to read the source code for our security architecture
              <a
                href="https://github.com/FieldFriends/field-friends-web/tree/main/api"
                target="_blank"
                rel="noopener noreferrer"
                class="text-decoration-none font-weight-bold text-link d-inline-flex align-center"
              >
                on GitHub
                <v-icon icon="mdi-open-in-new" size="x-small" class="ms-1 pt-1" />
              </a>.
            </p>
          </section>

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>