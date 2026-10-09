// Console easter egg: a small contact terminal for the curious.
// `window.__FS_CONTACT` is injected at build time from src/content/profile.json.
function initConsoleTerminal() {
  const contacts = window.__FS_CONTACT;
  if (!contacts) {
    return;
  }

  function render() {
    console.log(
      '%c FS %c Francesco Sanna | Contact Console',
      'background:#2a9d8f;color:#fff;font-weight:800;padding:2px 4px;border-radius:3px;',
      'font-size:16px;font-weight:800;color:#2a9d8f;'
    );
    console.table({
      Email: contacts.email,
      Location: contacts.location,
      'Remote / relocation': contacts.workSetup,
      LinkedIn: contacts.linkedin
    });
    console.log(
      '%cQuick actions: fsContact.sendEmail() | fsContact.openLinkedIn() | fsContact.downloadCV() | fsContact.help()',
      'font-size:12px;color:#e76f51;font-weight:700;'
    );
  }

  const fsContact = Object.freeze({
    email: contacts.email,
    location: contacts.location,
    workSetup: contacts.workSetup,
    linkedin: contacts.linkedin,
    sendEmail: () => window.open(`mailto:${contacts.email}`, '_self'),
    openLinkedIn: () => window.open(contacts.linkedin, '_blank', 'noopener,noreferrer'),
    downloadCV: () => window.open('/resources/curriculum.pdf', '_blank', 'noopener'),
    help: render,
    toString: () => 'Type fsContact.help()'
  });

  if (!Object.prototype.hasOwnProperty.call(window, 'fsContact')) {
    Object.defineProperty(window, 'fsContact', { value: fsContact, writable: false, configurable: false });
  }
  render();
}
