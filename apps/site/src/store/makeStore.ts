import { Action, configureStore } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import { AppState } from '@/store/AppState';
import { coreReducer } from '@/store/coreReducer';
import { Dependencies } from '@/store/dependencies.interface';
import { rootEpic } from '@/store/epics';

export const makeStore = (dependencies: Dependencies) => {
  const epicMiddleware = createEpicMiddleware<Action, Action, AppState, Dependencies>({ dependencies });

  const store = configureStore({
    reducer: { core: coreReducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false }).concat(epicMiddleware),
  });

  epicMiddleware.run(rootEpic);

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
