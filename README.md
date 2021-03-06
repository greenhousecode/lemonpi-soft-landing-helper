# LemonPI Soft Landing Helper

> Easily create LemonPI dynamic soft landings on webpages, based on URL query string context, by automatically executing conditions for each content field.

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

#### `create(Object)`

- **`content`** (`object` of `function` values, required)
  - **`...`** (`function`)
    The key has to match with a preexisting content field in LemonPI. Use the `value` argument to do something with the dynamic content result for this field.
- **`templateId`** (`number`, required)
  The template ID derrived from LemonPI.
- **`adsetId`** (`number`, required)
  The adset ID derrived from LemonPI.
- **`urlTest`** (`regex`)
  Only initialize when this regular expression matches `window.location.href`.
- **`interval`** (`number`, default: `100`)
  The delay between execution attempts in milliseconds.
- **`debug`** (`boolean`, default: `/lemonpi_debug/i.test(window.location.href)`)
  Enables console debugging.
- **`context`** (`function` returning an `object`, default: `() => ({ 'query-parameters': getUrlQueryParameters() })`)

#### `getUrlQueryParameter(String)` (`string`)

Retrieves a query string parameter value from the URL. E.g. `"http://www.example.com/?foo=bar"` → `getUrlQueryParameter('foo')` returns `"bar"`.

#### `getUrlQueryParameters()` (`object` of `string` values)

Retrieves all query string parameters from the URL.
