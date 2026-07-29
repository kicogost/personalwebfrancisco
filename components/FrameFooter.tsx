import { meditationForDate } from '@/content/meditations'
import { site } from '@/content/site'

/**
 * The bottom left of the frame: the name, and one line of Marcus Aurelius
 * chosen by the day of the year. That line is the whole of the stoic layer.
 *
 * Rendered after the content rather than inside SiteFrame, so that on mobile,
 * where nothing can be fixed, it falls at the end of the page where a footer
 * belongs.
 */
export default function FrameFooter() {
  return (
    <footer className="relative z-20 flex flex-col gap-6 px-6 pt-16 pb-10 md:fixed md:bottom-8 md:left-10 md:w-[var(--rail)] md:px-0 md:pt-0 md:pb-0">
      <p className="face-utility text-ink lowercase">
        {site.nameLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>

      <p className="face-utility face-utility-sm max-w-[24ch] text-ink-muted">
        {meditationForDate(new Date())}
      </p>
    </footer>
  )
}
