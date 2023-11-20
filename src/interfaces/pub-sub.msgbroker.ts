export interface IPubSubMessageBroker {
  publish(body: any, TopicArn: string): Promise<string | undefined>;
}
