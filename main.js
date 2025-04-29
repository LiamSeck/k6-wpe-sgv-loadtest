import { navigateToHomepage } from "./navigateToHomepage.js";

export const options = {
    cloud: {
      // Project: She Grows Veg
      projectID: 3750602,
      // Test runs with the same name groups test runs together.
      name: 'Load Testing of https://shegrowsvegstg.wpenginepowered.com/',
      // Adding Load Zone so that traffic routes from amazon:gb:london over the default location
      distribution: {
        AWSLondon: { loadZone: 'amazon:gb:london', percent: 100 },
      },
      // Adding thresholds for error rates and request duration  
    thresholds: { 
      checks: [{threshold: 'rate>0.95', abortOnFail: true, delayAbortEval: '60s'}],// the rate of successful checks should be higher than 95%, test should fail and abort if check fail rate is lower than 95%
      //http_req_failed: [{ threshold: 'rate<=0.01', abortOnFail: true, delayAbortEval: '60s'}], // http errors should be less than 1%, test should fail and abort if error rate is higher that 1%
      //http_req_duration: [{ threshold: 'p(95)<200', abortOnFail: true, delayAbortEval: '60s'}], // 95% of requests should be below 200ms 
      },
    },
    scenarios: {
        main: {
          executor: 'ramping-vus',
          startVUs: 0,
          stages: [
            { target: 2500, duration: '1m' }, // ramp-up to 2500 VUs
            { target: 2500, duration: '30s' }, // hold at 2500 VUs
            { target: 5000, duration: '15s' }, // ramp-up to 5000 VUs
            { target: 5000, duration: '30s' }, // hold at 5000 VUs
            { target: 7500, duration: '15s' }, // ramp-up to 7500 VUs
            { target: 7500, duration: '30s' }, // hold at 7500 VUs
            { target: 10000, duration: '15s' }, // ramp-up to 10000 VUs
            { target: 10000, duration: '30s' }, // hold at 10000 VUs
          ],
          gracefulRampDown: '30s',
          exec: 'main',
        },
    },
  };
  
  // used to store global variables
  globalThis.vars = [];
  
  // global min/max sleep durations (in seconds):
  globalThis.pauseMin = 0.5;
  globalThis.pauseMax = 2;
  
  
  
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