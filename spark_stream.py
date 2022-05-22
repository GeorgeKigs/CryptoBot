from pyspark.sql import functions as func
from pyspark.sql import SparkSession
import configparser

from src.misc import read_config, read_env

# create a function for the config parser.

connection = read_config()
configs = read_env()
# print(connection)

spark = SparkSession.builder.\
    appName("SparkStreaming").\
    config('spark.jars.packages', 'org.apache.spark:spark-sql-kafka-0-10_2.12:3.2.1').\
    getOrCreate()

df = spark \
    .readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", f"{connection}") \
    .option("subscribe", configs["KAFKA_TOPIC"]) \
    .load()


file = df.writeStream\
    .format("console")\
    .option("checkpointLocation", "/tmp/pyspark/")\
    .option("forceDeleteTempCheckpointLocation", "true")\
    .trigger(continuous="10 seconds")\
    .outputMode("update")
file.start()
