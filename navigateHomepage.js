import { base_url } from "./config.js";
import { sleep, group } from "k6";
import http from "k6/http";
import { checkStatus } from "./utils.js";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

export function navigateHomepage() {
  group("Navigate to HomePage: https://shegrowsveg.com/", function () {
    // Make GET request to Home Page https://shegrowsveg.com/
    let response = http.get(`https://${base_url}/`, {
        headers: {
            'upgrade-insecure-requests': '1',
            'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
    });
    // Check request response code for is a 200 OK 
    // CheckStatus function has been imported from ".utils.js"
    checkStatus({
      response: response,
      expectedStatus: 200,
      failOnError: true,
      printOnError: true
    });
});
    sleep(randomIntBetween(pauseMin, pauseMax));
}