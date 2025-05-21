"use client"

import { useMutation, useQuery } from "react-query";
import { getCommentReplies, getComments, postComment } from "./apiCalls";


export const usePostComment = () => {
    return useMutation({
        mutationKey: ["post-comment"],
        mutationFn: postComment,
    });
}

export const useGetComments = (documentId: string) => {
    return useQuery({
        queryKey: ["get-comments", documentId],
        queryFn: () => getComments(documentId),
        enabled: !!documentId,
    });
}


export const useGetCommentRepliesById = (commentId: string) => {
    return useQuery({
        queryKey: ["get-commentreplies-by-id", commentId],
        queryFn: () => getCommentReplies(commentId),
        enabled: !!commentId,
    });
}