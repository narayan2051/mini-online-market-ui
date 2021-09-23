import React, { createContext, useContext, useReducer } from "react";
import { SIDEBAR_OPENED, TOGGLE_SIDEBAR } from "../utils/constants/index";

const LayoutStateContext = createContext();
const LayoutDispatchContext = createContext();

function layoutReducer(state, action) {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      localStorage.setItem(SIDEBAR_OPENED, !state.isSidebarOpened);
      return { ...state, isSidebarOpened: !state.isSidebarOpened };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function LayoutProvider({ children }) {
  var [state, dispatch] = useReducer(layoutReducer, {
    isSidebarOpened: localStorage.getItem(SIDEBAR_OPENED) !== "false",
  });
  return (
    <LayoutStateContext.Provider value={state}>
      <LayoutDispatchContext.Provider value={dispatch}>
        {children}
      </LayoutDispatchContext.Provider>
    </LayoutStateContext.Provider>
  );
}

function useLayoutState() {
  var context = useContext(LayoutStateContext);
  if (context === undefined) {
    throw new Error("useLayoutState must be used within a LayoutProvider");
  }
  return context;
}

function useLayoutDispatch() {
  var context = useContext(LayoutDispatchContext);
  if (context === undefined) {
    throw new Error("useLayoutDispatch must be used within a LayoutProvider");
  }
  return context;
}

function toggleSidebar(dispatch) {
  dispatch({
    type: TOGGLE_SIDEBAR,
  });
}
export { LayoutProvider, useLayoutState, useLayoutDispatch, toggleSidebar };
