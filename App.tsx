import 'react-native-gesture-handler';
import React from 'react';
import RootNavigation from './src/navigation';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 3, refetchOnReconnect: true },
    mutations: { retry: 3 },
  },
});

const persister = createAsyncStoragePersister({ storage: AsyncStorage });

export default function App() {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <QueryClientProvider client={queryClient}>
        <RootNavigation />
      </QueryClientProvider>
    </PersistQueryClientProvider>
  );
}
