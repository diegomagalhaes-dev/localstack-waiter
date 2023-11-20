import express from "express";
import { config } from "dotenv";
import OrderService from "./order.service";
import SNSPubSubMessageBroker from "./providers/sns";
import SQSProdConsMessageBroker from "./providers/sqs";
import { randomUUID } from "crypto";

const main = async () => {
  config();

  const app = express();

  app.use(express.json());

  const orderService = new OrderService(
    new SQSProdConsMessageBroker(),
    new SNSPubSubMessageBroker()
  );

  app.post("/create", async (req, res) => {
    const createdOrder = await orderService.createOrder({
      id: randomUUID(),
      table: req.body.table,
      products: req.body.products,
    });
    res.send(`New order created: ${createdOrder}`);
  });

  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);

    setInterval(async () => await orderService.poolMessages(), 3500);
  });
};

main();
