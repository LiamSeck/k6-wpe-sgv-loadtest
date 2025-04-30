import { sleep, group } from 'k6'
import http from 'k6/http'
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import { checkStatus } from "./utils.js";


export const options = {
  cloud: {
    // Project: She Grows Veg
    projectID: 3750602,
    // Test runs with the same name groups test runs together.
    name: 'Load Testing of https://shegrowsvegstg.wpenginepowered.com/',
    // Adding Load Zone so that traffic routes from amazon:gb:london over the default location
    distribution: { 'amazon:gb:london': { loadZone: 'amazon:gb:london', percent: 100 } },
    apm: [],
  },
  thresholds: { http_req_failed: [{ threshold: 'rate<=0.10', abortOnFail: true, delayAbortEval: '60s'}] },
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      startVUs: 0,
      gracefulStop: '30s',
      stages: [
        { target: 1, duration: '10s' },
        { target: 1, duration: '1m' },
      ],
      gracefulRampDown: '30s',
      exec: 'scenario_1',
    },
  },
};

  // global min/max sleep durations (in seconds):
  globalThis.pauseMin = 2;
  globalThis.pauseMax = 10;

export function scenario_1() {
  let response

  const vars = {}

  group('page_1 - https://staging.shegrowsveg.com/', function () {
    response = http.get('https://staging.shegrowsveg.com/', {
      headers: {
        'upgrade-insecure-requests': '1',
        'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
      },
    })

    checkStatus({
        response: response,
        expectedStatus: 200,
        failOnError: true,
        printOnError: true
      }); 

    vars['gform_source_page_number_1'] = response
      .html()
      .find('input[name=gform_source_page_number_1]')
      .first()
      .attr('value')

    sleep(randomIntBetween(pauseMin, pauseMax));
   

    response = http.get('https://staging.shegrowsveg.com/product-category/seeds/', {
      headers: {
        'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
      },
    })
  }
)
checkStatus({
    response: response,
    expectedStatus: 200,
    failOnError: true,
    printOnError: true
  });


  group('page_2 - https://staging.shegrowsveg.com/product-category/seeds/', function () {
    response = http.get('https://staging.shegrowsveg.com/product-category/seeds/', {
      headers: {
        'upgrade-insecure-requests': '1',
        'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
      },
    })

    vars['gform_field_values1'] = response
      .html()
      .find('input[name=gform_field_values]')
      .first()
      .attr('value')
      
    checkStatus({
        response: response,
        expectedStatus: 200,
        failOnError: true,
        printOnError: true
      });
    sleep(randomIntBetween(pauseMin, pauseMax));


    response = http.post(
      'https://staging.shegrowsveg.com/wp-admin/admin-ajax.php',
      {
        action: 'custom_ajax_add_to_cart',
        product_id: '26987',
        quantity: `${vars['gform_source_page_number_1']}`,
        nonce: '0917702452',
        variation_data:
          'gtm4wp_product_data=%7B%22internal_id%22%3A26987%2C%22item_id%22%3A26987%2C%22item_name%22%3A%22Mangelwurzel%20Mammoth%20Red%22%2C%22sku%22%3A%22SEED-239%22%2C%22price%22%3A4.5%2C%22stocklevel%22%3A176%2C%22stockstatus%22%3A%22instock%22%2C%22google_business_vertical%22%3A%22retail%22%2C%22item_category%22%3A%22Beetroot%20Seeds%22%2C%22id%22%3A26987%7D',
      },
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-requested-with': 'XMLHttpRequest',
          'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      }
    )
    checkStatus({
        response: response,
        expectedStatus: 200,
        failOnError: true,
        printOnError: true
      });
    sleep(randomIntBetween(pauseMin, pauseMax));


    response = http.get(
      'https://staging.shegrowsveg.com/wp-admin/admin-ajax.php?action=get_cart_count',
      {
        headers: {
          accept: '*/*',
          'x-requested-with': 'XMLHttpRequest',
          'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      }
    )
    checkStatus({
        response: response,
        expectedStatus: 200,
        failOnError: true,
        printOnError: true
      });
    sleep(randomIntBetween(pauseMin, pauseMax));
  })

  group('page_3 - https://staging.shegrowsveg.com/checkout/', function () {
    response = http.get('https://staging.shegrowsveg.com/checkout/', {
      headers: {
        'upgrade-insecure-requests': '1',
        'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
      },
    })

    vars['is_gift_card1'] = response.html().find('input[name=is_gift_card]').first().attr('value')

    vars['woocommerce-process-checkout-nonce1'] = response
      .html()
      .find('input[name=woocommerce-process-checkout-nonce]')
      .first()
      .attr('value')

    vars['shipping_method[0]1'] = response
      .html()
      .find('input[name=shipping_method[0]]')
      .first()
      .attr('value')

    checkStatus({
        response: response,
        expectedStatus: 200,
        failOnError: true,
        printOnError: true
      });
    sleep(randomIntBetween(pauseMin, pauseMax));

    response = http.post(
      'https://staging.shegrowsveg.com/wp-admin/admin-ajax.php',
      {
        action: 'flux_check_for_inline_error',
        'args[label]': 'Email address',
        'args[required]': 'false',
        'args[type]': 'email',
        country: 'GB',
        key: 'billing_email',
        value: 'bitbucket@wpengine.com',
      },
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      }
    )
    checkStatus({
        response: response,
        expectedStatus: 200,
        failOnError: true,
        printOnError: true
      });

    response = http.post(
      'https://staging.shegrowsveg.com/?wc-ajax=update_order_review',
      {
        security: '75346b0a7f',
        payment_method: 'cod',
        country: 'GB',
        state: `${vars['gform_field_values1']}`,
        postcode: 'E17 6FE',
        city: 'London',
        address: 'Test',
        address_2: `${vars['gform_field_values1']}`,
        s_country: 'GB',
        s_state: `${vars['gform_field_values1']}`,
        s_postcode: 'E17 6FE',
        s_city: 'London',
        s_address: 'Test',
        s_address_2: `${vars['gform_field_values1']}`,
        has_full_address: 'true',
        post_data:
          'billing_email=bitbucket%40wpengine.com&billing_first_name=Test&billing_last_name=Test&billing_phone=&billing_country=GB&billing_address_1=Test&billing_address_2=&billing_city=London&billing_state=&billing_postcode=E17%206FE&wc_order_attribution_source_type=organic&wc_order_attribution_referrer=https%3A%2F%2Fwww.google.com%2F&wc_order_attribution_utm_campaign=(none)&wc_order_attribution_utm_source=google&wc_order_attribution_utm_medium=organic&wc_order_attribution_utm_content=(none)&wc_order_attribution_utm_id=(none)&wc_order_attribution_utm_term=(none)&wc_order_attribution_utm_source_platform=(none)&wc_order_attribution_utm_creative_format=(none)&wc_order_attribution_utm_marketing_tactic=(none)&wc_order_attribution_session_entry=https%3A%2F%2Fshegrowsveg.com%2Fchelsea-flower-show-2025%2F%3Fsrsltid%3DAfmBOoqxbQB94fsdOfyBRPXBhrlQi1rX5gBr89fXepLNwY1r9JGNiCAd&wc_order_attribution_session_start_time=2025-04-28%2013%3A10%3A00&wc_order_attribution_session_pages=5&wc_order_attribution_session_count=9&wc_order_attribution_user_agent=Mozilla%2F5.0%20(Macintosh%3B%20Intel%20Mac%20OS%20X%2010_15_7)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F135.0.0.0%20Safari%2F537.36&shipping_country=GB&shipping_first_name=Test&shipping_last_name=Test&shipping_company=&shipping_address_1=Test&shipping_address_2=&shipping_city=London&shipping_state=&shipping_postcode=E17%206FE&order_comments=&payment_method=cod&woocommerce-process-checkout-nonce=84666ac004&_wp_http_referer=%2Fcheckout%2F&shipping_method%5B0%5D=flexible_shipping_single%3A2&cart%5B552f5e345c9d523300ea73c6a65b0a6e%5D%5Bqty%5D=1&coupon_code=',
        'shipping_method[0]': 'flexible_shipping_single:2',
      },
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-requested-with': 'XMLHttpRequest',
          'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      }
    )
    checkStatus({
        response: response,
        expectedStatus: 200,
        failOnError: true,
        printOnError: true
      });
    sleep(randomIntBetween(pauseMin, pauseMax));

    response = http.post(
      'https://staging.shegrowsveg.com/wp-admin/admin-ajax.php',
      {
        action: 'flux_check_for_inline_errors',
        'fields[billing_email][args][label]': 'Email address',
        'fields[billing_email][args][required]': 'false',
        'fields[billing_email][args][type]': 'email',
        'fields[billing_email][country]': 'GB',
        'fields[billing_email][key]': 'billing_email',
        'fields[billing_email][value]': 'bitbucket@wpengine.com',
        'fields[billing_first_name][args][label]': 'First name',
        'fields[billing_first_name][args][required]': 'true',
        'fields[billing_first_name][args][type]': 'text',
        'fields[billing_first_name][country]': 'GB',
        'fields[billing_first_name][key]': 'billing_first_name',
        'fields[billing_first_name][value]': 'Test',
        'fields[billing_last_name][args][label]': 'Last name',
        'fields[billing_last_name][args][required]': 'true',
        'fields[billing_last_name][args][type]': 'text',
        'fields[billing_last_name][country]': 'GB',
        'fields[billing_last_name][key]': 'billing_last_name',
        'fields[billing_last_name][value]': 'Test',
        'fields[billing_phone][args][label]': 'Phone',
        'fields[billing_phone][args][required]': 'false',
        'fields[billing_phone][args][type]': 'tel',
        'fields[billing_phone][country]': 'GB',
        'fields[billing_phone][key]': 'billing_phone',
        'fields[billing_phone][value]': '',
        post_data:
          'billing_email=bitbucket%40wpengine.com&billing_first_name=Test&billing_last_name=Test&billing_phone=&billing_country=GB&billing_address_1=Test&billing_address_2=&billing_city=London&billing_state=&billing_postcode=E17%206FE&wc_order_attribution_source_type=organic&wc_order_attribution_referrer=https%3A%2F%2Fwww.google.com%2F&wc_order_attribution_utm_campaign=(none)&wc_order_attribution_utm_source=google&wc_order_attribution_utm_medium=organic&wc_order_attribution_utm_content=(none)&wc_order_attribution_utm_id=(none)&wc_order_attribution_utm_term=(none)&wc_order_attribution_utm_source_platform=(none)&wc_order_attribution_utm_creative_format=(none)&wc_order_attribution_utm_marketing_tactic=(none)&wc_order_attribution_session_entry=https%3A%2F%2Fshegrowsveg.com%2Fchelsea-flower-show-2025%2F%3Fsrsltid%3DAfmBOoqxbQB94fsdOfyBRPXBhrlQi1rX5gBr89fXepLNwY1r9JGNiCAd&wc_order_attribution_session_start_time=2025-04-28%2013%3A10%3A00&wc_order_attribution_session_pages=5&wc_order_attribution_session_count=9&wc_order_attribution_user_agent=Mozilla%2F5.0%20(Macintosh%3B%20Intel%20Mac%20OS%20X%2010_15_7)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F135.0.0.0%20Safari%2F537.36&shipping_country=GB&shipping_first_name=Test&shipping_last_name=Test&shipping_company=&shipping_address_1=Test&shipping_address_2=&shipping_city=London&shipping_state=&shipping_postcode=E17%206FE&order_comments=&payment_method=cod&woocommerce-process-checkout-nonce=84666ac004&_wp_http_referer=%2F%3Fwc-ajax%3Dupdate_order_review&shipping_method%5B0%5D=flexible_shipping_single%3A2&cart%5B552f5e345c9d523300ea73c6a65b0a6e%5D%5Bqty%5D=1&coupon_code=',
      },
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      }
    )
    checkStatus({
        response: response,
        expectedStatus: 200,
        failOnError: true,
        printOnError: true
      });
    sleep(randomIntBetween(pauseMin, pauseMax));

    response = http.post(
      'https://staging.shegrowsveg.com/wp-admin/admin-ajax.php',
      {
        action: 'flux_check_for_inline_errors',
        'fields[billing_country][args][label]': 'Country / Region',
        'fields[billing_country][args][required]': 'false',
        'fields[billing_country][args][type]': 'country',
        'fields[billing_country][country]': 'GB',
        'fields[billing_country][key]': 'billing_country',
        'fields[billing_country][value]': 'GB',
        'fields[billing_address_1][args][label]': 'Street address',
        'fields[billing_address_1][args][required]': 'false',
        'fields[billing_address_1][args][type]': 'text',
        'fields[billing_address_1][country]': 'GB',
        'fields[billing_address_1][key]': 'billing_address_1',
        'fields[billing_address_1][value]': 'Test',
        'fields[billing_address_2][args][label]': 'Apartment, suite, unit etc.',
        'fields[billing_address_2][args][required]': 'false',
        'fields[billing_address_2][args][type]': 'text',
        'fields[billing_address_2][country]': 'GB',
        'fields[billing_address_2][key]': 'billing_address_2',
        'fields[billing_address_2][value]': '',
        'fields[billing_city][args][label]': 'Town / City',
        'fields[billing_city][args][required]': 'false',
        'fields[billing_city][args][type]': 'text',
        'fields[billing_city][country]': 'GB',
        'fields[billing_city][key]': 'billing_city',
        'fields[billing_city][value]': 'London',
        'fields[billing_state][args][label]': 'County',
        'fields[billing_state][args][required]': 'false',
        'fields[billing_state][args][type]': 'text',
        'fields[billing_state][country]': 'GB',
        'fields[billing_state][key]': 'billing_state',
        'fields[billing_state][value]': '',
        'fields[billing_postcode][args][label]': 'Postcode',
        'fields[billing_postcode][args][required]': 'false',
        'fields[billing_postcode][args][type]': 'text',
        'fields[billing_postcode][country]': 'GB',
        'fields[billing_postcode][key]': 'billing_postcode',
        'fields[billing_postcode][value]': 'E17 6FE',
        'fields[kl_newsletter_checkbox][args][label]':
          'Sign me up to receive email updates and news',
        'fields[kl_newsletter_checkbox][args][required]': 'false',
        'fields[kl_newsletter_checkbox][args][type]': 'checkbox',
        'fields[kl_newsletter_checkbox][country]': 'GB',
        'fields[kl_newsletter_checkbox][key]': 'kl_newsletter_checkbox',
        'fields[kl_newsletter_checkbox][value]': `${vars['is_gift_card1']}`,
        post_data:
          'billing_email=bitbucket%40wpengine.com&billing_first_name=Test&billing_last_name=Test&billing_phone=&billing_country=GB&billing_address_1=Test&billing_address_2=&billing_city=London&billing_state=&billing_postcode=E17%206FE&wc_order_attribution_source_type=organic&wc_order_attribution_referrer=https%3A%2F%2Fwww.google.com%2F&wc_order_attribution_utm_campaign=(none)&wc_order_attribution_utm_source=google&wc_order_attribution_utm_medium=organic&wc_order_attribution_utm_content=(none)&wc_order_attribution_utm_id=(none)&wc_order_attribution_utm_term=(none)&wc_order_attribution_utm_source_platform=(none)&wc_order_attribution_utm_creative_format=(none)&wc_order_attribution_utm_marketing_tactic=(none)&wc_order_attribution_session_entry=https%3A%2F%2Fshegrowsveg.com%2Fchelsea-flower-show-2025%2F%3Fsrsltid%3DAfmBOoqxbQB94fsdOfyBRPXBhrlQi1rX5gBr89fXepLNwY1r9JGNiCAd&wc_order_attribution_session_start_time=2025-04-28%2013%3A10%3A00&wc_order_attribution_session_pages=5&wc_order_attribution_session_count=9&wc_order_attribution_user_agent=Mozilla%2F5.0%20(Macintosh%3B%20Intel%20Mac%20OS%20X%2010_15_7)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F135.0.0.0%20Safari%2F537.36&shipping_country=GB&shipping_first_name=Test&shipping_last_name=Test&shipping_company=&shipping_address_1=Test&shipping_address_2=&shipping_city=London&shipping_state=&shipping_postcode=E17%206FE&order_comments=&payment_method=cod&woocommerce-process-checkout-nonce=84666ac004&_wp_http_referer=%2F%3Fwc-ajax%3Dupdate_order_review&shipping_method%5B0%5D=flexible_shipping_single%3A2&cart%5B552f5e345c9d523300ea73c6a65b0a6e%5D%5Bqty%5D=1&coupon_code=',
      },
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      }
    )
    checkStatus({
        response: response,
        expectedStatus: 200,
        failOnError: true,
        printOnError: true
      });
    sleep(randomIntBetween(pauseMin, pauseMax));


    response = http.post(
      'https://staging.shegrowsveg.com/?wc-ajax=checkout',
      {
        billing_email: 'bitbucket@wpengine.com',
        billing_first_name: 'Test',
        billing_last_name: 'Test',
        billing_phone: '',
        billing_country: 'GB',
        billing_address_1: 'Test',
        billing_address_2: '',
        billing_city: 'London',
        billing_state: '',
        billing_postcode: 'E17 6FE',
        wc_order_attribution_source_type: 'organic',
        wc_order_attribution_referrer: 'https://www.google.com/',
        wc_order_attribution_utm_campaign: '(none)',
        wc_order_attribution_utm_source: 'google',
        wc_order_attribution_utm_medium: 'organic',
        wc_order_attribution_utm_content: '(none)',
        wc_order_attribution_utm_id: '(none)',
        wc_order_attribution_utm_term: '(none)',
        wc_order_attribution_utm_source_platform: '(none)',
        wc_order_attribution_utm_creative_format: '(none)',
        wc_order_attribution_utm_marketing_tactic: '(none)',
        wc_order_attribution_session_entry:
          'https://shegrowsveg.com/chelsea-flower-show-2025/?srsltid=AfmBOoqxbQB94fsdOfyBRPXBhrlQi1rX5gBr89fXepLNwY1r9JGNiCAd',
        wc_order_attribution_session_start_time: '2025-04-28 13:10:00',
        wc_order_attribution_session_pages: '5',
        wc_order_attribution_session_count: '9',
        wc_order_attribution_user_agent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
        shipping_country: 'GB',
        shipping_first_name: 'Test',
        shipping_last_name: 'Test',
        shipping_company: '',
        shipping_address_1: 'Test',
        shipping_address_2: '',
        shipping_city: 'London',
        shipping_state: '',
        shipping_postcode: 'E17 6FE',
        order_comments: '',
        payment_method: 'cod',
        'woocommerce-process-checkout-nonce': `${vars['woocommerce-process-checkout-nonce1']}`,
        _wp_http_referer: '/?wc-ajax=update_order_review',
        'shipping_method[0]': `${vars['shipping_method[0]1']}`,
        'cart[552f5e345c9d523300ea73c6a65b0a6e][qty]': `${vars['is_gift_card1']}`,
        coupon_code: '',
      },
      {
        headers: {
          accept: 'application/json, text/javascript, */*; q=0.01',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-requested-with': 'XMLHttpRequest',
          'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      }
    )
    checkStatus({
        response: response,
        expectedStatus: 200,
        failOnError: true,
        printOnError: true
      });
    sleep(randomIntBetween(pauseMin, pauseMax));
  })

  group(
    'page_4 - https://staging.shegrowsveg.com/checkout/order-received/57855/?key=wc_order_xkzYWRtPAJJM3',
    function () {
      response = http.get(
        'https://staging.shegrowsveg.com/checkout/order-received/57855/?key=wc_order_xkzYWRtPAJJM3',
        {
          headers: {
            'upgrade-insecure-requests': '1',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      checkStatus({
        response: response,
        expectedStatus: 200,
        failOnError: true,
        printOnError: true
      });
      sleep(5)
      response = http.get('https://staging.shegrowsveg.com/shop/', {
        headers: {
          'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      })
      checkStatus({
        response: response,
        expectedStatus: 200,
        failOnError: true,
        printOnError: true
      });
    }
    
  )
}   