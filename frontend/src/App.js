import { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Login from "./pages/Login/index.jsx";
import Home from "./pages/Home/index.jsx";
import CategoryForm from "./pages/Admin/Category/CategoryForm.jsx";
import CategoryList from "./pages/Admin/Category/CategoryList.jsx";
import ProductColorForm from "./pages/Admin/ProductColor/ProductColorForm.jsx";
import ProductColorList from "./pages/Admin/ProductColor/ProductColorList.jsx";
import AdminLayout from "./layouts/Admin/index";
import MaterialList from "./pages/Admin/Material/MaterialList";
import MaterialForm from "./pages/Admin/Material/MaterialForm";
import AddEmployee from "./pages/Admin/Employee/AddEmployee.jsx";
import EditEmployee from "./pages/Admin/Employee/EditEmployee.jsx";
import EmployeeList from "./pages/Admin/Employee/EmployeeList";
import CustomersList from "./pages/Admin/Customer/CustomersList.jsx";
import AddCustomer from "./pages/Admin/Customer/AddCustomer.jsx";
import EditCustomer from "./pages/Admin/Customer/EditCustomer.jsx";
import ProductsList from "./pages/Admin/Product/ProductsList.jsx";
import ProductForm from "./pages/Admin/Product/ProductForm.jsx";
import ProductCreateForm from "./pages/Admin/Product/ProductCreateForm.jsx";
import ProductUpdateForm from "./pages/Admin/Product/ProductUpdateForm.jsx";
import Attributes from "./pages/Admin/Attributes/index.jsx";
import FunctionList from "./pages/Admin/Functions/FunctionList.jsx";
import FunctionForm from "./pages/Admin/Functions/FunctionForm.jsx";
import StyleList from "./pages/Admin/Style/StyleList.jsx";
import StyleForm from "./pages/Admin/Style/StyleForm.jsx";
import WoodTypeList from "./pages/Admin/WoodType/WoodTypeList.jsx";
import WoodTypeForm from "./pages/Admin/WoodType/WoodTypeForm.jsx";
import LocationList from "./pages/Admin/Locations/LocationList.jsx";
import LocationForm from "./pages/Admin/Locations/LocationForm.jsx";
import CraftingTechniqueList from "./pages/Admin/CraftingTechnique/CraftingTechniqueList.jsx";
import CraftingTechniqueForm from "./pages/Admin/CraftingTechnique/CraftingTechniqueForm.jsx";
import PriceRangeList from "./pages/Admin/PriceRange/PriceRangeList.jsx";
import PriceRangeForm from "./pages/Admin/PriceRange/PriceRangeForm.jsx";
import FurnitureTypeList from "./pages/Admin/FurnitureType/FurnitureTypeList.jsx";
import FurnitureTypeForm from "./pages/Admin/FurnitureType/FurnitureTypeForm.jsx";
import DiscountManagement from "./pages/Admin/Discount/DiscountManagement.jsx";
import ProductDetail from "./pages/Home/ProductDetail/index.jsx";
import CustomerLayout from "./layouts/Customer/index.jsx"; // Import the new layout
import Cart from "./pages/Home/Cart/Cart.jsx";  // Import the Cart component
import AllProducts from "./pages/Home/AllProducts/AllProducts.jsx"; // Import AllProducts component
import SearchPage from "./pages/Home/SearchPage/SearchPage.jsx";
import StatsDashboard from "./pages/Admin/StatsDashboard/index.jsx";

import AutoInvoiceGeneration from "./pages/Admin/CounterSales/AutoInvoiceGeneration/index.jsx";
import DetailInvoice from "./pages/Admin/CounterSales/DetailInvoice/index.jsx";
import OrderManagement from "./pages/Admin/OrderManagement/index.jsx"; // Import OrderManagement component
const privateRoutes = [
  { path: "/admin/category/categoryForm", component: CategoryForm },
  { path: "/admin/categoryList", component: CategoryList },
  { path: "/admin/ProductColorForm", component: ProductColorForm },
  { path: "/admin/productColorList", component: ProductColorList },
  { path: "/admin/materialList", component: MaterialList },
  { path: "/admin/materialForm", component: MaterialForm },
  { path: "/admin/employeeList", component: EmployeeList },
  { path: "/admin/addEmployee", component: AddEmployee },
  { path: "/admin/editEmployee/:id", component: EditEmployee },
  { path: "/admin/customersList", component: CustomersList },
  { path: "/admin/addCustomer", component: AddCustomer },
  { path: "/admin/editCustomer/:id", component: EditCustomer },
  { path: "/admin/productsList", component: ProductsList },
  { path: "/admin/productForm", component: ProductForm },
  { path: "/admin/product/productCreateForm", component: ProductCreateForm },
  { path: "/admin/product/productUpdateForm/:id", component: ProductUpdateForm },
  { path: "/admin/attributes", component: Attributes },
  { path: "/admin/functionList", component: FunctionList },
  { path: "/admin/functionForm", component: FunctionForm },
  { path: "/admin/styleList", component: StyleList },
  { path: "/admin/styleForm", component: StyleForm },
  { path: "/admin/woodTypeList", component: WoodTypeList },
  { path: "/admin/woodTypeForm", component: WoodTypeForm },
  { path: "/admin/locationList", component: LocationList },
  { path: "/admin/locationForm", component: LocationForm },
  { path: "/admin/craftingTechniqueList", component: CraftingTechniqueList },
  { path: "/admin/craftingTechniqueForm", component: CraftingTechniqueForm },
  { path: "/admin/priceRangeList", component: PriceRangeList },
  { path: "/admin/priceRangeForm", component: PriceRangeForm },
  { path: "/admin/furnitureTypeList", component: FurnitureTypeList },
  { path: "/admin/furnitureTypeForm", component: FurnitureTypeForm },
  { path: "/admin/discountManagement", component: DiscountManagement },
  { path: "/admin/pos", component: AutoInvoiceGeneration },
  {path: "/admin/pos/detailInvoice/:id", component: DetailInvoice},
  {path: "/admin/pos/orderManagement", component: OrderManagement}, // New route for Order Management
  { path: "/admin/stats", component: StatsDashboard },

];

const publicRoutes = [
  { path: "/", component: Home },
  { path: "/product/:id", component: ProductDetail},
  { path: "/products", component: ProductsList },
  { path: "/about", component: () => <h1>Về Chúng Tôi</h1> },
  { path: "/contact", component: () => <h1>Liên Hệ</h1> },
  { path: "/cart", component: Cart},
  {path: "/products/:sectionType", component: AllProducts}, // New route for All Products
  { path: "/search", component: SearchPage }, // New route for Search Page
];

function App() {
  return (
    <div>
      <HelmetProvider>
      <Router>
        <Routes>
          {privateRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = AdminLayout;

            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = CustomerLayout;

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
      </HelmetProvider>
    </div>
  );
}

export default App;