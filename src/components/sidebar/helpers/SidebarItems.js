import {
  AccountBox,
  Add,
  Group,
  GroupAdd,
  Home,
  RateReviewSharp,
} from "@material-ui/icons";
import React from "react";

export const ADMIN_SIDEBAR_LINKS = [
  {
    id: 0,
    label: "Home",
    link: "dashboard",
    iconComponent: <Home fontSize="small" />,
  },
  {
    id: 1,
    label: "Manage Product Review",
    link: "product-review",
    iconComponent: <RateReviewSharp fontSize="small" />,
  },
  {
    id: 2,
    label: "Manage Users",
    link: "users",
    iconComponent: <GroupAdd fontSize="small" />,
  },
];

export const SELLER_SIDEBAR_LINKS = [
  {
    id: 0,
    label: "Home",
    link: "dashboard",
    iconComponent: <Home fontSize="small" />,
  },
  {
    id: 1,
    label: "Add Product",
    link: "add-product",
    iconComponent: <Add fontSize="small" />,
  },
  {
    id: 2,
    label: "Order Management",
    link: "order-management",
    iconComponent: <AccountBox fontSize="small" />,
  },
];

export const USER_SIDEBAR_LINKS = [
  {
    id: 0,
    label: "Products",
    link: "/user/products",
    iconComponent: <Home fontSize="small" />,
  },
  {
    id: 1,
    label: "User Profile",
    link: "/user/user-profile",
    iconComponent: <Group fontSize="small" />,
  },
];
