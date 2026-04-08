/// <reference types="@types/cloudflare-turnstile" />

declare global {
  var turnstile: Turnstile.Turnstile;
  var onTurnstileLoad: () => void;

  interface Window {
    turnstile: Turnstile.Turnstile;
    onTurnstileLoad: () => void;
  }
}

export { };