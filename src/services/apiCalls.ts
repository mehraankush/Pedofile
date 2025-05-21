
import axios from 'axios';

export const getUserPdfs = async () => {
    try {
        const res = await fetch('/api/pdf/get-user-pdfs', {
            method: 'GET',
        })
        const data = await res.json();
        return data.data
    } catch (error) {
        console.log(error)
        return null
    }
}


export const getPdfById = async (id: string) => {
    try {
        console.log("id", id)
        const res = await axios.get(`/api/pdf/get-by-id/${id}`);
        return res.data.data
    } catch (error) {
        console.log(error)
        return null
    }
}

export interface ApiError {
    status: number;
    message: string;
  }

export const getSharedDocumentById = async (id: string) => {
    try {
        const res = await axios.get(`/api/share?id=${id}`);
        console.log("res", res)
        return res.data.data

    } catch (error: ApiError | unknown) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Failed to fetch shared document.";
            const status = error.response?.status || 500;

            throw {
                status,
                message,
            } as ApiError;
        }

        throw {
            status: 500,
            message: "An unexpected error occurred.",
        } as ApiError;
    }
}

// comments 

export const getComments = async (documentId: string) => {
    try {
        const res = await axios.get(`/api/comment?id=${documentId}`);
        return res.data.comments
    } catch (error) {
        console.log(error)
        return null
    }
}


export const postComment = async (data: { id: string, content: string, parentCommentId?: string }) => {
    try {
        const res = await axios.post('/api/comment', data);
        return res.data
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getCommentReplies = async (commentId: string) => {
    try {
        const res = await axios.get(`/api/comment/parent?id=${commentId}`);
        return res.data.comments
    } catch (error) {
        console.log(error)
        return null
    }
}