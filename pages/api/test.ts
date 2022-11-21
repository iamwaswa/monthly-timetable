import { NextApiRequest, NextApiResponse } from "next";

import { databaseUtils } from "~/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const subscriptions = await databaseUtils.getSubscriptions();
  res.status(200).json(subscriptions);
}
