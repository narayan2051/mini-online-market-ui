import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import ReactNotification from 'react-notifications-component';
import { Router, Switch } from "react-router-dom";
import "./assets/scss/app.scss";
import Footer from "./components/footer/Footer";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/scroll-to-top/ScrollToTop";
import AdminDashboard from "./pages/admin/dashboard/Dashboard";
import ProductReview from "./pages/admin/product-review/ProductReview";
import Users from "./pages/admin/users/Users";
import Login from "./pages/public/login/Login";
import NotAuthorized from "./pages/public/not-authorized/NotAuthorized";
import GlobalPageNotFound from "./pages/public/not-found/GlobalPageNotFound";
import AddProduct from "./pages/seller/add-product/AddProduct";
import SellerDashboard from "./pages/seller/dashboard/SellerDashboard";
import UserDashboard from "./pages/user/dashboard/Dashboard";
import Route from "./routes/Route";
import history from "./services/history";

export default function App() {
  return (
    <div>
      <ReactNotification />
      <Router history={history}>
        <CssBaseline />
        <Layout>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/page-not-found" component={GlobalPageNotFound} isWrongLink />
            <Route exact path="/user-not-authorized" component={NotAuthorized} />
                
            <Route exact path="/user/dashboard" component={UserDashboard} isPrivate />
            <Route exact path="/seller/dashboard" component={SellerDashboard} isPrivate/>
            <Route exact path="/seller/add-product" component={AddProduct} isPrivate/>
            <Route exact path="/admin/dashboard" component={AdminDashboard} isPrivate />
            <Route exact path="/admin/product-review" component={ProductReview} isPrivate />
            <Route exact path="/admin/users" component={Users} isPrivate />

            <Route component={GlobalPageNotFound} isWrongLink />
          </Switch>
        </Layout>
      </Router>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
