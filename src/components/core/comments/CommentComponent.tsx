"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { usePostComment } from "@/services/Comment"
import { MessageSquare, Send, ChevronDown, ChevronUp, Bold, Italic, List } from "lucide-react"
import { queryClient } from "@/Providers/QueryProvider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { EnrichedComment } from "@/types/global"
import { useAuth } from "@/hooks/UserAuth"
import { redirect, usePathname } from "next/navigation"
import { Toggle } from "@/components/ui/toggle"
import DOMPurify from "isomorphic-dompurify"
import { toast } from "sonner"

const CommentComponent = ({
  documentId,
  comments,
  setIsCommentsOpen,
}: {
  documentId: string
  comments: EnrichedComment[]
  setIsCommentsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { user } = useAuth()
  const pathname = usePathname()
  const [newComment, setNewComment] = useState("")
  const { mutate: postComment, isLoading } = usePostComment()
  const [replyContent, setReplyContent] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [expandedComments, setExpandedComments] = useState<string[]>([])

  const handleAddComment = () => {
    if (!newComment.trim()) return

    if (!user) {
      redirect(`/login?redirect=${encodeURIComponent(pathname)}`)
    }

    postComment(
      {
        id: documentId,
        content: newComment,
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            queryClient.invalidateQueries(["get-comments", documentId])
            setNewComment("")
          }
        },
        onError: (error) => {
          console.error("Error posting comment:", error)
        },
      },
    )
  }

  const handleAddReply = (parentId: string) => {
    if (!replyContent.trim()) return
    if (!user) {
      redirect(`/login?redirect=${encodeURIComponent(pathname)}`)
    }

    postComment(
      {
        id: documentId,
        content: replyContent,
        parentCommentId: parentId,
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            queryClient.invalidateQueries(["get-comments", documentId])
            setReplyContent("")
            setReplyingTo(null)
            // Auto-expand replies when a new reply is added
            if (!expandedComments.includes(parentId)) {
              setExpandedComments([...expandedComments, parentId])
            }
          }
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "Failed to post reply"
          toast.error(message)
          console.error("Error posting reply:", error)
        },
      },
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", "")
  }

  const getInitials = (name: string) => {
    if (!name) return "unknown"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const toggleReplies = (commentId: string) => {
    if (expandedComments.includes(commentId)) {
      setExpandedComments(expandedComments.filter((id) => id !== commentId))
    } else {
      setExpandedComments([...expandedComments, commentId])
    }
  }

  const toggleReply = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId)
    setReplyContent("")
  }

  const organizeComments = (commentsArray: EnrichedComment[]) => {
    if (!Array.isArray(commentsArray)) return []

    // Map to hold comment ID to comment object (with replies array)
    const commentMap = new Map<string, EnrichedComment>()

    // Initialize map entries with empty replies array
    commentsArray.forEach((comment) => {
      commentMap.set(comment._id, { ...comment, replies: comment.replies || [] })
    })

    const topLevelComments: EnrichedComment[] = []

    // Assign replies to their parent comments
    commentsArray.forEach((comment) => {
      const parentId = comment.parentComment

      if (parentId && commentMap.has(parentId)) {
        commentMap.get(parentId)!.replies.push(commentMap.get(comment._id)!)
      } else {
        // It's a top-level comment
        topLevelComments.push(commentMap.get(comment._id)!)
      }
    })

    return topLevelComments
  }

  const organizedComments = organizeComments(comments)

  const renderFormattedText = (text: string) => {
    if (!text) return ""

    // Sanitize the input first
    let sanitizedText = DOMPurify.sanitize(text)

    // Format bold text: **text** to <strong>text</strong>
    sanitizedText = sanitizedText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Format italic text: *text* to <em>text</em>
    sanitizedText = sanitizedText.replace(/\*(.*?)\*/g, "<em>$1</em>")

    // Format bullet points: - item to <li>item</li>
    if (sanitizedText.includes("\n- ")) {
      const lines = sanitizedText.split("\n")
      let inList = false

      sanitizedText = lines
        .map((line) => {
          if (line.startsWith("- ")) {
            const item = line.substring(2)
            if (!inList) {
              inList = true
              return `<ul><li>${item}</li>`
            }
            return `<li>${item}</li>`
          } else {
            if (inList) {
              inList = false
              return `</ul>${line}`
            }
            return line
          }
        })
        .join("\n")

      if (inList) {
        sanitizedText += "</ul>"
      }
    }

    // Replace newlines with <br>
    sanitizedText = sanitizedText.replace(/\n/g, "<br>")

    return sanitizedText
  }

  const renderComment = (comment: EnrichedComment) => {
    const hasReplies = comment.replies && comment.replies.length > 0
    const isExpanded = expandedComments.includes(comment._id)
    const isReplying = replyingTo === comment._id

    return (
      <div key={comment._id} className="border-b py-4 px-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 mt-1">
            <AvatarFallback className="bg-muted text-muted-foreground">
              {getInitials(comment?.author?.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-col">
              <div className="font-semibold">{comment?.author?.name}</div>
              <div className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</div>
            </div>

            <p className="mt-2 text-sm" dangerouslySetInnerHTML={{ __html: renderFormattedText(comment.content) }}></p>

            <div className="flex items-center justify-between mt-2">
              {hasReplies && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 px-2 text-muted-foreground flex items-center gap-1"
                  onClick={() => toggleReplies(comment._id)}
                >
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  <span>Replies ({comment.replies.length})</span>
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-3 ml-auto"
                disabled={isLoading}
                onClick={() => toggleReply(comment._id)}
              >
                Reply
              </Button>
            </div>

            {isReplying && (
              <div className="mt-2">
                <div className="border rounded-t-md p-2 flex gap-2 bg-muted/50">
                  <Toggle
                    size="sm"
                    aria-label="Toggle bold"
                    onClick={() => {
                      const selection = window.getSelection()
                      if (selection && selection.toString()) {
                        const selectedText = selection.toString()
                        const boldText = `**${selectedText}**`
                        const newText =
                          replyContent.substring(0, selection.anchorOffset) +
                          boldText +
                          replyContent.substring(selection.focusOffset)
                        setReplyContent(newText)
                      }
                    }}
                  >
                    <Bold className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    size="sm"
                    aria-label="Toggle italic"
                    onClick={() => {
                      const selection = window.getSelection()
                      if (selection && selection.toString()) {
                        const selectedText = selection.toString()
                        const italicText = `*${selectedText}*`
                        const newText =
                          replyContent.substring(0, selection.anchorOffset) +
                          italicText +
                          replyContent.substring(selection.focusOffset)
                        setReplyContent(newText)
                      }
                    }}
                  >
                    <Italic className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    size="sm"
                    aria-label="Toggle list"
                    onClick={() => {
                      setReplyContent((prev) => prev + "\n- ")
                    }}
                  >
                    <List className="h-4 w-4" />
                  </Toggle>
                </div>
                <Textarea
                  placeholder={`Reply to ${comment.author.name}... Use **bold**, *italic*, or - for bullet points`}
                  className="min-h-[60px] text-sm rounded-t-none"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setReplyingTo(null)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleAddReply(comment._id)}
                    disabled={!replyContent.trim() || isLoading}
                  >
                    Reply
                  </Button>
                </div>
              </div>
            )}

            {hasReplies && isExpanded && (
              <div className="mt-3 pl-6 border-l border-muted">
                {comment.replies.map((reply) => (
                  <div key={reply._id} className="py-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                          {getInitials(reply?.author?.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex flex-col">
                          <div className="font-medium text-sm">{reply?.author.name}</div>
                          <div className="text-xs text-muted-foreground">{formatDate(reply?.createdAt)}</div>
                        </div>

                        <p
                          className="mt-1 text-sm"
                          dangerouslySetInnerHTML={{ __html: renderFormattedText(reply?.content) }}
                        ></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full md:w-[500px] bg-background border-l z-10 flex flex-col">

      <div className="p-4 border-b flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h2 className="font-medium flex items-center gap-2">
          Comments ({comments?.length || 0})
          {isLoading && (
            <span className="inline-block w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
          )}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden"
          onClick={() => setIsCommentsOpen(false)}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>


      <div className="flex-1 overflow-auto">
        {comments && comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
            <p className="text-muted-foreground">No comments yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">{organizedComments.map(renderComment)}</div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="relative">
          <div className="border rounded-t-md p-2 flex gap-2 bg-muted/50">
            <Toggle
              size="sm"
              aria-label="Toggle bold"
              onClick={() => {
                const selection = window.getSelection()
                if (selection && selection.toString()) {
                  const selectedText = selection.toString()
                  const boldText = `**${selectedText}**`
                  const newText =
                    newComment.substring(0, selection.anchorOffset) +
                    boldText +
                    newComment.substring(selection.focusOffset)
                  setNewComment(newText)
                }
              }}
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              aria-label="Toggle italic"
              onClick={() => {
                const selection = window.getSelection()
                if (selection && selection.toString()) {
                  const selectedText = selection.toString()
                  const italicText = `*${selectedText}*`
                  const newText =
                    newComment.substring(0, selection.anchorOffset) +
                    italicText +
                    newComment.substring(selection.focusOffset)
                  setNewComment(newText)
                }
              }}
            >
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              aria-label="Toggle list"
              onClick={() => {
                setNewComment((prev) => prev + "\n- ")
              }}
            >
              <List className="h-4 w-4" />
            </Toggle>
          </div>
          <Textarea
            placeholder="Add a comment... Use **bold**, *italic*, or - for bullet points"
            className="min-h-[80px] pr-12 resize-none rounded-t-none"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            size="icon"
            className="absolute bottom-2 right-2 h-8 w-8"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CommentComponent
