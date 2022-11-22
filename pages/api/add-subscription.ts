import { NextApiRequest, NextApiResponse } from "next";

import { databaseUtils } from "database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === `POST`) {
    try {
      if (
        typeof req.body?.endpoint !== `string` &&
        typeof req.body?.keys?.p256dh !== `string` &&
        typeof req.body?.keys?.auth !== `string`
      ) {
        res.status(422).send(`Invalid JSON object for subscription`);
      } else {
        await databaseUtils.addSubscriptionAsync(req.body);
        res.status(201).send(`Subscription added!`);
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
