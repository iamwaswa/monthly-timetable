import { firestore } from "./init";

enum Collections {
  SUBSCRIPTIONS = "subscriptions",
}

type DatabaseUtils = {
  addSubscriptionAsync(subscription: PushSubscription): Promise<void>;
  getSubscriptionsAsync(): Promise<Array<PushSubscription>>;
};

export const databaseUtils: DatabaseUtils = {
  async addSubscriptionAsync(subscription) {
    try {
      firestore.collection(Collections.SUBSCRIPTIONS).add(subscription);
    } catch {
      throw new Error(`Could not add subscription`);
    }
  },
  async getSubscriptionsAsync() {
    try {
      const querySnapshot = await firestore
        .collection(Collections.SUBSCRIPTIONS)
        .get();
      return querySnapshot.docs
        .map((doc) => doc.data())
        .filter((document): document is PushSubscription => true);
    } catch {
      throw new Error(`Could not get subscriptions`);
    }
  },
};
