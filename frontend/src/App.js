import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import { Header } from "./Component/layout/Header";
import { Home } from "./Component/Home";
import { ProductDetails } from "./Component/Product/ProductDetails";
import { Login } from "./Component/user/Login";
import { Register } from "./Component/user/Register";
import { loadUser } from "./actions/UserActions";

import { Dashboard } from "./Component/admin/Dashboard";
import { store } from "./store";
import { Profile } from "./Component/user/Profile";
import { ProtectedRoute } from "./Component/route/ProtectedRoute";
import { UpdateProfile } from "./Component/user/UpdateProfile";
import { UpdatePassword } from "./Component/user/UpdatePassword";
import { ForgotPassword } from "./Component/user/ForgotPassword";
import { NewPassword } from "./Component/user/NewPassword";
import { Cart } from "./Component/cart/Cart";
import { Shipping } from "./Component/cart/Shipping";
import { ConfirmOrder } from "./Component/cart/ConfirmOrder";
import { Payment } from "./Component/cart/Payment";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { OrderSuccess } from "./Component/cart/OrderSuccess";
import { ListOrders } from "./Component/order/ListOrders";
import { OrderDetails } from "./Component/order/OrderDetails";
import { ProductList } from "./Component/admin/ProductList";
import { NewProduct } from "./Component/admin/NewProduct";
import { OrderList } from "./Component/admin/OrderList";
import { ProcessOrder } from "./Component/admin/ProcessOrder";
import { UsersList } from "./Component/admin/UsersList";
import { UpdateUser } from "./Component/admin/UpdateUser";
import { ProductReviews } from "./Component/admin/ProductReviews";

import { Footer } from "./Component/layout/Footer";
import { UpdateProduct } from "./Component/admin/UpdateProduct";

import { useSelector } from "react-redux";

function App() {
  const [stripeApiKey, setStripeApiKey] = useState(
    "pk_test_51L8jBVSJI0ypcj8MCB5sVGlRr1YD4rBrQ3Bau2RDzwvIIZPsbVPqu3ZIx6vNrfKBUcr68DtKh6iNpwVqiggUdZkY000QPufuO7"
  );

  useEffect(() => {
    store.dispatch(loadUser());

    async function getStripApiKey() {
      const { data } = await axios.get("/api/v1/stripeapi");

      setStripeApiKey(data.stripeApiKey);
    }

    getStripApiKey();
  }, []);

  const { user, loading ,isAuthenticated} = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path="/" component={Home} exact />
          <Route path="/search/:keyword" component={Home} />
          <Route path="/product/:id" component={ProductDetails} exact />
          <Route path="/login" component={Login} />
          <Route path="/cart" component={Cart} />
          <ProtectedRoute path="/shipping" component={Shipping} />
          <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />
          <ProtectedRoute path="/success" component={OrderSuccess} />

          {stripeApiKey && (
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/payment" component={Payment} />
            </Elements>
          )}

          <Route path="/register" component={Register} />
          <Route path="/password/forgot" component={ForgotPassword} />
          <Route path="/password/reset/:token" component={NewPassword} />
          <ProtectedRoute path="/me" component={Profile} exact />
          <ProtectedRoute path="/me/update" component={UpdateProfile} exact />
          <ProtectedRoute
            path="/password/update"
            component={UpdatePassword}
            exact
          />
          <ProtectedRoute path="/orders/me" component={ListOrders} exact />
          <ProtectedRoute path="/orderDetails/:id" component={OrderDetails} exact />
        </div>
        <ProtectedRoute
          path="/dashboard"
          isAdmin={true}
          component={Dashboard}
          exact
        />
        <ProtectedRoute
          path="/admin/products"
          isAdmin={true}
          component={ProductList}
          exact
        />
        <ProtectedRoute
          path="/admin/product"
          isAdmin={true}
          component={NewProduct}
          exact
        />
        <ProtectedRoute
          path="/admin/product/:id"
          isAdmin={true}
          component={UpdateProduct}
          exact
        />
        <ProtectedRoute
          path="/admin/orders"
          isAdmin={true}
          component={OrderList}
          exact
        />

        <ProtectedRoute
          path="/admin/order/:id"
          isAdmin={true}
          component={ProcessOrder}
          exact
        />
        <ProtectedRoute
          path="/admin/users"
          isAdmin={true}
          component={UsersList}
          exact
        />

        <ProtectedRoute
          path="/admin/user/:id"
          isAdmin={true}
          component={UpdateUser}
          exact
        />
        <ProtectedRoute
          path="/reviews"
          isAdmin={true}
          component={ProductReviews}
          exact
        />

        {!loading && (!isAuthenticated || user.role !== "admin") && <Footer />}
      </div>
    </Router>
  );
}

export default App;
