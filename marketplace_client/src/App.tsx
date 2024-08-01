import { NextUIProvider } from "@nextui-org/react"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import ScrollToTop from "components/common/ScrollToTop"
import { Suspense } from "react"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "sonner"
import PageLoading from "./components/common/PageLoading"
import { queryClient } from "./configs/queryClient"
import Routes from "./routes"

export default function App() {
  return (
    <BrowserRouter>
      <NextUIProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<PageLoading />}>
              <ScrollToTop />
              <Routes />
            </Suspense>
            <ReactQueryDevtools />
            <Toaster position="bottom-right" richColors />
          </QueryClientProvider>
        </GoogleOAuthProvider>
      </NextUIProvider>
    </BrowserRouter>
  )
}
