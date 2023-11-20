import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import { IProdConsMessageBroker } from "../interfaces/prod-cons.msgbroker";

const client = new SQSClient({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

export default class SQSProdConsMessageBroker
  implements IProdConsMessageBroker
{
  async read(queue: string) {
    const receiveMessageCommand = new ReceiveMessageCommand({
      MaxNumberOfMessages: 10,
      QueueUrl: queue,
      WaitTimeSeconds: 5,
      MessageAttributeNames: ["All"],
    });

    const response = await client.send(receiveMessageCommand);

    if (response.Messages && response.Messages.length > 0) {
      return {
        body: response.Messages[0]?.Body,
        receiptHandle: response.Messages[0].ReceiptHandle,
      };
    }

    console.log("Waiting for messages...");
    return;
  }
  async deleteMessage(queue: string, receiptHandle: string): Promise<void> {
    const command = new DeleteMessageCommand({
      QueueUrl: queue,
      ReceiptHandle: receiptHandle,
    });

    await client.send(command);
  }
}
