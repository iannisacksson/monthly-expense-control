import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import FamiliesPage from "../pages/FamiliesPage";
import FamilyMembersPage from "../pages/FamilyMembersPage";
import MonthsPage from "../pages/MonthsPage";
import MonthDetailPage from "../pages/MonthDetailPage";
import CategoriesPage from "../pages/CategoriesPage";
import BudgetsPage from "../pages/BudgetsPage";
import SubcategoriesPage from "../pages/SubcategoriesPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "users/:userId/months", element: <MonthsPage /> },
      { path: "users/:userId/months/:monthId", element: <MonthDetailPage /> },
      { path: "users/:userId/categories", element: <CategoriesPage /> },
      { path: "users/:userId/categories/:categoryId/subcategories", element: <SubcategoriesPage /> },
      { path: "families", element: <FamiliesPage /> },
      { path: "families/:familyId/members", element: <FamilyMembersPage /> },
      { path: "families/:familyId/months", element: <MonthsPage /> },
      { path: "families/:familyId/months/:monthId", element: <MonthDetailPage /> },
      { path: "families/:familyId/budgets", element: <BudgetsPage /> },
      { path: "families/:familyId/categories", element: <CategoriesPage /> },
      { path: "families/:familyId/categories/:categoryId/subcategories", element: <SubcategoriesPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
