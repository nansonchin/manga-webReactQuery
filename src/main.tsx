import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      staleTime:0, //testing performance purpos
      // staleTime:1000 * 60 * 2,
      gcTime: 1000 * 60 *30,
      retry:2,
      refetchOnWindowFocus:false,
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  </StrictMode>,
)
