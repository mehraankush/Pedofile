"use client"
import { useQuery } from "react-query"
import { getPdfById, getSharedDocumentById, getUserPdfs } from "./apiCalls"


export const useGetUserPdfs = () => {
    return useQuery({
        queryKey: ["get-user-pdf"],
        queryFn: getUserPdfs,
    })
}


export const useGetPdfById = (id: string) => {
    return useQuery({
        queryKey: ["get-pdf-by-id", id],
        queryFn: () => getPdfById(id),
        enabled: !!id,
    })
}


export const useGetSharedDocumentById = (id: string) => {
    return useQuery({
        queryKey: ["get-shared-document-by-id", id],
        queryFn: () => getSharedDocumentById(id),
        enabled: !!id,
    })
}

