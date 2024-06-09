import UAParser from 'ua-parser-js'

export enum PlatformType {
  Windows = 'Windows',
  MacOS = 'macOS',
  Linux = 'Linux',
  Desktop = 'Desktop'
}
const parser = UAParser()
const { os } = parser
export const isWindows = os.name === 'Windows'
export const isMacOS = os.name === 'Mac OS'
export const isLinux = ['Ubuntu', 'Mint', 'Fedora', 'Debian', 'Arch', 'Linux'].includes(
  os.name ?? ''
)
export const getPlatformType = (): PlatformType => {
  if (isWindows) return PlatformType.Windows
  if (isMacOS) return PlatformType.MacOS
  if (isLinux) return PlatformType.Linux
  return PlatformType.Desktop
}
export const getPlatformTypeSrc = (selectedPlatformType: PlatformType): string => {
  return {
    [PlatformType.Windows]: import.meta.glob<{ default: string }>('../assets/Windows.svg', {
      query: '?url',
      eager: true
    })['../assets/Windows.svg'].default, // (await import('../assets/Windows.svg?url')).default,
    [PlatformType.MacOS]: import.meta.glob<{ default: string }>('../assets/MacOS.svg', {
      query: '?url',
      eager: true
    })['../assets/MacOS.svg'].default,
    [PlatformType.Linux]: import.meta.glob<{ default: string }>('../assets/Linux.svg', {
      query: '?url',
      eager: true
    })['../assets/Linux.svg'].default,
    [PlatformType.Desktop]: import.meta.glob<{ default: string }>('../assets/Linux.svg', {
      query: '?url',
      eager: true
    })['../assets/Linux.svg'].default
  }[selectedPlatformType]
}
