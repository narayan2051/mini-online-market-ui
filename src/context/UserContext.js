import React from "react";
import { AppUtils } from "../utils/appUtils";
import { ALL_ROLES, LOGIN_FAILURE, LOGIN_SUCCESS, LOGOUT_SUCCESS } from "../utils/constants/index";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, isAuthenticated: true, userRole: AppUtils.getUserRole() };
    case LOGOUT_SUCCESS:
    case LOGIN_FAILURE:
      return { ...state, isAuthenticated: false, userRole: null };

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!ALL_ROLES.find(obj => obj.value === AppUtils.getUserRole()),
    userRole: AppUtils.getUserRole()
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch };
