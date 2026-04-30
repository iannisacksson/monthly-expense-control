import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { queryClient } from "./config/query-client";
import { useBootstrapAuth } from "./hooks/useAuth";
import { router } from "./routes/app.routes";

function AppRouter() {
  useBootstrapAuth();

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
}
