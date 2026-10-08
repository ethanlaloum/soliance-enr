import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/redux';
import { resetSearchAddressesState, searchAddressesRequested } from '@/app/address/domain/use-cases/search-addresses/searchAddressesEpic';
import { selectAddressSuggestions } from '@/selectors/address/addressSelectors';

export const useAddressAutocomplete = () => {
  const dispatch = useAppDispatch();
  const suggestions = useAppSelector(selectAddressSuggestions);

  useEffect(
    () => () => {
      dispatch(resetSearchAddressesState());
    },
    [dispatch],
  );

  const search = useCallback((query: string) => dispatch(searchAddressesRequested({ query })), [dispatch]);
  const clear = useCallback(() => dispatch(resetSearchAddressesState()), [dispatch]);

  return { suggestions, search, clear };
};
