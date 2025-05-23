import { QueryClientConfig } from "@tanstack/react-query";
import { queryRetry } from "@/utils/query";

const reactQueryConfig: QueryClientConfig = {
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: queryRetry(3),
            staleTime: 60 * 1000 // 1 minute
        }
    }
};

export default reactQueryConfig;
