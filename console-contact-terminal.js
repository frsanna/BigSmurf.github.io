// console-contact-terminal.js
(() => {
  /** @type {{email: string, location: string, workSetup: string, linkedin: string}} */
  const contacts = Object.freeze({
    email: "job@francescosanna.eu",
    location: "Cagliari, Italy",
    workSetup: "Open to remote work, relocation, or regular travel",
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
    nativeConsole.table({
      Email: contacts.email,
      Location: contacts.location,
      "Remote / relocation": contacts.workSetup,
      LinkedIn: contacts.linkedin
    });
    nativeConsole.log(
      "%cQuick actions: fsContact.sendEmail() | fsContact.openLinkedIn()",
      "font-size:12px;color:#e76f51;font-weight:700;"
    );
  }

  /**
   * Public helper object exposed on `window` for quick contact actions.
   */
  const fsContact = Object.freeze({
    email: contacts.email,
    location: contacts.location,
    workSetup: contacts.workSetup,
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
