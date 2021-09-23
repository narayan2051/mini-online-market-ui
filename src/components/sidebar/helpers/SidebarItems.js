import { Add, Assessment, Group, Home, Layers, Receipt, Search } from "@material-ui/icons";
import React from "react";

export const ADMIN_SIDEBAR_LINKS = [
  {
    id: 0,
    label: "Home",
    link: "dashboard",
    iconComponent: <Home fontSize="small" />
  },
  {
    id: 1,
    label: "Manage Product Review",
    link: "product-review",
    iconComponent: <Search fontSize="small" />
  },
  {
    id: 2,
    label: "Manage Users",
    link: "users",
    iconComponent: <Search fontSize="small" />
  }
];


export const SELLER_SIDEBAR_LINKS = [
  {
    id: 0,
    label: "Home",
    link: "dashboard",
    iconComponent: <Home fontSize="small" />
  },
  {
    id: 1,
    label: "Add Product",
    link: "add-product",
    iconComponent: <Add fontSize="small" />
  }
];

export const USER_SIDEBAR_LINKS = [
  {
    id: 0,
    label: "गृहपृष्ठ",
    link: "dashboard",
    iconComponent: <Home fontSize="small" />
  },
  {
    id: 1,
    label: "सेवाग्राहीहरु",
    link: "all-bills",
    iconComponent: <Group fontSize="small" />
  },
  {
    id: 2,
    label: "बिलहरू खोज्नुहोस्",
    link: "search-lab-bills",
    iconComponent: <Search fontSize="small" />
  },
  {
    id: 3,
    label: "सेवाहरू",
    link: "lab-sewa",
    iconComponent: <Layers fontSize="small" />
  },
  {
    id: 4,
    label: "डाक्टरहरू",
    link: "doctor-home",
    iconComponent: <Group fontSize="small" />
  },
  {
    id: 5,
    label: "सेवाको प्रकारअनुसार रिपोर्ट",
    link: "category-report",
    iconComponent: <Assessment fontSize="small" />
  },
];