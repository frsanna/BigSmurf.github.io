// Logo easter-egg overlay. Rendered as a direct child of <body> (see layout.js)
// so it stacks above the sticky header. Triggered by the portrait in the hero.
module.exports = function easterEgg() {
  return `
  <div id="easter-egg" class="noselect" role="dialog" aria-label="Easter egg" aria-hidden="true" inert data-nosnippet>
    <div class="egg-backdrop" data-egg-close tabindex="-1" aria-label="Close"></div>
    <div class="logo egg-stage" tabindex="-1">
      <div class="frame" aria-hidden="true">
        <div class="line h-line top"></div>
        <div class="line v-line right"></div>
        <div class="line h-line bottom"></div>
        <div class="line v-line left"></div>
      </div>
      <div class="square top-left" aria-hidden="true"></div>
      <div class="square bottom-right" aria-hidden="true"></div>
      <div class="egg-core">
        <div class="letters" aria-hidden="true">
          <span class="letter-f">F</span>
          <span class="letter-s">S</span>
        </div>
        <p class="egg-tagline" data-nosnippet>You found the quiet layer.</p>
        <p class="egg-hint" data-nosnippet>Based in Cagliari. Remote work, relocation, or regular travel are all fine.</p>
        <a href="#contact" class="egg-cta">Get in touch</a>
      </div>
    </div>
  </div>`;
};
