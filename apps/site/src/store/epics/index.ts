import { Action } from '@reduxjs/toolkit';
import { combineEpics, Epic } from 'redux-observable';
import { AppState } from '@/store/AppState';
import { Dependencies } from '@/store/dependencies.interface';
import { addressEpics } from '@/store/epics/addressEpics';
import { analyticsEpics } from '@/store/epics/analyticsEpics';
import { consentEpics } from '@/store/epics/consentEpics';
import { leadEpics } from '@/store/epics/leadEpics';

export const allEpics = [...leadEpics, ...consentEpics, ...analyticsEpics, ...addressEpics] as unknown as Epic<Action, Action, AppState, Dependencies>[];

export const rootEpic = combineEpics<Action, Action, AppState, Dependencies>(...allEpics);
