import webpush, { PushSubscription } from "web-push";

import { NextApiRequest, NextApiResponse } from "next";

import { monthsOfTheYear } from "~/constants";
import { databaseUtils } from "database";

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
            webpush.sendNotification(
              subscription as unknown as PushSubscription,
              notificationPayload,
              {
                // * push message will be retained by the push service for 3 hours
                TTL: 10000,
                // * authentication information
                vapidDetails,
              }
            )
          )
        );

        res.status(200).send(`Cron job executed successfully!`);
      } else {
        res.status(401).send(`Not authenticated`);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  } else {
    res.setHeader(`Allow`, `POST`);
    res.status(405).send(`Method Not Allowed`);
  }
}
