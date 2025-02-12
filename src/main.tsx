import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "react-select-search/style.css";
import { Provider } from "react-redux";
import store from "./store.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
