import { Stores, updateCacheAndSendTextAsync } from "./main";

const check = async (id: number): Promise<void> => {
  const res = await fetch(
    `https://api.direct.playstation.com/commercewebservices/ps-direct-us/users/anonymous/products/productList?fields=BASIC&productCodes=${id}`
  );
  const { products } = await res.json();

  const {
    stock: { stockLevelStatus }, name, url,
  } = products[0];
  const isAvailable = stockLevelStatus != "outOfStock";
  await updateCacheAndSendTextAsync({
    isAvailable,
    retailer: Stores.PLAYSTATION_DIRECT,
    item: name,
    url
  });
};

export { check };
