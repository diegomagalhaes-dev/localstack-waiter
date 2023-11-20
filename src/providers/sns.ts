import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { IPubSubMessageBroker } from "../interfaces/pub-sub.msgbroker";

const client = new SNSClient({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
});

export default class SNSPubSubMessageBroker implements IPubSubMessageBroker {
  async publish(body: any, TopicArn: string): Promise<string | undefined> {
    const publishParams = {
      TopicArn,
      Message: JSON.stringify(body),
    };
    const command = new PublishCommand(publishParams);
    try {
      const publishedMessage = await client.send(command);

      return publishedMessage.MessageId;
    } catch (e) {
      console.log("an error occurred: ", e);
    }
  }
}
