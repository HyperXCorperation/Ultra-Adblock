// content.js

console.log("Ultra Adblock content script loaded.");

// Example of cosmetic filtering (you might need more specific selectors)
function applyCosmeticFilters() {
  const adPlaceholders = document.querySelectorAll('.ad-placeholder, .banner-ad');
  adPlaceholders.forEach(placeholder => {
    placeholder.style.display = 'none';
  });

  // Look for specific iframe elements that might contain ads
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    try {
      // Try to access the contentWindow to check its location or contents
      if (iframe.contentWindow && iframe.contentWindow.location && /ads|banner/.test(iframe.contentWindow.location.href)) {
        iframe.style.display = 'none';
      } else if (iframe.src && /ads|banner/.test(iframe.src)) {
        iframe.style.display = 'none';
      }
    } catch (error) {
      // Catch any cross-origin errors (we might not be able to access the content)
      console.warn("Could not access iframe content:", error);
      // Optionally, you could still try to hide based on the src attribute
    }
  });

  // You can add more sophisticated logic here to target specific ad elements
  // based on IDs, classes, or other attributes.
}

// Apply cosmetic filters after the DOM is loaded
window.addEventListener('load', applyCosmeticFilters);

// Optionally, you could run filters periodically in case of dynamically loaded content
// For example:
// setInterval(applyCosmeticFilters, 2000);