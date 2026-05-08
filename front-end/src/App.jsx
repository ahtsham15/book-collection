// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import LoginPage from "./router/login/page";
// import { AuthWrapper } from "./lib/auth/authWrapper";
// export const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URL;

// console.log(API_BASE_URL);
// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/" element={<LoginPage />} /> {/* Redirect to login for now */}
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/api/queryClient";
import LoginPage from "./router/login/page";
import { AuthProvider } from "./lib/auth/authContext";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<LoginPage />} />
            {/* Add your protected routes here */}
            {/* <Route path="/dashboard" element={<AuthWrapper><DashboardPage /></AuthWrapper>} /> */}
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;