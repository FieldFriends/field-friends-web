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
          To participate in a given round, you must sign up for that specific round.
          Once the matching window closes, the process begins:
        </p>

        <ol class="pl-8 mb-0">
          <li class="text-body-1 text-secondary mb-4 page-text">
            <strong>Verification:</strong>
            You sign in using a one-time passcode sent to your
            <strong>@illinois.edu</strong> email address. This ensures that everyone is part of the UIUC community.
          </li>

          <li class="text-body-1 text-secondary mb-4 page-text">
            <strong>Survey:</strong>
            You fill out a brief survey detailing your social pace, hobbies, and how you'd like to spend time with your group.
            We ask for short explanations, because nuanced data leads to much better connections.
          </li>

          <li class="text-body-1 text-secondary mb-4 page-text">
            <strong>Security & Encryption:</strong>
            Upon submitting the survey, your identity is decoupled from your responses, and your data is secured using a post-quantum hybrid encryption strategy.
            It's stored in an encrypted state and can't be read by anyone while it sits in the database.
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
              After the deadline, your encrypted data is downloaded to an offline machine and decrypted only to process matches.
              We use natural language processing to understand the meaning behind your responses,
              grouping you with 2-3 other people who have similar interests.
            </p>
            <p class="mb-0">
              Our algorithm enforces strict rules to ensure safe and balanced gender representation within every group.
              Undergrads get granular control over which class years they're comfortable being matched with, while graduate students, staff, and faculty match within their own interconnected pools (though grad students and faculty can't be matched together).
              Additionally, you can select which age ranges you're comfortable being matched with.
            </p>
          </li>

          <li class="text-body-1 text-secondary mb-6 page-text">
            <strong>Delivery & Deletion:</strong>
            Once groups of 3-4 are formed, introduction emails will be sent out.
            When all emails have been confirmed as delivered, your profile, survey responses, and all local matching data are permanently deleted.
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
          To keep your data safe while it's online, we use a combination of classical and post-quantum encryption (AES-256 + RSA-4096 + ML-KEM-1024).
        </p>
        <p class="text-body-1 text-secondary page-text mb-4">
          When you submit the survey, classical and post-quantum secrets are generated and combined using HKDF-SHA512 to derive an AES-256 key. Your response is then encrypted with this unique key using AES-256-GCM.
        </p>
        <p class="text-body-1 text-secondary page-text mb-4">
          The server then saves the encrypted response and encrypted keys to the database.
        </p>
        <p class="text-body-1 text-secondary page-text mb-4">
          The private RSA and ML-KEM keys required to reconstruct the AES key and decrypt the data are stored only on our offline machine.
        </p>
        <p class="text-body-1 text-secondary page-text mb-4">
          Furthermore, to protect your identity, we use scrypt hashing to prevent dictionary attacks on emails, and HMAC-SHA512 to create response IDs that cannot be linked back to you.
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
            <v-icon
              icon="mdi-open-in-new"
              size="x-small"
              class="ms-1 pt-1"
            />
          </a>.
        </p>
      </section>

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>