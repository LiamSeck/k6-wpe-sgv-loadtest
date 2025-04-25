import { navigateToHomepage } from "./navigateToHomepage.js";

export const options = {
    cloud: {
      // Project: She Grows Veg
      projectID: 3750602,
      // Test runs with the same name groups test runs together.
      name: 'Load Testing of SheGrowsVeg Staging: https://shegrowsvegstg.wpenginepowered.com/',
      // Adding Load Zone so that traffic routes from amazon:gb:london over the default location
      distribution: {
        AWSLondon: { loadZone: 'amazon:gb:london', percent: 100 },
      },
      // Adding thresholds for error rates and request duration  
      thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
     // http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
      }
      
    },
    scenarios: {
        main: {
          executor: 'ramping-vus',
          startVUs: 0,
          stages: [
            { target: 5, duration: '30s' },
            { target: 5, duration: '1m' },
            { target: 10, duration: '30s' },
            { target: 10, duration: '1m' },
            { target: 15, duration: '30s' },
            { target: 15, duration: '1m' },
            { target: 20, duration: '30s' },
            { target: 20, duration: '1m' },
          ],
          gracefulRampDown: '30s',
          exec: 'main',
        }
    }
  };
  
  // used to store global variables
  globalThis.vars = [];
  
  // global min/max sleep durations (in seconds):
  globalThis.pauseMin = 1;
  globalThis.pauseMax = 3;
  
  
  
  export function main() {
    // Executes requests defined in navigateHomepage()
    navigateToHomepage();
    // Executes requests defined in addToCart()
    // addToCart();
    // // Executes requests defined in navigateToCart()
    // navigateToCart();
    // // Executes requests defined in
    // navigateToCheckout();
    // // Executes requests defined in navigateToCheckout()
    // updateAddress();
    // // Executes requests defined in submitCheckout()
    // submitCheckout();
  }