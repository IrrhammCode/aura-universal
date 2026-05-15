'use client'

import { useState } from 'react'

export default function VideoPlayer({ url, poster, jobId }: { url: string, poster: string, jobId: string }) {
  const [hasTracked, setHasTracked] = useState(false)

  const handlePlay = async () => {
    if (!hasTracked) {
      setHasTracked(true)
      try {
        await fetch(`/api/video/track?jobId=${jobId}`, { method: 'POST' })
      } catch (e) {
        console.error("Failed to track video view", e)
      }
    }
  }

  return (
    <video 
       src={url} 
       controls 
       autoPlay 
       onPlay={handlePlay}
       className="w-full h-full object-cover"
       poster={poster}
    />
  )
}
