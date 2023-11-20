export type ReadOutput = {
  body?: string;
  receiptHandle?: string;
};

export interface IProdConsMessageBroker {
  read(queueUrl: string): Promise<ReadOutput | undefined>;
  deleteMessage(queueUrl: string, receiptHandle: string): Promise<void>;
}
