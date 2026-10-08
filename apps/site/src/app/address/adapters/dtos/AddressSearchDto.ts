export interface AddressFeatureDto {
  properties: {
    id: string;
    label: string;
    name: string;
    postcode: string;
    city: string;
  };
}

export interface AddressSearchDto {
  features: AddressFeatureDto[];
}
