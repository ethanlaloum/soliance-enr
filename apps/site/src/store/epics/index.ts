import { Action } from '@reduxjs/toolkit';
import { combineEpics, Epic } from 'redux-observable';
import { AppState } from '@/store/AppState';
import { Dependencies } from '@/store/dependencies.interface';
import { leadEpics } from '@/store/epics/leadEpics';

export const allEpics = [...leadEpics] as unknown as Epic<Action, Action, AppState, Dependencies>[];

export const rootEpic = combineEpics<Action, Action, AppState, Dependencies>(...allEpics);
