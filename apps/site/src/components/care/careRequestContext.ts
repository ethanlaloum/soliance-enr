import { createContext } from 'react';
import { CareRequestType } from '@/components/care/careRequestSchema';

export const CareRequestContext = createContext<(requestType: CareRequestType) => void>(() => undefined);
