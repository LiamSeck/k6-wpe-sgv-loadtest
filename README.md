[![k6](https://img.shields.io/badge/k6-7D64FF.svg?style=for-the-badge&logo=k6&logoColor=white)](https://github.com/grafana/k6)![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black)

# Execution Steps

- On MacOS install K6 by running `brew install k6` or by following the [K6 Docs](https://grafana.com/docs/k6/latest/set-up/install-k6/).  

- To execute the script using your local machines resources run `k6 run main.js`. 

- To execute the script using K6 Cloud first authenticate with K6 Cloud by running `k6 login cloud --token token_ID` then to execute the script by running `k6 cloud run main.js`.
