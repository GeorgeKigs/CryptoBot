docker-compose up -d

docker-compose exec broker bash

kafka-topics
--create
--topic Kindle-graph
--bootstrap-server broker:9092
--replication-factor 1
--partitions 1
