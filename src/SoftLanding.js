export default class SoftLanding {
  constructor(config) {
    this.consoleStyling = 'padding:1px 6px 0;border-radius:2px;background:#fedc00;color:#313131';
    this.dynamicContent = null;
    this.errors = {};
    this.config = {
      debug: /lemonpi_debug/i.test(window.location.href),
      interval: 250,
      urlTest: /$/,
      content: {},
      ...config,
    };

    this.create();
  }

  logSuccess(message, ...args) {
    if (this.config.debug) {
      console.log(
        `%cSoft Landing Helper%c ${message}`,
        this.consoleStyling,
        'color:green',
        ...args.slice(1),
      );
    }
  }

  addError(subject, ...args) {
    if (!this.errors[subject]) {
      this.errors[subject] = args;
    }
  }

  logErrors() {
    if (this.config.debug) {
      Object.keys(this.errors).forEach(subject =>
        console.error(
          `%cSoft Landing Helper%c ${subject}%c ${this.errors[subject][0]}`,
          this.consoleStyling,
          'font-weight:bold',
          '',
          ...this.errors[subject].slice(1),
        ),
      );
    }
  }

  hasErrors() {
    return !!Object.keys(this.errors).length;
  }

  getDynamicContent() {
    try {
      const xhr = new XMLHttpRequest();

      xhr.open(
        'POST',
        `https://d.lemonpi.io/a/${this.config.advertiserId}/content/${this.config.adsetId}-${this.config.templateId}`,
        false, // Sync for now
      );

      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send(
        JSON.stringify({
          context: {
            $request: {
              timestamp: '2019-07-06T17:08:45+02:00',
            },
          },
        }),
      );

      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        return JSON.parse(xhr.responseText);
      }
    } catch ({ message }) {
      this.addError('Please check your adset and template IDs', message);
    }

    return undefined;
  }

  create() {
    // Clear errors for every new attempt
    this.errors = {};

    // Check for required IDs
    ['advertiserId', 'adsetId', 'templateId'].forEach(requiredField => {
      if (!this.config[requiredField]) {
        this.addError(requiredField, 'is required and missing');
      } else if (typeof this.config[requiredField] !== 'number') {
        this.addError(requiredField, 'should be a number');
      }
    });

    this.dynamicContent = this.getDynamicContent();

    // Test the URL for admittance
    if (!this.config.urlTest.test(window.location.href)) {
      this.addError('The URL', `doesn't match "${this.config.urlTest.toString()}"`);
    }

    if (this.dynamicContent) {
      Object.keys(this.config.content).forEach(field => {
        if (!this.dynamicContent[field]) {
          this.addError(field, "doesn't exist in the template:", Object.keys(this.dynamicContent));
        } else if (typeof this.config.content[field] !== 'function') {
          this.addError(field, 'should be a function');
        } else {
          let successfulFields = 0;
          let lastErrorMessage = null;

          const attempt = setInterval(() => {
            try {
              this.config.content[field](this.dynamicContent[field].value);
              clearInterval(attempt);
              successfulFields += 1;

              if (Object.keys(this.config.content).length === successfulFields) {
                this.logSuccess('Successfully created soft landing');
              }
            } catch ({ message }) {
              if (lastErrorMessage !== message) {
                lastErrorMessage = message;
                this.addError(field, message);
                this.logErrors();
              }
            }
          }, this.config.interval);
        }
      });
    }

    this.logErrors();
  }
}
