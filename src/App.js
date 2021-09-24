import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import ReactNotification from "react-notifications-component";
import { Router, Switch } from "react-router-dom";
import "./assets/scss/app.scss";
import Footer from "./components/footer/Footer";
import Layout from "./components/layout/Layout";
import AdminDashboard from "./pages/admin/dashboard/Dashboard";
import ProductReview from "./pages/admin/product-review/ProductReview";
import Users from "./pages/admin/users/Users";
import Login from "./pages/public/login/Login";
import NotAuthorized from "./pages/public/not-authorized/NotAuthorized";
import GlobalPageNotFound from "./pages/public/not-found/GlobalPageNotFound";
import AddProduct from "./pages/seller/add-product/AddProduct";
import SellerDashboard from "./pages/seller/dashboard/SellerDashboard";
import OrderManagement from "./pages/seller/order-manage/OrderManagement";
import UserDashboard from "./pages/user/dashboard/Dashboard";
import UserProfile from "./pages/user/user-profile/UserProfile";
import Products from "./pages/user/products/Products";
import Route from "./routes/Route";
import history from "./services/history";
import SingleOrder from "./pages/user/order-history/SingleOrder";
import Checkout from "./pages/user/checkout/Checkout";
import Payment from "./pages/user/checkout/Payment";
import OrderDetail from "./pages/seller/order-detail/OrderDetail";
import SignUp from "./pages/sign-up/SignUp";
import Review from "./pages/user/order-history/Review";

export default function App() {
  return (
    <div>
      <ReactNotification />
      <Router history={history}>
        <CssBaseline />
        <Layout>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/signup" component={SignUp} />
            <Route
              exact
              path="/page-not-found"
              component={GlobalPageNotFound}
              isWrongLink
            />
            <Route
              exact
              path="/user-not-authorized"
              component={NotAuthorized}
            />
            <Route
              exact
              path="/page-not-found"
              component={GlobalPageNotFound}
              isWrongLink
            />
            <Route
              exact
              path="/user-not-authorized"
              component={NotAuthorized}
            />

            <Route exact path="/user/products" component={Products} isPrivate />
            <Route exact path="/user/checkout" component={Checkout} isPrivate />
            <Route exact path="/user/payment" component={Payment} isPrivate />
            <Route exact path="/user/review" component={Review} isPrivate />
            <Route
              exact
              path="/seller/dashboard"
              component={SellerDashboard}
              isPrivate
            />
            <Route
              exact
              path="/seller/add-product"
              component={AddProduct}
              isPrivate
            />
            <Route
              exact
              path="/seller/dashboard"
              component={SellerDashboard}
              isPrivate
            />
            <Route
              exact
              path="/seller/add-product"
              component={AddProduct}
              isPrivate
            />
            <Route
              exact
              path="/seller/order-management"
              component={OrderManagement}
              isPrivate
            />
            <Route
              exact
              path="/seller/orderDetail"
              component={OrderDetail}
              isPrivate
            />
            <Route
              exact
              path="/admin/dashboard"
              component={AdminDashboard}
              isPrivate
            />
            <Route
              exact
              path="/admin/product-review"
              component={ProductReview}
              isPrivate
            />
            <Route exact path="/admin/users" component={Users} isPrivate />
            <Route
              exact
              path="/user/user-profile/"
              component={UserProfile}
              isPrivate
            />
            <Route
              exact
              path="/user/singleorder"
              component={SingleOrder}
              isPrivate
            />
            <Route component={GlobalPageNotFound} isWrongLink />
          </Switch>
        </Layout>
      </Router>
      <Footer />
    </div>
  );
}
