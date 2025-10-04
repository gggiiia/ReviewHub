import { proxy, useSnapshot } from "valtio"

export type NotificationFrequency = "realtime" | "daily" | "weekly"

export interface SettingsState {
  // Integrations
  fbConnected: boolean
  googleConnected: boolean

  // Notifications
  notifEmail: boolean
  notifSms: boolean
  notifPush: boolean
  notifFreq: NotificationFrequency

  // Account
  fullName: string
  email: string
  avatar: string // data URL or remote URL
}

const STORAGE_KEY = "app.settings.v1"

function loadFromStorage(): SettingsState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SettingsState
  } catch {
    return null
  }
}

const defaultSettings: SettingsState = {
  fbConnected: false,
  googleConnected: true,
  notifEmail: true,
  notifSms: false,
  notifPush: true,
  notifFreq: "daily",
  fullName: "Jane Doe",
  email: "jane@example.com",
  avatar: "",
}

const initial = loadFromStorage() ?? defaultSettings

export const settingsState = proxy<SettingsState>({ ...initial })

function persist(state: SettingsState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function saveSettings(partial: Partial<SettingsState>) {
  Object.assign(settingsState, partial)
  persist(settingsState)
}

export function resetSettings() {
  Object.assign(settingsState, defaultSettings)
  persist(settingsState)
}

export function toggleFacebook() {
  settingsState.fbConnected = !settingsState.fbConnected
  persist(settingsState)
}

export function toggleGoogle() {
  settingsState.googleConnected = !settingsState.googleConnected
  persist(settingsState)
}

export function useSettings() {
  return useSnapshot(settingsState)
}
