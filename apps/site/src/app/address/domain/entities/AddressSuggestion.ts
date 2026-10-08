export interface AddressSuggestion {
  id: string;
  label: string;
  name: string;
  postalCode: string;
  city: string;
}

export const minimumAddressQueryLength = 3;

const searchableQueryStart = /^[\p{L}\d]/u;

export const isSearchableAddressQuery = (query: string): boolean => {
  const trimmed = query.trim();
  return trimmed.length >= minimumAddressQueryLength && searchableQueryStart.test(trimmed);
};

export const addressLineOf = (suggestion: AddressSuggestion): string =>
  suggestion.name === suggestion.city ? suggestion.city : `${suggestion.name}, ${suggestion.city}`;
