# FieldFriends Frontend Style Guide

This guide outlines the core conventions and coding standards for the FieldFriends.

## 0. Overview & Project Structure

**Goal**: To provide a seamless and intuitive UI for UIUC folks to sign up for Field Friends and manage their data.

**Core Components**:
- **`src/pages/`**: Page-level components. These should handle routing logic, orchestrate global state (Pinia), and compose generic UI components.
- **`src/components/`**: Reusable, generic, and isolated UI components. Often prefixed with `Friend...` (e.g., `FriendFormCard`, `FriendTextField`). They should primarily rely on props and emits rather than tightly coupling to global state.
- **`src/composables/`**: Reusable composition functions (e.g., `useFormIO`, `useZodRules`). All shared reactive logic should be extracted here.
- **`src/stores/`**: Pinia stores for global application state (e.g., authentication, survey progress).
- **`shared/`**: The bridge between the frontend and server functions. Contains shared configurations (`friendConfig.ts`) and validation schemas (Zod).

## 1. Vue 3 & Component Architecture

* **Vue 3 Composition API Only:** All Vue components must use `<script setup lang="ts">`. The Options API is strictly prohibited.
* **Modern Vue Macros:** Always use the most modern Vue conventions and macros. This includes using `defineModel()` for v-model bindings and the latest `defineEmits()` syntax.
* **Component File Structure:** Single File Components (SFCs) must follow the exact order of:
  1. `<template>`
  2. `<style>`
  3. `<script setup>`
* **State Management (Pinia vs Local):** Use Pinia (`src/stores/`) strictly for global application state that needs to be shared across multiple independent views or stored persistently (e.g., auth, survey results). Use local component state (`ref`, `reactive`) for UI-specific, ephemeral state.

## 2. Styling & UI Guardrails

* **BEM Methodology:** We always use BEM (Block Element Modifier) for writing custom CSS class names (e.g., `.friend-form-card`, `.friend-form-card__description`, `.friend-form-card--active`).
* **Prefer Vuetify Built-ins:** Always prefer utilizing Vuetify's built-in utility classes (e.g., `d-flex`, `mt-4`, `text-primary`) and component props over writing custom CSS. Only write custom CSS when the design system explicitly requires a layout or style Vuetify cannot natively provide.
* **Accessibility (a11y) is Mandatory:** All UI components must be a11y-compliant. Use proper semantic HTML, ensure full keyboard navigability (focus states, `tabindex`), and provide appropriate `aria-` labels for custom interactive elements. 

## 3. Architecture & Data Flow

* **Constants & Schemas:** Avoid magic values. Shared configuration and validation logic must reside in `shared/` using Zod schemas to guarantee a single source of truth.
* **Centralized Error Handling:** API calls within Pinia stores must use try/catch blocks and centralized error handling helpers (e.g., `handleStoreError`).

## 4. Code Structure & Complexity

* **Low Cognitive Complexity:** Favor small, modular composables and single-responsibility components. Extract complex business logic out of `.vue` files and into `src/composables/` or `src/utils/`.
* **Early Returns:** Heavily prefer guard clauses over deeply nested `if/else` structures in functions (e.g., `if (!valid) { return; }`).
* **Strict Control Flow Blocks:** Inline control flow is strictly forbidden. Even single-action `if` statements must use a newline and an indented block.

## 5. Typing & Naming

* **Strict TypeScript:** Every function signature, component prop, and emit must be fully typed. The use of `any` is strictly prohibited unless interacting with loosely-typed third-party libraries.
* **Component Props & Emits:** Use `defineProps<Props>()` with a locally defined `Props` type, and `defineEmits` for strict type checking on component boundaries.
* **Semantic Naming:** Variables must be descriptive nouns; functions and composables must be verbs (e.g., `useFriendColors`, `submitForm`).

## 6. Documentation & Comments

* **JSDoc-style:** Every major composable, utility function, and store action requires a JSDoc-style docstring detailing arguments and return types.
* **Inline Comments:** Must explain *why* a decision was made, rather than just *what* code does. Should use a semantic prefix like `// FriendDev:`, be concise, written as fragment sentences without articles (like "a" or "the"), and always end with punctuation.
  * *Bad Example:* `// FriendDev: Check if form is valid.` (explains *what*)
  * *Good Example:* `// FriendDev: Force re-validation so cross-field errors show instantly.` (explains *why*)

## 7. Tooling Enforcement

This project uses **ESLint** (with `eslint-config-vuetify`), **Prettier**, and **TypeScript** (`vue-tsc`) to actively enforce formatting and typing rules.

* ESLint enforces stylistic rules (e.g., strict semicolon usage via `@stylistic/semi`, and `vue/script-indent`).
* `vue-tsc` guarantees type correctness across both `.ts` and `.vue` files.
* You should run `npm run type-check` before committing code.
