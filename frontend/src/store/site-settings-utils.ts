import type { Setting } from '@/types/admin'

export function getSettingValue(settings: Setting[], key: string): string {
  return settings.find((setting) => setting.key === key)?.value ?? ''
}
