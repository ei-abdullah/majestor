import {QueryClient, QueryCache, MutationCache} from "@tanstack/react-query";
import * as Sentry from "@sentry/react-native";
import {useNetworkErrorStore} from "@/src/stores/networkErrorStore";

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error: any, query) => {
            if (error?._sentryReported) return;
            if (error?.response?.status === 401 || error?.response?.status === 403) return;

            if (!error?.response || error?.response?.status >= 500) {
                useNetworkErrorStore.getState().setNetworkError(true);
                return;
            }

            Sentry.captureException(error, {
                extra: {
                    queryKey: query.queryKey,
                }
            });
        },
    }),
    mutationCache: new MutationCache({
        onError: (error: any, _variables, _context, mutation) => {
            if (error?._sentryReported) return;
            if (error?.response?.status === 401 || error?.response?.status === 403) return;

            Sentry.captureException(error, {
                extra: {
                    mutationKey: mutation.options.mutationKey,
                }
            });
        },
    }),
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 1000 * 60,
        }
    }
});
