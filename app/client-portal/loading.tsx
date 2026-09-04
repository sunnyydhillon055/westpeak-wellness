import PageLoading from '@/components/PageLoading';

/* Shown while the server is still working. See components/PageLoading.tsx.
   The wording names what is being fetched rather than saying "loading" alone —
   a person waiting on your appointments is reassured by seeing that named back. */
export default function Loading() {
  return <PageLoading what="your appointments" />;
}
