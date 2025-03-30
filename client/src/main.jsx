import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './state/store.js'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from './pages/error-pages/ErrorBoundary.jsx'
import AsyncErrorBoundary from './pages/error-pages/AsyncErrorBoundary.jsx'
export const queryClient=new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <ErrorBoundary> 
            <AsyncErrorBoundary>
              <App/>
            </AsyncErrorBoundary>
          </ErrorBoundary>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
)
