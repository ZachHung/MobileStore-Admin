import "./App.css";
import { NotFoundPage } from "./pages/NotFoundPage";
import SummaryPage from "./pages/SummaryPage";
import Dashboard from "./pages/Dashboard";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import OrdersPage from "./pages/OrdersPage";
import UsersPage from "./pages/UsersPage";
import ProductsPage from "./pages/ProductsPage";
import NewsPage from "./pages/NewsPage";
import CommentsPage from "./pages/CommentsPage";
import ReportSalesPage from "./pages/ReportSalesPage";
import ReportPopularPage from "./pages/ReportPopularPage";
import SignInSide from "./pages/LoginPage";
import { useSelector } from "react-redux";
import ProductsFormPage from "./pages/ProductsFormPage";

function App() {
  const user = useSelector((state) => state.current);
  return (
    <Routes>
      {/* Private Routes */}
      <Route path='*' element={user ? <Outlet /> : <Navigate to='/login' />}>
        <Route path='*' element={<NotFoundPage />} />
        <Route path='*' element={<Dashboard />}>
          <Route index element={<SummaryPage />} />
          <Route path='orders' element={<OrdersPage />} />
          <Route path='users' element={<UsersPage />} />
          <Route path='products' element={<ProductsPage />} />
          <Route path='news' element={<NewsPage />} />
          <Route path='comments' element={<CommentsPage />} />
          <Route path='sales' element={<ReportSalesPage />} />
          <Route path='popular' element={<ReportPopularPage />} />
          <Route path='products/add' element={<ProductsFormPage />} />
          <Route path='products/edit/:id' element={<ProductsFormPage edit />} />
        </Route>
      </Route>
      {/* Public Routes */}
      <Route
        path='/login'
        element={!user ? <SignInSide /> : <Navigate to='/' />}
      />
    </Routes>
  );
}

export default App;
