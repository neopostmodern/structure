declare const VERSION: string;
declare const BACKEND_URL: string;
declare const WEB_FRONTEND_HOST: string;

declare interface Window {
  __APOLLO_CLIENT__?: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;

  electron: {
    ipcRenderer: {
      toggleDevTools: () => void;
      restart: () => void;
      on: (channel: string, callback: (...args: any) => void) => void;
      once: (channel: string, callback: (...args: any) => void) => void;
    };
    clipboard: {
      readText: () => string;
    };
  };
}
