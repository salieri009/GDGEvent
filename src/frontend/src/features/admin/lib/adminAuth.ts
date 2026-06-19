const STORAGE_KEY = 'doodlepaws_admin_key';

export function getAdminKey(): string | null {
  return sessionStorage.getItem(STORAGE_KEY);
}

export function setAdminKey(key: string): void {
  sessionStorage.setItem(STORAGE_KEY, key);
}

export function clearAdminKey(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function isAdminLoggedIn(): boolean {
  return Boolean(getAdminKey());
}
