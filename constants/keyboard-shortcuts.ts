// Keyboard shortcuts

export const KEYBOARD_SHORTCUTS = {
  search: { key: "k", modifiers: ["ctrl"] as const, label: "Search" },
  routinePage: { key: "r", modifiers: ["g"] as const, label: "Go to Routine" },
  builderPage: { key: "b", modifiers: ["g"] as const, label: "Go to Builder" },
  schedulerPage: { key: "s", modifiers: ["g"] as const, label: "Go to Scheduler" },
  export: { key: "e", modifiers: ["shift"] as const, label: "Export" },
  closeModal: { key: "Escape", modifiers: [] as const, label: "Close" },
  toggleTheme: { key: "t", modifiers: ["ctrl", "shift"] as const, label: "Toggle Theme" },
} as const

export function formatShortcut(shortcut: { key: string; modifiers: readonly string[] }): string {
  const parts = [...shortcut.modifiers.map(m => m.charAt(0).toUpperCase() + m.slice(1)), shortcut.key.toUpperCase()]
  return parts.join(" + ")
}
