from pyspark.sql import functions as func
from pyspark.sql import SparkSession

from misc import read_kafka_config, read_env

# create a function for the config parser.

connection = read_kafka_config()
configs = read_env()
print(connection)
host, port = connection["bootstrap.servers"].split(":")

spark = SparkSession.builder.\
    appName("SparkStreaming").\
    config('spark.jars.packages', 'org.apache.spark:spark-sql-kafka-0-10_2.12:3.3.0').\
    master("spark://spark:7077").\
    getOrCreate()

print(host, port)
df = spark \
    .readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", f"{host}:{port}") \
    .option("subscribe", configs["KAFKA_MAIN_TOPIC"]) \
    .option("failOnDataLoss", False)\
    .load()

# proof of concept
btc_vals = df.selectExpr("CAST(key as STRING) as key",
                         "CAST(value as STRING) as value")\
    .filter(func.col('key') == "BTCUSDT")

eth_vals = df.selectExpr("CAST(key as STRING) as key",
                         "CAST(value as STRING) as value")\
    .filter(func.col('key') == "ETHUSDT")

btc_streams = btc_vals.writeStream\
    .format("kafka")\
    .option("kafka.bootstrap.servers", f"{host}:{port}")\
    .option("topic", f"{configs['BITCOIN_TOPIC']}")\
    .option("checkpointLocation", "/tmp/pyspark/")\
    .option("forceDeleteTempCheckpointLocation", "true")\
    .start()
eth_streams = eth_vals.writeStream\
    .format("kafka")\
    .option("kafka.bootstrap.servers", f"{host}:{port}")\
    .option("topic", f"{configs['ETH_TOPIC']}")\
    .option("checkpointLocation", "/tmp/pyspark/")\
    .option("forceDeleteTempCheckpointLocation", "true")\
    .start()
# .trigger(continuous="10 seconds")\
# .outputMode("complete")
spark.streams.awaitAnyTermination()
