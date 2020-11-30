import { Stores, updateCacheAndSendTextAsync } from "./find-ps5-script";

const check = async (ids: number[]): Promise<void> => {
  const query = `sku in (${ids.join(', ')})`;
  const res = await fetch(
    `https://api.bestbuy.com/v1/products(${query})?apiKey=${process.env.BEST_BUY_API_KEY}&format=json`
  );
  const { products } = await res.json();

  for (const {name, orderable, inStoreAvailability, onlineAvailability, addToCartUrl} of products) {
    const isAvailable =
      orderable !== "SoldOut" ||
      inStoreAvailability ||
      onlineAvailability;

    await updateCacheAndSendTextAsync({
      isAvailable: isAvailable,
      retailer: Stores.BESTBUY,
      item: name,
      url: addToCartUrl,
    });
  }
};

export { check };
