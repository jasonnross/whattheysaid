import { useLocalObservable } from 'mobx-react';
import React from 'react';
import { createStore } from './mainStore';

const Context = React.createContext();

export const Provider = ({children}) => {
  const store = useLocalObservable(createStore);
  return <Context.Provider value={store}>
    {children}
  </Context.Provider>
}

export const useStore = () => React.useContext(Context);