import { AppState } from '@/store/AppState';

export const selectAddressSuggestions = (state: AppState) => state.core.address.address.suggestions;
