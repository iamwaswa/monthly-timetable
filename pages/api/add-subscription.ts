import { NextApiRequest, NextApiResponse } from "next";

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
        res.status(422).end();
      } else {
        res.status(201).end();
      }
    } catch (err) {
      res.status(500).end();
    }
  } else {
    res.setHeader(`Allow`, `POST`);
    res.status(405).end(`Method Not Allowed`);
  }
}
