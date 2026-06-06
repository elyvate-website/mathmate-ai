import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { LEVEL_THRESHOLDS } from '@/constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLevelFromXP(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1
  }
  return 1
}

export function getXPForNextLevel(xp: number): { current: number; next: number; progress: number } {
  const level = getLevelFromXP(xp)
  const current = LEVEL_THRESHOLDS[level - 1] ?? 0
  const next    = LEVEL_THRESHOLDS[level]    ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  const progress = next > current ? ((xp - current) / (next - current)) * 100 : 100
  return { current, next, progress: Math.min(progress, 100) }
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('bn-BD', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 80) return 'text-green-600'
  if (accuracy >= 60) return 'text-yellow-600'
  return 'text-red-500'
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function chapterEmoji(chapterNum: number): string {
  const emojis = ['📐','📊','🔢','📈','⚖️','📏','🔷','⭕','📐','🏔️','⚖️','🔗','∞','🔍','📐','📦','📊']
  return emojis[(chapterNum - 1) % emojis.length]
}
