import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Props { chapterName: string; topicName: string; progress: number; lessonsTotal: number; lessonsDone: number; href: string }

export function ContinueLearning({ chapterName, topicName, progress, href }: Props) {
  return (
    <Link href={href} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-ninja-border active:scale-95 transition-transform block">
      <div className="w-14 h-14 rounded-xl bg-brand-light flex items-center justify-center text-2xl flex-shrink-0">📐</div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-ninja-text text-sm truncate">{topicName}</p>
        <p className="text-brand-primary text-xs font-semibold mt-0.5">{chapterName} • In Progress</p>
        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#2D7A3A,#3DAE4F)', width: `${progress}%` }} />
        </div>
      </div>
      <ChevronRight size={18} className="text-ninja-muted flex-shrink-0" />
    </Link>
  )
}
