import { CreditCard, Delete } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../App";
import Cart, { getTotalCartValue, generateCartItemsFrom } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

const Checkout = () => {
  // let products,
  //   items = [];

  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [addresses, setAddresses] = useState({ all: [{address:"ketan makode, sant gajanan nagar, nagpur"}], selected: "" });
  const [newAddress, setNewAddess] = useState({
    isAddingNewAddress: false,
    value: "",
  });

  const token = localStorage.getItem("token");
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const getProducts = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setProducts(response.data);
      // console.log("response", response.data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status == 500) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  const fetchCart = async (token) => {
    if (!token) return;
    try {
      let response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      enqueueSnackbar(
        "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
      return null;
    }
  };

  useEffect(() => {
    const onLoadHandler = async () => {
      const productData = await getProducts();
      const cartData = await fetchCart(token);
      if (productData && cartData) {
        const cartDetails = await generateCartItemsFrom(cartData, productData);
        setItems(cartDetails);
      }
    };
    onLoadHandler();
    console.log("products", products);
  }, []);

  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box className="shipping-container" minHeight="100vh">
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Shipping
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Manage all the shipping addresses you want. This way you won't
              have to enter the shipping address manually with every order.
              Select the address you want to get your order delivered.
            </Typography>
            <Divider />
            {/* logic for Address add below this line */}
            <Box>
              {addresses.all.length === 0 && (
                <Typography my="1rem">
                  No addresses found for this account. Please add one to
                  proceed.
                </Typography>
              )}
            </Box>

            {addresses.all.length > 0 &&
              addresses.all.map((address) => (
                <Box
                  className={
                    addresses.selected === address._id
                      ? "address-item selected"
                      : "address-item not-selected"
                  }
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={3}
                  key={address._id}
                >
                  <Box ml={1} width="100%">
                    <Button
                      type="text"
                      role="text"
                      variant="text"
                      sx={{ color: "black" }}
                      onClick={() => {
                        setAddresses({ ...addresses, selected: address._id });
                      }}
                    >
                      {address.address}
                    </Button>
                  </Box>
                </Box>
              ))}

            {/* logic for address add above this line */}

            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Payment
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Payment Method
            </Typography>
            <Divider />

            <Box my="1rem">
              <Typography>Wallet</Typography>
              <Typography>
                Pay ${getTotalCartValue(items)} of available $
                {localStorage.getItem("balance")}
              </Typography>
            </Box>

            <Button startIcon={<CreditCard />} variant="contained">
              PLACE ORDER
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart isReadOnly products={products} items={items} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
