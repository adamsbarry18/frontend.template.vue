<template>
  <div class="page-wrapper">
    <div class="title">
      <span>Guideline</span>
      <h2>Colors</h2>
      <p>
        Colors convey our brand personality and values but also help users
        navigate through the interface.
      </p>
    </div>
    <u-tabs class="blocks-wrapper" mode="new" :active-index.sync="activeIndex">
      <u-tab-pane
        label="Base colors"
        index="1"
        class="blocks-wrapper__categories"
      >
        <h2>Base colors</h2>
        <div class="blocks-token">
          <div class="token">
            <div
              class="token-color"
              style="
                background: var(--color-white);
                border: 1px solid var(--color-neutral-500);
              "
            />
            <h4>color-white</h4>
            <p>#FFFFFF</p>
          </div>
          <div class="token">
            <div class="token-color" style="background: var(--color-black)" />
            <h4>color-black</h4>
            <p>#000000</p>
          </div>
        </div>
        <div class="blocks-token">
          <div class="token">
            <div class="token-color" style="background: var(--color-grey-50)" />
            <h4>color-grey-50</h4>
            <p>#FFFAEB</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-grey-100)"
            />
            <h4>color-grey-100</h4>
            <p>#FFF0C2</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-grey-200)"
            />
            <h4>color-grey-200</h4>
            <p>#FFE699</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-grey-300)"
            />
            <h4>color-grey-300</h4>
            <p>#FFDB70</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-grey-400)"
            />
            <h4>color-grey-400</h4>
            <p>#FFD147</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-grey-500)"
            />
            <h4>color-grey-500</h4>
            <p>#FFCC33</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-grey-600)"
            />
            <h4>color-grey-600</h4>
            <p>#FFC20D</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-grey-700)"
            />
            <h4>color-grey-700</h4>
            <p>#BF8F00</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-grey-800)"
            />
            <h4>color-grey-800</h4>
            <p>#735600</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-grey-900)"
            />
            <h4>color-grey-900</h4>
            <p>#261D00</p>
          </div>
        </div>
        <div class="blocks-token">
          <div class="token">
            <div class="token-color" style="background: var(--color-blue-50)" />
            <h4>color-blue-50</h4>
            <p>#FFEFED</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-blue-100)"
            />
            <h4>color-blue-100</h4>
            <p>#FFCFCA</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-blue-200)"
            />
            <h4>color-blue-200</h4>
            <p>#FFAEA6</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-blue-300)"
            />
            <h4>color-blue-300</h4>
            <p>#FF9488</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-blue-400)"
            />
            <h4>color-blue-400</h4>
            <p>#FF7869</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-blue-500)"
            />
            <h4>color-blue-500</h4>
            <p>#FF5E4D</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-blue-600)"
            />
            <h4>color-blue-600</h4>
            <p>#FF3823</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-blue-700)"
            />
            <h4>color-blue-700</h4>
            <p>#D01400</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-blue-800)"
            />
            <h4>color-blue-800</h4>
            <p>#7D0C00</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-blue-900)"
            />
            <h4>color-blue-900</h4>
            <p>#2A0400</p>
          </div>
        </div>
        <div class="blocks-token">
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-yellow-50)"
            />
            <h4>color-yellow-50</h4>
            <p>#FFFAEB</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-yellow-100)"
            />
            <h4>color-yellow-100</h4>
            <p>#FFF0C2</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-yellow-200)"
            />
            <h4>color-yellow-200</h4>
            <p>#FFE699</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-yellow-300)"
            />
            <h4>color-yellow-300</h4>
            <p>#FFDB70</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-yellow-400)"
            />
            <h4>color-yellow-400</h4>
            <p>#FFD147</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-yellow-500)"
            />
            <h4>color-yellow-500</h4>
            <p>#FFCC33</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-yellow-600)"
            />
            <h4>color-yellow-600</h4>
            <p>#FFC20D</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-yellow-700)"
            />
            <h4>color-yellow-700</h4>
            <p>#BF8F00</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-yellow-800)"
            />
            <h4>color-yellow-800</h4>
            <p>#735600</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-yellow-900)"
            />
            <h4>color-yellow-900</h4>
            <p>#261D00</p>
          </div>
        </div>
        <div class="blocks-token">
          <div class="token">
            <div class="token-color" style="background: var(--color-blue-50)" />
            <h4>color-blue-50</h4>
            <p>#E3F2FA</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-blue-100)"
            />
            <h4>color-blue-100</h4>
            <p>#ACD7F1</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-blue-200)"
            />
            <h4>color-blue-200</h4>
            <p>#75BCE7</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-blue-300)"
            />
            <h4>color-blue-300</h4>
            <p>#3DA1DE</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-blue-400)"
            />
            <h4>color-blue-400</h4>
            <p>#2080BB</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-blue-500)"
            />
            <h4>color-blue-500</h4>
            <p>#1B6D9F</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-blue-600)"
            />
            <h4>color-blue-600</h4>
            <p>#185F8B</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-blue-700)"
            />
            <h4>color-blue-700</h4>
            <p>#114463</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-blue-800)"
            />
            <h4>color-blue-800</h4>
            <p>#0A293C</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-blue-900)"
            />
            <h4>color-blue-900</h4>
            <p>#030E14</p>
          </div>
        </div>
        <div class="blocks-token">
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-green-50)"
            />
            <h4>color-green-50</h4>
            <p>#E4FAF4</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-green-100)"
            />
            <h4>color-green-100</h4>
            <p>#AEF1DD</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-green-200)"
            />
            <h4>color-green-200</h4>
            <p>#79E7C6</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-green-300)"
            />
            <h4>color-green-300</h4>
            <p>#43DEAF</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-green-400)"
            />
            <h4>color-green-400</h4>
            <p>#22C090</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-green-500)"
            />
            <h4>color-green-500</h4>
            <p>#1FB186</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-green-600)"
            />
            <h4>color-green-600</h4>
            <p>#19906D</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-green-700)"
            />
            <h4>color-green-700</h4>
            <p>#12674E</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-green-800)"
            />
            <h4>color-green-800</h4>
            <p>#0B3E2F</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-green-900)"
            />
            <h4>color-green-900</h4>
            <p>#041510</p>
          </div>
        </div>
        <div class="blocks-token">
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-orange-50)"
            />
            <h4>color-orange-50</h4>
            <p>#FFEFE6</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-orange-100)"
            />
            <h4>color-orange-100</h4>
            <p>#FFCFB6</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-orange-200)"
            />
            <h4>color-orange-200</h4>
            <p>#FFB084</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-orange-300)"
            />
            <h4>color-orange-300</h4>
            <p>#FF9054</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-orange-400)"
            />
            <h4>color-orange-400</h4>
            <p>#FF7022</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-orange-500)"
            />
            <h4>color-orange-500</h4>
            <p>#FF600A</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-orange-600)"
            />
            <h4>color-orange-600</h4>
            <p>#E85100</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-orange-700)"
            />
            <h4>color-orange-700</h4>
            <p>#A63A00</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-orange-800)"
            />
            <h4>color-orange-800</h4>
            <p>#632300</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-orange-900)"
            />
            <h4>color-orange-900</h4>
            <p>#210C00</p>
          </div>
        </div>
        <div class="blocks-token">
          <div class="token">
            <div class="token-color" style="background: var(--color-red-50)" />
            <h4>color-red-50</h4>
            <p>#FCECEC</p>
          </div>
          <div class="token">
            <div class="token-color" style="background: var(--color-red-100)" />
            <h4>color-red-100</h4>
            <p>#F7C5C5</p>
          </div>
          <div class="token">
            <div class="token-color" style="background: var(--color-red-200)" />
            <h4>color-red-200</h4>
            <p>#F29E9E</p>
          </div>
          <div class="token">
            <div class="token-color" style="background: var(--color-red-300)" />
            <h4>color-red-300</h4>
            <p>#ED7777</p>
          </div>
          <div class="token">
            <div class="token-color" style="background: var(--color-red-400)" />
            <h4>color-red-400</h4>
            <p>#E85050</p>
          </div>
          <div class="token">
            <div class="token-color" style="background: var(--color-red-500)" />
            <h4>color-red-500</h4>
            <p>#E53D3D</p>
          </div>
          <div class="token">
            <div class="token-color" style="background: var(--color-red-600)" />
            <h4>color-red-600</h4>
            <p>#E01E1E</p>
          </div>
          <div class="token">
            <div class="token-color" style="background: var(--color-red-700)" />
            <h4>color-red-700</h4>
            <p>#A01515</p>
          </div>
          <div class="token">
            <div class="token-color" style="background: var(--color-red-800)" />
            <h4>color-red-800</h4>
            <p>#600D0D</p>
          </div>
          <div class="token">
            <div class="token-color" style="background: var(--color-red-900)" />
            <h4>color-red-900</h4>
            <p>#200404</p>
          </div>
        </div>
        <div class="blocks-token">
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-4-50)"
            />
            <h4>color-alternative-4-50</h4>
            <p>#F5ECFA</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-4-100)"
            />
            <h4>color-alternative-4-100</h4>
            <p>#E3C6F0</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-4-200)"
            />
            <h4>color-alternative-4-200</h4>
            <p>#D0A0E6</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-4-300)"
            />
            <h4>color-alternative-4-300</h4>
            <p>#BD7ADC</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-4-400)"
            />
            <h4>color-alternative-4-400</h4>
            <p>#A041CD</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-4-500)"
            />
            <h4>color-alternative-4-500</h4>
            <p>#832DAB</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-4-600)"
            />
            <h4>color-alternative-4-600</h4>
            <p>#692489</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-4-700)"
            />
            <h4>color-alternative-4-700</h4>
            <p>#4F1B67</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-4-800)"
            />
            <h4>color-alternative-4-800</h4>
            <p>#341244</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-4-900)"
            />
            <h4>color-alternative-4-900</h4>
            <p>#1A0922</p>
          </div>
        </div>
        <div class="blocks-token">
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-3-50)"
            />
            <h4>color-alternative-3-50</h4>
            <p>#E8F7FB</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-3-100)"
            />
            <h4>color-alternative-3-100</h4>
            <p>#BAE8F2</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-3-200)"
            />
            <h4>color-alternative-3-200</h4>
            <p>#8DD9E9</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-3-300)"
            />
            <h4>color-alternative-3-300</h4>
            <p>#5FC9E1</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-3-400)"
            />
            <h4>color-alternative-3-400</h4>
            <p>#31BAD8</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-3-500)"
            />
            <h4>color-alternative-3-500</h4>
            <p>#239FBA</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-3-600)"
            />
            <h4>color-alternative-3-600</h4>
            <p>#1C7F95</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-3-700)"
            />
            <h4>color-alternative-3-700</h4>
            <p>#155F6F</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-3-800)"
            />
            <h4>color-alternative-3-800</h4>
            <p>#0E3F4A</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-alternative-3-900)"
            />
            <h4>color-alternative-3-900</h4>
            <p>#072025</p>
          </div>
        </div>
      </u-tab-pane>
      <u-tab-pane
        label="Utilities colors"
        index="2"
        class="blocks-wrapper__categories"
      >
        <h2>Utilities colors</h2>
        <div class="blocks-token">
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-neutral-50)"
            />
            <h4>color-neutral-50</h4>
            <p>--color-grey-50</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-neutral-100)"
            />
            <h4>color-neutral-100</h4>
            <p>--color-grey-100</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-neutral-200)"
            />
            <h4>color-neutral-200</h4>
            <p>--color-grey-200</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-neutral-300)"
            />
            <h4>color-neutral-300</h4>
            <p>--color-grey-300</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-neutral-400)"
            />
            <h4>color-neutral-400</h4>
            <p>--color-grey-400</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-neutral-500)"
            />
            <h4>color-neutral-500</h4>
            <p>--color-grey-500</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-neutral-600)"
            />
            <h4>color-neutral-600</h4>
            <p>--color-grey-600</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-neutral-700)"
            />
            <h4>color-neutral-700</h4>
            <p>--color-grey-700</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-neutral-800)"
            />
            <h4>color-neutral-800</h4>
            <p>--color-grey-800</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-neutral-900)"
            />
            <h4>color-neutral-900</h4>
            <p>--color-grey-900</p>
          </div>
        </div>
        <div class="blocks-token">
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-primary-50)"
            />
            <h4>color-primary-50</h4>
            <p>--color-blue-50</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-primary-100)"
            />
            <h4>color-primary-100</h4>
            <p>--color-blue-100</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-primary-200)"
            />
            <h4>color-primary-200</h4>
            <p>--color-blue-200</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-primary-300)"
            />
            <h4>color-primary-300</h4>
            <p>--color-blue-300</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-primary-400)"
            />
            <h4>color-primary-400</h4>
            <p>--color-blue-400</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-primary-500)"
            />
            <h4>color-primary-500</h4>
            <p>--color-blue-500</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-primary-600)"
            />
            <h4>color-primary-600</h4>
            <p>--color-blue-600</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-primary-700)"
            />
            <h4>color-primary-700</h4>
            <p>--color-blue-700</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-primary-800)"
            />
            <h4>color-primary-800</h4>
            <p>--color-blue-800</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-primary-900)"
            />
            <h4>color-primary-900</h4>
            <p>--color-blue-900</p>
          </div>
        </div>
      </u-tab-pane>
      <u-tab-pane
        label="Status colors"
        index="3"
        class="blocks-wrapper__categories"
      >
        <h2>Status colors</h2>
        <div class="blocks-token">
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-status-draft)"
            />
            <h4>color-status-draft</h4>
            <p>--color-neutral-500</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-status-planned)"
            />
            <h4>color-status-planned</h4>
            <p>--color-alternative-3-900</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-status-running)"
            />
            <h4>color-status-running</h4>
            <p>--color-blue-500</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-status-active)"
            />
            <h4>color-status-active</h4>
            <p>--color-blue-500</p>
            <p
              style="
                background: red;
                color: white;
                padding: 4px;
                margin-top: 4px;
              "
            >
              Old, migration needed
            </p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-status-completed)"
            />
            <h4>color-status-completed</h4>
            <p>--color-green-600</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-status-success)"
            />
            <h4>color-status-success</h4>
            <p>--color-green-600</p>
            <p
              style="
                background: red;
                color: white;
                padding: 4px;
                margin-top: 4px;
              "
            >
              Migration needed?
            </p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-status-validated)"
            />
            <h4>color-status-validated</h4>
            <p>--color-blue-500</p>
            <p
              style="
                background: red;
                color: white;
                padding: 4px;
                margin-top: 4px;
              "
            >
              To verify and delete
            </p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-status-paused)"
            />
            <h4>color-paused</h4>
            <p>--color-orange-500</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-status-warning)"
            />
            <h4>color-status-warning</h4>
            <p>--color-orange-700</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-status-error)"
            />
            <h4>color-status-error</h4>
            <p>--color-red-600</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-status-deleted)"
            />
            <h4>color-status-deleted</h4>
            <p>--color-neutral-800</p>
          </div>
        </div>
      </u-tab-pane>
      <u-tab-pane
        label="Data visualisation colors"
        index="4"
        class="blocks-wrapper__categories"
      >
        <h2>Data visualisation colors</h2>
        <div class="blocks-token">
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-dataviz-1)"
            />
            <h4>color-dataviz-1</h4>
            <p>--color-blue-700</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-dataviz-2)"
            />
            <h4>color-dataviz-2</h4>
            <p>--color-red-400</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-dataviz-3)"
            />
            <h4>color-dataviz-3</h4>
            <p>--color-yellow-400</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-dataviz-4)"
            />
            <h4>color-dataviz-4</h4>
            <p>--color-green-400</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-dataviz-5)"
            />
            <h4>color-dataviz-5</h4>
            <p>--color-alternative-3-400</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-dataviz-6)"
            />
            <h4>color-dataviz-6</h4>
            <p>--color-purple-300</p>
          </div>
        </div>
        <h2>Legacy data visualisation colors</h2>
        <div class="blocks-token">
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-legacy-dataviz-1)"
            />
            <h4>color-legacy-dataviz-1</h4>
            <p>--color-red-300</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-legacy-dataviz-2)"
            />
            <h4>color-legacy-dataviz-2</h4>
            <p>--color-yellow-200</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-legacy-dataviz-3)"
            />
            <h4>color-legacy-dataviz-3</h4>
            <p>--color-green-200</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-legacy-dataviz-4)"
            />
            <h4>color-legacy-dataviz-4</h4>
            <p>--color-orange-200</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-legacy-dataviz-5)"
            />
            <h4>color-legacy-dataviz-5</h4>
            <p>--color-red-400</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-legacy-dataviz-6)"
            />
            <h4>color-legacy-dataviz-6</h4>
            <p>--color-blue-300</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-legacy-dataviz-7)"
            />
            <h4>color-legacy-dataviz-7</h4>
            <p>--color-purple-300</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-legacy-dataviz-8)"
            />
            <h4>color-legacy-dataviz-8</h4>
            <p>--color-green-200</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-legacy-dataviz-9)"
            />
            <h4>color-legacy-dataviz-9</h4>
            <p>--color-alternative-3-200</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-legacy-dataviz-10)"
            />
            <h4>color-legacy-dataviz-10</h4>
            <p>--color-blue-200</p>
          </div>
          <div class="token">
            <div
              class="token-color"
              style="background: var(--color-legacy-dataviz-11)"
            />
            <h4>color-legacy-dataviz-11</h4>
            <p>--color-alternative-4-200</p>
          </div>
        </div>
      </u-tab-pane>
    </u-tabs>
  </div>
</template>
<script setup lang="ts">
  import UTabs from '@/commons/navigation/UTabs.vue';
  import UTabPane from '@/commons/navigation/UTabPane.vue';

  import { ref } from 'vue';

  defineProps({
    prefix: {
      type: String,
    },
  });

  const activeIndex = ref('1');
</script>

<style lang="scss">
  .page-wrapper .title {
    h2 {
      font-size: 32px;
    }
    span {
      text-transform: uppercase;
    }
    p {
      font-size: 16px;
    }
  }
  .blocks-wrapper {
    margin-top: 20px;
    .blocks-wrapper__categories {
      background: var(--color-white);
      border: 1px solid var(--color-neutral-100);
      padding: 32px 40px;
    }

    h2:not(:first-child) {
      padding-top: 40px;
      margin-top: 40px;
      border-top: 1px solid var(--color-neutral-500);
    }

    p {
      color: var(--color-neutral-800);
    }

    .blocks-token {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      padding: 20px 0;

      h4 {
        padding: 8px 0 4px 0;
      }

      .token {
        max-width: 128px;
      }
    }
  }
  .token-color {
    border-radius: 4px;
    width: 128px;
    height: 60px;
    color: var(--color-blue);
  }
</style>
