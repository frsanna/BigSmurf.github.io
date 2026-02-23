// console-contact-terminal.js
(() => {
  /** @type {{email: string, location: string, linkedin: string}} */
  const contacts = Object.freeze({
    email: "job@francescosanna.eu",
    location: "Cagliari, Italy",
    linkedin: "https://www.linkedin.com/in/francesco-sanna"
  });

  const nativeConsole = {
    clear: console.clear.bind(console),
    log: console.log.bind(console),
    table: console.table.bind(console)
  };

  /**
   * Prints the styled contact-only console surface.
   * @returns {void}
   */
  function renderContactTerminal() {
    nativeConsole.clear();
    nativeConsole.log(
      "%cFrancesco Sanna | Contact Console",
      "font-size:18px;font-weight:800;color:#2a9d8f;"
    );
    // nativeConsole.log(
    //   "%cWelcome to the Capybara Compliance Layer.",
    //   "font-size:12px;color:#8d6e63;font-weight:700;"
    // );
    // nativeConsole.log(
    //   "%cThis console is intentionally read-only. Contact details only.",
    //   "font-size:12px;color:#4f4f4f;"
    // );
    nativeConsole.table(contacts);
    nativeConsole.log(
      "%cQuick actions: fsContact.sendEmail() | fsContact.openLinkedIn()",
      "font-size:12px;color:#e76f51;font-weight:700;"
    );
  }

  /**
   * Public helper object exposed on `window` for quick contact actions.
   * @type {{email: string, location: string, linkedin: string, sendEmail: () => void, openLinkedIn: () => void}}
   */
  const fsContact = Object.freeze({
    email: contacts.email,
    location: contacts.location,
    linkedin: contacts.linkedin,
    sendEmail: () => window.open(`mailto:${contacts.email}`, "_self"),
    openLinkedIn: () => window.open(contacts.linkedin, "_blank", "noopener,noreferrer")
  });

  if (!Object.prototype.hasOwnProperty.call(window, "fsContact")) {
    Object.defineProperty(window, "fsContact", {
      value: fsContact,
      writable: false,
      configurable: false
    });
  }

  /**
   * Overrides key console methods so the terminal remains contact-focused.
   * @returns {void}
   */
  function lockConsoleSurface() {
    const blockedMethods = ["log", "info", "warn", "error", "debug", "table", "dir", "trace"];
    blockedMethods.forEach((method) => {
      console[method] = () => {
        renderContactTerminal();
      };
    });
    console.clear = renderContactTerminal;
  }

  lockConsoleSurface();
  renderContactTerminal();
  window.setInterval(lockConsoleSurface, 1200);
})();
