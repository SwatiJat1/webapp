import React from "react";

import { Helmet, HelmetProvider } from "react-helmet-async";

export const MetaData = ({ title }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{`${title}-ShopIT`}</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>
    </HelmetProvider>
  );
};
