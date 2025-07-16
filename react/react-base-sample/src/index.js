import React, {StrictMode} from "react";
import { createRoot } from "react-dom/client";
import AppComponent from "./AppComponent";
import ErrorBoundary from "react-shared-bundle/ErrorBoundary";
import GlobalSessionManager from "react-shared-bundle/GlobalSessionManager";

const cssId = 'tailwind-shared-css';
if (!document.getElementById(cssId)) {
  const head = document.head;
  const link = document.createElement('link');

  link.id = cssId;
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = '/o/react-shared-bundle/css/styles.css';
  link.media = 'all';

  head.appendChild(link);
}

export default function main(params) {
  const container = document.getElementById(params.portletElementId);

  if (!container) {
    console.error("Container do portlet não encontrado:", params.portletElementId);
    return;
  }

  const root = createRoot(container);

  root.render(
    <div className="conteudo-pagina">
            <div className="conteudo-pagina-interno p-5">
            <StrictMode>
                <GlobalSessionManager>
                    <ErrorBoundary>
                        <AppComponent
                            portletNamespace={params.portletNamespace}
                            contextPath={params.contextPath}
                            portletElementId={params.portletElementId}
                            configuration={params.configuration}
                        />
                    </ErrorBoundary>
                </GlobalSessionManager>
            </StrictMode>
        </div>
    </div>
  );
}