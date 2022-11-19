import webpush from "web-push";

import { NextApiRequest, NextApiResponse } from "next";

import { monthsOfTheYear } from "~/constants";
import { databaseUtils } from "~/database";

const vapidDetails = {
  publicKey: process.env.NEXT_VAPID_PUBLIC_KEY ?? ``,
  privateKey: process.env.VAPID_PRIVATE_KEY ?? ``,
  subject: process.env.VAPID_SUBJECT ?? ``,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === `POST`) {
    try {
      const { authorization } = req.headers;

      if (authorization === `Bearer ${process.env.API_SECRET_KEY}`) {
        // Create the notification content.
        const notificationPayload = JSON.stringify({
          title: `Monthly Timetable`,
          body: `This is a friendly reminder to print the calendar for ${
            monthsOfTheYear[new Date().getMonth()]
          }!`,
        });

        // Get all subscriptions from the database
        const subscriptions = await databaseUtils.getSubscriptionsAsync();

        // Send notification payload to each subscription
        await Promise.all(
          subscriptions.map((subscription) =>
            webpush.sendNotification(subscription, notificationPayload, {
              // * push message will be retained by the push service for 3 hours
              TTL: 10000,
              // * authentication information
              vapidDetails,
            })
          )
        );

        res.status(200).end();
      } else {
        res.status(401).end();
      }
    } catch (err) {
      res.status(500).end();
    }
  } else {
    res.setHeader(`Allow`, `POST`);
    res.status(405).end(`Method Not Allowed`);
  }
}
