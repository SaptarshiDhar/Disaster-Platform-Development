/**
 * PROTOTYPE AUTHENTICATION — FRONTEND ONLY.
 *
 * This is deliberately NOT production authentication. There is no server, no
 * password verification and no session token. It exists so the demo can move
 * past a login screen, and so that a real provider (Supabase Auth or the
 * project backend) can replace this one module without touching the UI.
 *
 * What a real implementation must add, and this one does not have:
 *   - server-side credential verification
 *   - signed, expiring session tokens
 *   - role and jurisdiction claims enforced server-side
 *   - protection that cannot be bypassed from the browser console
 *
 * Route protection built on this module is a UX convenience, not a security
 * boundary. Never place sensitive data behind it.
 */

const SESSION_KEY = "raksha_commander_session";

// Retained for compatibility with the earlier prototype login flow.
const LEGACY_FLAG_KEY = "sih_commander_logged_in";
const LEGACY_USER_KEY = "sih_user";

/** Safe localStorage access — private browsing modes can throw. */
function readStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage unavailable: the session simply will not persist across reloads.
  }
}

function removeStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Nothing to do.
  }
}

/**
 * Prototype sign-in. Any non-empty credential pair is accepted.
 * Returns a result object rather than throwing, so the form can render the
 * message inline.
 */
export async function login({ commanderId, password }) {
  const id = (commanderId ?? "").trim();
  const secret = (password ?? "").trim();

  if (!id) {
    return { ok: false, error: "Enter your Commander ID or official email." };
  }

  if (!secret) {
    return { ok: false, error: "Enter your password." };
  }

  const user = {
    id,
    displayName: deriveDisplayName(id),
    role: "commander",
    unit: "NDRF / SDMA",
    signedInAt: new Date().toISOString(),
  };

  writeStorage(SESSION_KEY, JSON.stringify(user));
  writeStorage(LEGACY_FLAG_KEY, "true");
  writeStorage(LEGACY_USER_KEY, id);

  return { ok: true, user };
}

export function logout() {
  removeStorage(SESSION_KEY);
  removeStorage(LEGACY_FLAG_KEY);
  removeStorage(LEGACY_USER_KEY);
}

/** The signed-in prototype user, or null. */
export function getCurrentUser() {
  const raw = readStorage(SESSION_KEY);

  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      removeStorage(SESSION_KEY);
    }
  }

  // Fall back to the older flag so an existing prototype session still works.
  if (readStorage(LEGACY_FLAG_KEY) === "true") {
    const id = readStorage(LEGACY_USER_KEY) ?? "Commander";
    return {
      id,
      displayName: deriveDisplayName(id),
      role: "commander",
      unit: "NDRF / SDMA",
    };
  }

  return null;
}

export function isAuthenticated() {
  return getCurrentUser() !== null;
}

/** Turns an id or email into something presentable in the header. */
function deriveDisplayName(id) {
  const base = id.includes("@") ? id.split("@")[0] : id;

  return base
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
