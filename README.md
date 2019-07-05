# LemonPI Soft Landing Helper

## Install

```shell
npm install --save lemonpi-soft-landing-helper
```

## Usage

```js
import { create } from 'lemonpi-soft-landing-helper';

create({
  // Required fields, retrieve these IDs from LemonPI
  templateId: 0,
  adsetId: 0,

  // Content fields as defined in LemonPI
  content: {
    example1: value => {
      document.querySelector('#example1').textContent = value;
    },
    example2: value => {
      document.querySelector('#example2').textContent = value;
    },
  },
});
```

Or directly in the browser:

```html
<script src="https://unpkg.com/lemonpi-soft-landing-helper/dist/bundle.umd.js"></script>
<script>
  window.lemonpiSoftLandingHelper.create({ ... });
</script>
```

## API

##### `create(Object)`

- **`content`** (`object` of `function` values)
  - **`...`** (`function`)
    The key has to match with a preexisting content field in LemonPI. Use the `value` argument to do something with the dynamic content result for this field.
- **`templateId`** (`regex`)
  The template ID derrived from LemonPI.
- **`adsetId`** (`regex`)
  The adset ID derrived from LemonPI.
- **`urlTest`** (`regex`)
  Only initialize when this regular expression matches `window.location.href`.
- **`interval`** (`number`, default: `500`)
  The delay between execution attempts in milliseconds.
- **`debug`** (`boolean`, default: `/lemonpi_debug/i.test(window.location.href)`)
  Enables console debugging.

##### `version` (`string`)

Semver package version of this library, e.g. `"1.0.0"`.
