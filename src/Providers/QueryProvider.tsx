"use client"
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query'


export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            // retry: false,
            staleTime: 1000 * 60 * 5,
        },
    },
});

const QueryProvider = ({
    children
}: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider
            client={queryClient}
        >
            {children}
        </QueryClientProvider>
    )
}

export default QueryProvider
