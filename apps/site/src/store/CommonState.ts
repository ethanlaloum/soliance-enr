export type CommonState = {
  state: 'pending' | 'succeeded' | 'failed' | null;
  errorCode?: string;
};
