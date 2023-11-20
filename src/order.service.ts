import { IPubSubMessageBroker } from "./interfaces/pub-sub.msgbroker";
import { IProdConsMessageBroker } from "./interfaces/prod-cons.msgbroker";

type Product = {
  name: string;
  quantity: number;
};

export type Order = {
  id: string;
  table: string;
  products: Array<Product>;
};

export default class OrderService {
  private sqsClient: IProdConsMessageBroker;
  private snsClient: IPubSubMessageBroker;

  constructor(
    sqsClient: IProdConsMessageBroker,
    snsClient: IPubSubMessageBroker
  ) {
    this.sqsClient = sqsClient;
    this.snsClient = snsClient;
  }

  async createOrder(order: Order) {
    const TopicArn = process.env.SNS_TOPIC_ARN ?? "";
    return this.snsClient.publish(order, TopicArn);
  }

  async poolMessages() {
    const QueueUrl = process.env.SQS_QUEUE_URL ?? "";
    const response = await this.sqsClient.read(QueueUrl);

    if (!response) return;

    const { body, receiptHandle } = response;

    if (typeof receiptHandle !== "undefined") {
      await this.sqsClient.deleteMessage(QueueUrl, receiptHandle);
    }

    if (body)
      console.log("\n\n ==== ORDERS QUEUE ==== \n\n", JSON.parse(body).Message);
  }
}
