declare const __VERSION__: string;
declare const __BACKEND_URL__: string;
declare const __DEBUG_PROD__: string;
declare const __BUILD_TARGET__: 'web' | 'electron_renderer';

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
