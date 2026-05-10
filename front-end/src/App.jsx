import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/api/queryClient";
import { AuthProvider } from "./lib/auth/authContext";

import LoginPage from "./router/login/page";
import { HomePage } from "./router/home/page";
import { BooksPage } from "./router/book/page";
import { AuthorPage } from "./router/author/page";
import { PublisherPage } from "./router/publisher/page";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/authors" element={<AuthorPage />} />
            <Route path="/publishers" element={<PublisherPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;