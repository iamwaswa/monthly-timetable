import { addDoc, collection, DocumentData, getDocs } from "firebase/firestore";

import { firestore } from "./init";

type DatabaseUtils = {
  addSubscriptionAsync(subscription: PushSubscription): Promise<void>;
  getSubscriptionsAsync(): Promise<Array<PushSubscription>>;
};

const subscriptionsCollection = collection(firestore, `subscriptions`);

export const databaseUtils: DatabaseUtils = {
  async addSubscriptionAsync(subscription) {
    try {
      addDoc(subscriptionsCollection, subscription);
    } catch {
      throw new Error(`Could not add subscription`);
    }
  },
  async getSubscriptionsAsync() {
    try {
      const querySnapshot = await getDocs(subscriptionsCollection);
      return querySnapshot.docs
        .map((doc) => doc.data())
        .filter((document): document is PushSubscription => true);
    } catch {
      throw new Error(`Could not get subscriptions`);
    }
  },
};
