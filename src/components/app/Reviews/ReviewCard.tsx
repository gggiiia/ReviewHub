import {TypographyP} from "@/components/ui/Typography.tsx"
import {MessageSquare, Share2, Star} from "lucide-react"
import {Button} from "@/components/ui/button.tsx"
import {ReplyDialog} from "@/components/app/Reviews/ReplyDialog.tsx"
import {ShareDialog} from "@/components/app/Reviews/ShareDialog.tsx"

export interface ReviewItem {
  id: string
  author: string
  rating: number // 1-5
  date: string // ISO or friendly
  text: string | null
  reply?: string | null
  source: "google" | "facebook"
}

function Stars({ value }: { value: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < value)
  return (
    <div className="flex items-center gap-1" aria-label={`${value} out of 5 stars`}>
      {stars.map((filled, idx) => (
        <Star key={idx} className={`size-4 ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
      ))}
    </div>
  )
}

export interface ReviewCardProps {
  review: ReviewItem
  onShare?: (review: ReviewItem) => void
  onReplySubmit?: (review: ReviewItem, reply: string) => Promise<void> | void
}

function SourceBadge({ source }: { source: "google" | "facebook" }) {
  const isGoogle = source === "google"
  return (
    <span className="inline-flex items-center gap-1 rounded-xs px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
      {isGoogle ? (
        // Minimal Google G logo (四色 G)
        <svg width="18" height="18" viewBox="0 0 256 262" aria-hidden="true">
          <path fill="#4285F4" d="M255.9 133.5c0-10.7-.9-18.5-2.9-26.6H130.5v48.3h71.9c-1.4 12-9 30.1-25.9 42.3l-.2 1.6 37.6 29 2.6.3c24-22.1 38.4-54.7 38.4-95z"/>
          <path fill="#34A853" d="M130.5 261.1c34.5 0 63.5-11.3 84.6-30.7l-40.3-31.1c-10.8 7.5-25.3 12.7-44.3 12.7-33.8 0-62.5-22.1-72.8-52.7l-1.5.1-39.4 30.4-.5 1.4c20.9 41.5 63.9 69.9 114.2 69.9z"/>
          <path fill="#FBBC05" d="M57.7 159.2c-2.7-8-4.3-16.5-4.3-25.2s1.6-17.2 4.2-25.2l-.1-1.7-39.8-30.8-1.3.6C7.1 95.2 0 117.2 0 134c0 16.8 7.1 38.8 16.4 57.1l41.3-32z"/>
          <path fill="#EA4335" d="M130.5 50.5c24 0 40.1 10.4 49.3 19l36-35.2C193.8 12.1 165 0 130.5 0 80.2 0 37.2 28.4 16.4 69.8l41.3 32c10.3-30.6 39-51.3 72.8-51.3z"/>
        </svg>
      ) : (
        // Minimal Facebook f logo in a circle
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="12" fill="#1877F2" />
          <path d="M13.5 12h2l.3-2.3H13.5V8.6c0-.7.2-1.1 1.2-1.1h1.1V5.4c-.2 0-.9-.1-1.7-.1-1.7 0-2.9 1-2.9 3v1.4H9v2.3h2.2v6.2h2.3V12z" fill="#fff"/>
        </svg>
      )}
      <span>{isGoogle ? "Google" : "Facebook"}</span>
    </span>
  )
}

export function ReviewCard({ review, onReplySubmit }: ReviewCardProps) {
  const hasReply = !!(review.reply && review.reply.trim().length > 0)

  return (
    <div className="border rounded-md p-3 hover:bg-accent/40 transition-colors">
      <div className="flex items-start gap-3">
        <div className="size-10 shrink-0 rounded bg-muted flex items-center justify-center font-medium">
          {review.author.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 w-full">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium truncate max-w-[50%]">{review.author}</span>
            <span className="text-muted-foreground text-xs">{new Date(review.date).toLocaleDateString()}</span>
            <SourceBadge source={review.source} />
          </div>
          <div className="mt-1">
            <Stars value={review.rating} />
          </div>

          {review.text ? (
            <TypographyP className="mt-2 text-sm text-foreground/90 break-words">
              {review.text}
            </TypographyP>
          ) : (
            <TypographyP className="mt-2 text-sm text-muted-foreground italic" aria-label="the review is empty">
              the review is empty
            </TypographyP>
          )}

          {hasReply ? (
            <div className="mt-3 border rounded-md bg-primary/5 p-2">
              <div className="text-xs text-muted-foreground mb-1">Reply</div>
              <p className="text-sm leading-relaxed">{review.reply}</p>
            </div>
          ) : null}

          <div className="mt-3 flex items-center gap-2 justify-end">
            {review.text && review.text.trim().length > 0 && (
              <ShareDialog
                review={{
                  author: review.author,
                  rating: review.rating,
                  date: review.date,
                  text: review.text,
                }}
              >
                <Button variant="ghost" size="sm">
                  <Share2 className="size-4" />
                  Share
                </Button>
              </ShareDialog>
            )}
            {!hasReply && (
              <ReplyDialog review={review} onSubmit={onReplySubmit}>
                <Button size="sm">
                  <MessageSquare className="size-4" />
                  Reply
                </Button>
              </ReplyDialog>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard
