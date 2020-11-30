import { Stores, updateCacheAndSendTextAsync } from "./find-ps5-script";

const check = async (ids: number[]): Promise<void> => {
  for (let id of ids) {
    await availability(id);
  }
};

const availability = async (id: number): Promise<void> => {
  const {item, url} = await getProduct(id);

  const res = await fetch(
    `https://api.target.com/fulfillment_aggregator/v1/fiats/${id}?key=${process.env.TARGET_API_KEY}&nearby=${process.env.ZIP_CODE}&limit=20&requested_quantity=1&radius=50&fulfillment_test_mode=grocery_opu_team_member_test`
  );
  const { products: [{ locations }] } = await res.json();

  const availableLocations = locations.filter(
    ({ order_pickup, curbside, ship_to_store, in_store_only }) => {
      const unavailableKeywords = [
        "UNAVAILABLE",
        "NOT_SOLD_IN_STORE",
        "OUT_OF_STOCK",
      ];
      return (
        !unavailableKeywords.includes(order_pickup.availability_status) ||
        !unavailableKeywords.includes(curbside.availability_status) ||
        !unavailableKeywords.includes(ship_to_store.availability_status) ||
        !unavailableKeywords.includes(in_store_only.availability_status)
      );
    }
  );
  await updateCacheAndSendTextAsync({
    isAvailable: availableLocations.length > 0,
    retailer: Stores.TARGET,
    item,
    url,
    data: availableLocations,
  });
};

const getProduct = async (id): Promise<{item: string, url: string}> => {
  const excludes = 'taxonomy,rating_and_review_statistics,bulk_ship,question_answer_statistics,available_to_promise_network,rating_and_review_reviews';
  const res = await fetch(
    `https://redsky.target.com/v3/pdp/tcin/${id}?excludes=${excludes}&key=${process.env.TARGET_API_KEY}`,
    {
      "method": "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36"
      }
    });

  const { product: {item} } = await res.json();
  const { product_description: {title}, buy_url } = item;

  return {item: title, url: buy_url}
};

export { check };
