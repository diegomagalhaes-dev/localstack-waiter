#!/usr/bin/env bash

set -euo pipefail

echo "configuring sns/sqs"
echo "==================="

LOCALSTACK_HOST=localhost
AWS_REGION=sa-east-1
LOCALSTACK_DUMMY_ID=000000000000

create_queue() {
    local QUEUE_NAME_TO_CREATE=$1
    awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sqs create-queue --queue-name "${QUEUE_NAME_TO_CREATE}" --output text
}

create_topic() {
    local TOPIC_NAME_TO_CREATE=$1
    awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sns create-topic --name "${TOPIC_NAME_TO_CREATE}" --output text
}

guess_queue_arn_from_name() {
    local QUEUE_NAME=$1
    echo "arn:aws:sns:${AWS_REGION}:${LOCALSTACK_DUMMY_ID}:$QUEUE_NAME"
}


link_queue_and_topic() {
    local TOPIC_ARN_TO_LINK=$1
    local QUEUE_ARN_TO_LINK=$2
    awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sns subscribe --topic-arn "${TOPIC_ARN_TO_LINK}" --protocol sqs --notification-endpoint "${QUEUE_ARN_TO_LINK}" --output table
}

# Nomes das filas e tópicos
ORDERS_QUEUE="orders"
CREATE_NEW_ORDER_TOPIC="create-new-order"


echo "Criando tópico $CREATE_NEW_ORDER_TOPIC"
NEW_ORDER_TOPIC_ARN=$(create_topic ${CREATE_NEW_ORDER_TOPIC})
echo "Tópico criado: $NEW_ORDER_TOPIC_ARN"

echo "Criando fila $ORDERS_QUEUE"
ORDERS_QUEUE_URL=$(create_queue ${ORDERS_QUEUE})
echo "Fila criada: $ORDERS_QUEUE_URL"
ORDERS_QUEUE_ARN=$(guess_queue_arn_from_name "$ORDERS_QUEUE")

echo "Associando tópico $NEW_ORDER_TOPIC_ARN à fila $ORDERS_QUEUE_ARN"
LINKING_RESULT=$(link_queue_and_topic "$NEW_ORDER_TOPIC_ARN" "$ORDERS_QUEUE_ARN")
echo "Associação realizada:"
echo "$LINKING_RESULT"
