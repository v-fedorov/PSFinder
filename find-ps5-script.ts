/* eslint-disable max-len */

require("dotenv").config();

import "cross-fetch/polyfill";

import {
  callPhoneAsync,
  sendIsAvailableTextAsync,
} from "./twilio";

import * as Target from "./target";
import * as BestBuy from "./bestbuy";
import * as PSDirect from "./psdirect";
import moment = require("moment");

const CronJob = require("cron").CronJob;

/*
ts-node -O '{"module":"commonjs", "target":"es2017"}' ./find-ps5-script.ts
 */

export enum Stores {
  BESTBUY = "BEST BUY",
  TARGET = "TARGET",
  PLAYSTATION_DIRECT = "PLAYSTATION DIRECT",
}

export let availableStoresCache = {};

export const updateCacheAndSendTextAsync = async ({
  isAvailable,
  retailer,
  data = [],
  item,
  url,
}: {
  isAvailable: boolean;
  retailer: Stores;
  item?: String;
  url?: String;
  data?: String[];
}) => {
  console.log(`${item} - isAvailable ${retailer}`, isAvailable);
  // if (data?.length > 0) {
  //   console.log("extra data", data);
  // }

  if (isAvailable && (availableStoresCache[`${url}`] == null || availableStoresCache[`${url}`] == undefined)) {
    availableStoresCache[`${url}`] = true;
    await sendIsAvailableTextAsync(`${item} AVAILABLE at ${retailer} - ${url}`);
    await callPhoneAsync();
  }
  else if (!isAvailable && availableStoresCache[`${url}`]) {
    availableStoresCache[`${url}`] =  null;
    await sendIsAvailableTextAsync(`${item} NO LONGER AVAILABLE at ${retailer} - ${url}`);
  }
};

console.log("----- RUNNING FIND PS5 SCRIPT -----", {
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TO_PHONE_NUMBER: process.env.TO_PHONE_NUMBER,
  FROM_PHONE_NUMBER: process.env.FROM_PHONE_NUMBER,
  BEST_BUY_API_KEY: process.env.BEST_BUY_API_KEY,
  TARGET_API_KEY: process.env.TARGET_API_KEY,
  ZIP_CODE: process.env.ZIP_CODE,
});

const checkEveryTwentySecondsJob = new CronJob("*/10 * * * * *", async () => {
  const now = moment().format("MMM DD h:mm:ss A");
  console.log(`Checking at ${now}`);

  await BestBuy.check([6430161, 6426149]);
  await Target.check([81114596, 81114595]);
  await PSDirect.check(3005817);
});

checkEveryTwentySecondsJob.start();
