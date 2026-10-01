import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/store/AppState';
import { AppDispatch } from '@/store/makeStore';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
