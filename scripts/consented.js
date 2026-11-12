// functionality that requires user consent (analytics, martech, etc.)
// Loaded by consent-check.js only after consent is granted.

const GTM_ID = 'GTM-W9QJBK3B';

/**
 * Loads Google Tag Manager. Epsilon tagging is expected to be fired from the GTM
 * container (the source site configures it per page, company 82914).
 */
function loadGtm() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.append(script);
}

loadGtm();
