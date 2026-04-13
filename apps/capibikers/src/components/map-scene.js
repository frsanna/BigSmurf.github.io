export function renderMapScene() {
  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>Ride Radar</h2>
          <p>Drag the map, zoom in, or click a badge to center the legend around the latest glorious nonsense.</p>
        </div>
        <div class="control-stack" aria-label="Map controls">
          <button class="icon-button" type="button" data-map-action="zoom-in" aria-label="Zoom in">+</button>
          <button class="icon-button" type="button" data-map-action="zoom-out" aria-label="Zoom out">-</button>
          <button class="icon-button" type="button" data-map-action="reset" aria-label="Reset view">0</button>
        </div>
      </div>

      <div class="map-board" data-map-board>
        <div class="map-viewport" data-map-viewport>
          <svg class="world-svg" viewBox="0 0 1000 500" role="img" aria-label="Stylized world map">
            <defs>
              <linearGradient id="oceanGlow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="rgba(255,255,255,0.10)" />
                <stop offset="100%" stop-color="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <rect width="1000" height="500" fill="url(#oceanGlow)" opacity="0.32"></rect>
            <g aria-hidden="true">
              <path class="map-grid-line" d="M0 125H1000"></path>
              <path class="map-grid-line" d="M0 250H1000"></path>
              <path class="map-grid-line" d="M0 375H1000"></path>
              <path class="map-grid-line" d="M250 0V500"></path>
              <path class="map-grid-line" d="M500 0V500"></path>
              <path class="map-grid-line" d="M750 0V500"></path>
            </g>
            <g aria-hidden="true">
              <path class="continent continent--shadow" d="M104 141C131 122 182 113 208 128C236 143 256 177 280 186C312 199 349 188 374 205C401 224 390 265 373 283C348 309 298 312 271 330C244 348 226 383 191 385C160 386 145 353 120 337C94 320 44 325 32 295C17 258 64 222 81 194C90 180 90 154 104 141Z"></path>
              <path class="continent continent--shadow" d="M322 71C349 54 391 54 426 67C453 76 487 84 506 111C521 133 511 162 516 188C523 227 556 265 543 297C528 335 480 357 436 354C398 350 366 324 356 287C344 248 359 206 347 171C337 142 292 103 322 71Z"></path>
              <path class="continent continent--shadow" d="M553 102C602 81 661 77 711 92C745 101 768 128 803 139C836 149 876 145 898 172C920 197 918 240 901 267C882 297 841 306 808 320C768 336 734 369 692 379C638 391 581 385 539 353C500 323 474 271 477 223C479 178 512 121 553 102Z"></path>
              <path class="continent continent--shadow" d="M782 344C802 330 831 327 854 335C878 343 903 367 900 393C896 424 861 450 829 448C797 447 774 417 769 388C767 372 769 354 782 344Z"></path>
            </g>
            <g aria-hidden="true">
              <path class="continent" d="M104 131C131 112 182 103 208 118C236 133 256 167 280 176C312 189 349 178 374 195C401 214 390 255 373 273C348 299 298 302 271 320C244 338 226 373 191 375C160 376 145 343 120 327C94 310 44 315 32 285C17 248 64 212 81 184C90 170 90 144 104 131Z"></path>
              <path class="continent" d="M322 61C349 44 391 44 426 57C453 66 487 74 506 101C521 123 511 152 516 178C523 217 556 255 543 287C528 325 480 347 436 344C398 340 366 314 356 277C344 238 359 196 347 161C337 132 292 93 322 61Z"></path>
              <path class="continent" d="M553 92C602 71 661 67 711 82C745 91 768 118 803 129C836 139 876 135 898 162C920 187 918 230 901 257C882 287 841 296 808 310C768 326 734 359 692 369C638 381 581 375 539 343C500 313 474 261 477 213C479 168 512 111 553 92Z"></path>
              <path class="continent" d="M782 334C802 320 831 317 854 325C878 333 903 357 900 383C896 414 861 440 829 438C797 437 774 407 769 378C767 362 769 344 782 334Z"></path>
              <path class="continent" d="M848 121C861 108 885 104 900 113C913 121 919 139 914 156C907 177 885 188 865 183C846 178 836 160 838 143C839 135 842 127 848 121Z"></path>
            </g>
          </svg>
          <div class="map-pins" data-map-pins></div>
        </div>
      </div>

      <div class="map-caption">
        <span>Projection: stylized equirectangular madness.</span>
        <span>Data source: config adapter, ready for future database wiring.</span>
      </div>

      <div class="chip-row" data-map-chips></div>
    </section>
  `;
}
