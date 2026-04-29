import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ui/ProtectedRoute/ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import DashboardPage from "../pages/DashboardPage";
import MonthsPage from "../pages/MonthsPage";
import MonthDetailPage from "../pages/MonthDetailPage";
import CategoriesPage from "../pages/CategoriesPage";
import BudgetsPage from "../pages/BudgetsPage";
import SubcategoriesPage from "../pages/SubcategoriesPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "users/:userId/months", element: <MonthsPage /> },
          { path: "users/:userId/months/:monthId", element: <MonthDetailPage /> },
          { path: "users/:userId/budgets", element: <BudgetsPage /> },
          { path: "users/:userId/categories", element: <CategoriesPage /> },
          { path: "users/:userId/categories/:categoryId/subcategories", element: <SubcategoriesPage /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);

