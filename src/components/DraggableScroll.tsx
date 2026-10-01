import { useEffect, useRef, useState } from 'react'

const DraggableScroll = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault() // Prevents unwanted text selection
    setIsDragging(true)
    setStartX(e.clientX)
    setScrollLeft(scrollRef.current?.scrollLeft || 0)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return
    const walk = (e.clientX - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => setIsDragging(false)

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setScrollLeft(scrollRef.current?.scrollLeft || 0)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return
    const walk = (e.touches[0].clientX - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleWheel = (e: WheelEvent) => {
    if (!scrollRef.current) return

    // Prevent default vertical scrolling
    e.preventDefault()

    // Stop the event from propagating to the parent
    e.stopPropagation()

    // Translate vertical scroll delta to horizontal scroll
    scrollRef.current.scrollLeft += e.deltaY
  }

  // Check if the device is touch-enabled
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }

  // Add a passive: false event listener to ensure preventDefault() works
  useEffect(() => {
    const scrollElement = scrollRef.current

    // Only add the wheel event listener if it's not a touch device
    if (scrollElement && !isTouchDevice()) {
      scrollElement.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      if (scrollElement && !isTouchDevice()) {
        scrollElement.removeEventListener('wheel', handleWheel)
      }
    }
  }, [])

  return (
    <div
      ref={scrollRef}
      className="mt-3 flex cursor-grab items-center gap-3 overflow-x-auto pb-2 active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {children}
    </div>
  )
}

export default DraggableScroll
