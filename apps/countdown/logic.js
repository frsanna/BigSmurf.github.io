(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CountdownLogic = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const HOUR = 60 * 60 * 1000;
  const DAY = 24 * HOUR;
  const CRITICAL_MS = 48 * HOUR;
  const DARK_MS = 7 * DAY;
  const WORN_MS = 21 * DAY;
  const MONTHS = [
    "gennaio",
    "febbraio",
    "marzo",
    "aprile",
    "maggio",
    "giugno",
    "luglio",
    "agosto",
    "settembre",
    "ottobre",
    "novembre",
    "dicembre",
  ];
  const TARGET_PATTERN =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;

  /**
   * Wall-clock fields of an absolute instant, read in a time zone.
   * @param {Date} date
   * @param {string} timeZone
   * @returns {{year: number, month: number, day: number, hour: number, minute: number, second: number}}
   */
  function wallClock(date, timeZone) {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const map = {};
    formatter.formatToParts(date).forEach((part) => {
      if (part.type !== "literal") {
        map[part.type] = part.value;
      }
    });
    let hour = Number(map.hour);
    if (hour === 24) hour = 0;
    return {
      year: Number(map.year),
      month: Number(map.month),
      day: Number(map.day),
      hour,
      minute: Number(map.minute),
      second: Number(map.second),
    };
  }

  /**
   * Absolute instant for a wall-clock time in a time zone.
   * Two passes settle daylight-saving gaps.
   * @param {{year: number, month: number, day: number, hour: number, minute: number, second: number}} parts
   * @param {string} timeZone
   * @returns {Date}
   */
  function zonedToUtc(parts, timeZone) {
    const desired = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
    );
    let utc = desired;
    for (let pass = 0; pass < 2; pass += 1) {
      const seen = wallClock(new Date(utc), timeZone);
      const seenUtc = Date.UTC(
        seen.year,
        seen.month - 1,
        seen.day,
        seen.hour,
        seen.minute,
        seen.second,
      );
      utc += desired - seenUtc;
    }
    return new Date(utc);
  }

  /**
   * @param {string} value
   * @returns {{year: number, month: number, day: number, hour: number, minute: number, second: number} | null}
   */
  function parseTarget(value) {
    if (typeof value !== "string") return null;
    const match = TARGET_PATTERN.exec(value.trim());
    if (!match) return null;
    const parts = {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3]),
      hour: Number(match[4]),
      minute: Number(match[5]),
      second: Number(match[6] || 0),
    };
    if (parts.month < 1 || parts.month > 12) return null;
    if (parts.day < 1 || parts.day > 31) return null;
    if (parts.hour > 23 || parts.minute > 59 || parts.second > 59) return null;
    const probe = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
    if (
      probe.getUTCFullYear() !== parts.year ||
      probe.getUTCMonth() !== parts.month - 1 ||
      probe.getUTCDate() !== parts.day
    ) {
      return null;
    }
    return parts;
  }

  /**
   * @param {{year: number, month: number, day: number}} parts
   * @param {string} timeZone
   * @returns {Date}
   */
  function nextLocalMidnight(parts, timeZone) {
    const next = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + 1));
    return zonedToUtc(
      {
        year: next.getUTCFullYear(),
        month: next.getUTCMonth() + 1,
        day: next.getUTCDate(),
        hour: 0,
        minute: 0,
        second: 0,
      },
      timeZone,
    );
  }

  /**
   * @param {{year: number, month: number, day: number, hour: number, minute: number, second: number}} parts
   * @returns {string}
   */
  function formatInstant(parts) {
    const hh = String(parts.hour).padStart(2, "0");
    const mm = String(parts.minute).padStart(2, "0");
    const clock =
      parts.second > 0
        ? `${hh}:${mm}:${String(parts.second).padStart(2, "0")}`
        : `${hh}:${mm}`;
    return `${parts.day} ${MONTHS[parts.month - 1]} ${parts.year}, ${clock}`;
  }

  /**
   * @param {number} ms
   * @returns {{days: number, hours: number, minutes: number, seconds: number}}
   */
  function splitRemaining(ms) {
    const total = Math.floor(Math.max(0, ms) / 1000);
    return {
      days: Math.floor(total / 86400),
      hours: Math.floor((total % 86400) / 3600),
      minutes: Math.floor((total % 3600) / 60),
      seconds: total % 60,
    };
  }

  /**
   * @param {{place?: string, timeZone?: string, target?: string}} config
   */
  function create(config) {
    const place = typeof config.place === "string" ? config.place.trim() : "";
    const timeZone = config.timeZone;
    const parts = parseTarget(config.target);
    let target = null;
    let openUntil = null;
    let instantLabel = "";
    let fault = false;

    try {
      if (!parts || typeof timeZone !== "string" || !timeZone) {
        throw new Error("unreadable");
      }
      Intl.DateTimeFormat("it-IT", { timeZone }).format(new Date());
      target = zonedToUtc(parts, timeZone);
      openUntil = nextLocalMidnight(parts, timeZone);
      instantLabel = formatInstant(parts);
      if (Number.isNaN(target.getTime()) || Number.isNaN(openUntil.getTime())) {
        throw new Error("unreadable");
      }
    } catch (error) {
      fault = true;
      target = null;
      openUntil = null;
      instantLabel = "";
    }

    return {
      place,
      timeZone: fault ? "" : timeZone,
      instantLabel,
      fault,
      target,
      openUntil,
      /**
       * @param {Date} now
       * @returns {"fault" | "sealed" | "open" | "critical" | "dark" | "worn" | "calm"}
       */
      phase(now) {
        if (fault || !target || !openUntil) return "fault";
        const time = now.getTime();
        if (time >= openUntil.getTime()) return "sealed";
        if (time >= target.getTime()) return "open";
        const left = target.getTime() - time;
        if (left <= CRITICAL_MS) return "critical";
        if (left <= DARK_MS) return "dark";
        if (left <= WORN_MS) return "worn";
        return "calm";
      },
      /**
       * @param {Date} now
       */
      remaining(now) {
        if (fault || !target) return splitRemaining(0);
        return splitRemaining(target.getTime() - now.getTime());
      },
    };
  }

  return {
    create,
    zonedToUtc,
    CRITICAL_MS,
    DARK_MS,
    WORN_MS,
  };
});
