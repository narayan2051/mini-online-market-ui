import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import ReactNotification from 'react-notifications-component';
import { Router, Switch } from "react-router-dom";
import "./assets/scss/app.scss";
import Footer from "./components/footer/Footer";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/scroll-to-top/ScrollToTop";
import SellerDashboard from "./components/seller/SellerDashboard";
import AdminDashboard from "./pages/admin/dashboard/Dashboard";
import Login from "./pages/public/login/Login";
import NotAuthorized from "./pages/public/not-authorized/NotAuthorized";
import GlobalPageNotFound from "./pages/public/not-found/GlobalPageNotFound";
import UserDashboard from "./pages/user/dashboard/Dashboard";
import Route from "./routes/Route";
import history from "./services/history";

export default function App() {
  return (
    <>
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
            <Route exact path="/admin/dashboard" component={AdminDashboard} isPrivate />

            <Route component={GlobalPageNotFound} isWrongLink />
          </Switch>
        </Layout>
      </Router>
      <Footer />
      <ScrollToTop />
    </>
  );
}
