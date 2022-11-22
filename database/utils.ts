import { supabase } from "./init";

enum Table {
  SUBSCRIPTIONS = "subscriptions",
}

type DatabaseUtils = {
  addSubscriptionAsync(subscription: PushSubscription): Promise<void>;
  getSubscriptionsAsync(): Promise<Array<PushSubscription>>;
};

export const databaseUtils: DatabaseUtils = {
  async addSubscriptionAsync(subscription) {
    try {
      const { error } = await supabase
        .from(Table.SUBSCRIPTIONS)
        .insert({ subscription });

      if (error) {
        throw new Error(error.message);
      }
    } catch {
      throw new Error(`Could not add subscription`);
    }
  },
  async getSubscriptionsAsync() {
    try {
      const { data, error } = await supabase
        .from(Table.SUBSCRIPTIONS)
        .select<`subscriptions`, PushSubscription>(`subscriptions`);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch {
      throw new Error(`Could not get subscriptions`);
    }
  },
};
