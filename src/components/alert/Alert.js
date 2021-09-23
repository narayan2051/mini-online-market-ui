import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

// For API reference: https://github.com/teodosii/react-notifications-component
export default function AddAlertMessage({ type, message, container, ...rest }) {
  store.addNotification({
    type: type === "error" ? "danger" : type,
    message: message,
    container: container ? container : "top-right",
    dismiss: {
      duration: rest.duration ? rest.duration : 5000,
      showIcon: true,
      touch: true,
      click: false,
      pauseOnHover: true,
      onScreen: true,
    },
    ...rest
  });
}