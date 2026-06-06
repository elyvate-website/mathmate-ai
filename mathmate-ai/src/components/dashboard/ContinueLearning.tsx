'use client'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface ContinueLearningProps {
  chapterName:  string
  topicName:    string
  progress:     number
  lessonsTotal: number
  lessonsDone:  number
  href:         string
}

export function ContinueLearning({ chapterName, topicName, progress, lessonsTotal, lessonsDone, href }: ContinueLearningProps) {
  return (
    <Link href={href} className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-gradient flex items-center justify-center text-2xl flex-shrink-0">
          📐
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-400 text-xs mb-0.5">{chapterName}</p>
          <p className="font-black text-gray-900 text-sm truncate">{topicName}</p>
          <div className="mt-2 bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-purple-gradient h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-400 text-xs mt-1">{lessonsDone}/{lessonsTotal} Lessons</p>
        </div>
        <ChevronRight size={20} className="text-brand-primary flex-shrink-0" />
      </div>
    </Link>
  )
}
