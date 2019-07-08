import { getUrlQueryParameters, fetch } from './helpers';

const requiredFields = { adsetId: 'number', templateId: 'number', content: 'object' };
const getFormattedConsoleMessage = (message, messageStyle = '') => [
  `%cSoft Landing Helper%c ${message}`,
  'padding:1px 6px 0;border-radius:2px;background:#fedc00;color:#313131',
  messageStyle,
];

export default class SoftLanding {
  constructor(config) {
    this.createdContentFields = 0;
    this.hasErrors = false;
    this.config = {
      debug: /lemonpi_debug/i.test(window.location.href),
      interval: 100,
      urlTest: /$/,
      content: {},
      ...config,
    };

    this.init();
  }

  logSuccess(message, ...args) {
    if (this.config.debug) {
      console.log(...getFormattedConsoleMessage(message, 'color:green'), ...args);
    }
  }

  logError(message, ...args) {
    this.hasErrors = true;

    if (this.config.debug) {
      console.error(...getFormattedConsoleMessage(message), ...args);
    }
  }

  // Initialize each content field
  create(dynamicContent) {
    Object.keys(this.config.content).forEach(field => {
      if (!dynamicContent[field]) {
        this.logError(`${field} doesn't exist in the template:`, Object.keys(dynamicContent));
      } else if (typeof this.config.content[field] !== 'function') {
        this.logError(`${field} should be a function`);
      } else {
        let lastErrorMessage = null;

        const creationAttempt = setInterval(() => {
          try {
            // Execute the custom function
            this.config.content[field](dynamicContent[field].value);
            clearInterval(creationAttempt);
            this.createdContentFields += 1;

            // On the final successful content field
            if (Object.keys(this.config.content).length === this.createdContentFields) {
              this.logSuccess('Successfully created soft landing');

              const eventString = JSON.stringify({
                type: 'impression',
                schema: 'adset-creative',
                adsetId: this.config.adsetId,
                creativeId: this.config.templateId,
              });

              // Send an impression pixel
              try {
                fetch(`https://d.lemonpi.io/track/event?e=${encodeURIComponent(eventString)}`);
              } catch (_) {} // eslint-disable-line no-empty
            }
          } catch ({ message }) {
            if (lastErrorMessage !== message) {
              lastErrorMessage = message;
              this.logError(field, message);
            }
          }
        }, this.config.interval);
      }
    });
  }

  init() {
    // Check required fields
    Object.keys(requiredFields).forEach(requiredField => {
      if (!this.config[requiredField]) {
        this.logError(`${requiredField} is required and missing`);
        // eslint-disable-next-line valid-typeof
      } else if (typeof this.config[requiredField] !== requiredFields[requiredField]) {
        this.logError(`${requiredField} should be a ${requiredFields[requiredField]}`);
      }
    });

    // Test the URL for admittance
    if (!this.config.urlTest.test(window.location.href)) {
      this.logError(`The URL doesn't match "${this.config.urlTest.toString()}"`);
    }

    if (!this.hasErrors) {
      const { advertiserId = 0, adsetId, templateId } = this.config;
      const options = {
        method: 'POST',
        body: { context: { 'query-parameters': getUrlQueryParameters() } },
      };

      // Retrieve the dynamic content data
      try {
        fetch(
          `https://d.lemonpi.io/a/${advertiserId}/content/${adsetId}-${templateId}`,
          this.create.bind(this),
          options,
        );
      } catch ({ message }) {
        this.logError('Something went wrong while retrieving dynamic content:', message);
      }
    }
  }
}
