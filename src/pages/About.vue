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

      <section class="mb-12" aria-labelledby="story-heading">
        <h2 id="story-heading" class="text-h4 font-weight-bold mb-4 text-primary">
          Origin
        </h2>
        <p class="text-body-1 text-secondary mb-4 page-text">
          Finding good friends on a campus as big as UIUC's can be tough.
          We often meet people by proximity, but these connections tend to lack shared interests and can be hard to come by.
        </p>
        <p class="text-body-1 text-secondary mb-4 page-text">
          Field Friends was created to help the UIUC community find friends based on interests, rather than just proximity.
        </p>
      </section>

      <v-divider class="mb-12 border-opacity-25" color="secondary" aria-hidden="true" />

      <section class="mb-12" aria-labelledby="process-heading">
        <h2 id="process-heading" class="text-h4 font-weight-bold mb-4 text-primary">
          How it Works
        </h2>

        <p class="text-body-1 text-secondary mb-4 page-text">
          Field Friends runs in  <strong>monthly rounds</strong>.
          To participate in a given month, you must sign up for that specific round.
          Once the matching window closes, the process begins:
        </p>

        <div class="pl-4">
          <p class="text-body-1 text-secondary mb-4 page-text">
            <strong>1. Verification:</strong>
            You sign in using a one-time passcode sent to your
            <strong>@illinois.edu</strong> email address. This ensures that everyone is part of the UIUC community.
          </p>

          <p class="text-body-1 text-secondary mb-4 page-text">
            <strong>2. Survey:</strong>
            You fill out a brief survey detailing your social pace, hobbies, and how you'd like to spend time with your group.
            We ask for short explanations, because nuanced data leads to much better connections.
          </p>

          <p class="text-body-1 text-secondary mb-4 page-text">
            <strong>3. Security & Encryption:</strong>
            When you hit "Submit", your data is secured using strong, end-to-end encryption.
            It is stored safely in an encrypted state and cannot be read by anyone (including us) while it sits in the database.
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
          </p>

          <div class="text-body-1 text-secondary page-text">
            <p>
              <strong>4. The Matching Process:</strong>
              After the deadline, your encrypted data is downloaded to an offline, local machine and decrypted solely to process matches.
              We use natural language processing to understand the meaning behind your survey answers,
              grouping you with 2-3 other people who have genuine alignment in interests.
            </p>
            <p class="mb-4">
              Our algorithm enforces strict rules to ensure safe and balanced gender representation within every group.
              You also won't be matched with people outside of your university status (underclassman, upperclassman, or graduate/staff).
            </p>
          </div>

          <p class="text-body-1 text-secondary mb-6 page-text">
            <strong>5. Delivery & Deletion:</strong>
            Once groups of 3-4 are formed, introduction emails will be sent out over a short period of time.
            When all emails have been confirmed as delivered, your profile, survey responses, and all local matching data are securely deleted.
            From there, it's up to you to reach out to your group!
          </p>
        </div>
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
          To mitigate the risk of a cloud environment compromise, we use an <strong>Application-Level Hybrid Envelope Encryption</strong> strategy (AES-256 + RSA-4096).
        </p>
        <p class="text-body-1 text-secondary page-text mb-4">
          When you submit your survey, the server generates a unique, ephemeral AES-256 key for your specific request.
          Your data fields are encrypted with this AES key using AES-256-GCM.
          Then, that AES key itself is encrypted using our public RSA-4096 key.
          Only the encrypted data and the encrypted session key are ever committed to the database.
        </p>
        <p class="text-body-1 text-secondary page-text mb-4">
          The private RSA key required to decrypt the data is stored strictly on our local offline machine.
          It never touches the cloud.
        </p>
        <p class="text-body-1 text-secondary page-text">
          For full transparency, our backend encryption logic is
          <a
            href="https://github.com/FieldFriends/field-friends-web/tree/main/api"
            target="_blank"
            rel="noopener noreferrer"
            class="text-decoration-none font-weight-bold text-link d-inline-flex align-center"
          >
            available on GitHub
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