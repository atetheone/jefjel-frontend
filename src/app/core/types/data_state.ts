export type DataState<T> = {
  status: 'idle' | 'loading' | 'success' | 'error';
  data?: T;
  error: string | null;
};