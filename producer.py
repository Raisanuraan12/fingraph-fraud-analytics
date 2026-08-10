import json
import time
import pandas as pd
from kafka import KafkaProducer

# 1. Initialize Kafka Producer
KAFKA_TOPIC = 'financial-transactions'
KAFKA_SERVER = 'localhost:9092'

try:
    producer = KafkaProducer(
        bootstrap_servers=[KAFKA_SERVER],
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    print(f"Successfully connected to Kafka server at {KAFKA_SERVER}")
except Exception as e:
    print(f"Error: Could not connect to Kafka server. Please ensure Kafka is running. Details: {e}")
    producer = None

# 2. Load your Excel/CSV Dataset
# Make sure the 'transactions_dataset.csv' file is placed inside your project folder
csv_file_path = 'transactions_dataset.csv'

try:
    print(f"Loading dataset from {csv_file_path}...")
    df = pd.read_csv(csv_file_path)
    
    # Optional: Filter rows based on your columns if needed
    # According to your sheet, Column N holds the labels ('normal' / 'suspicious')
    # Change 'transaction_id_n' to the exact column header name from your CSV file
    # df_normal = df[df['transaction_id_n'] == 'normal'].head(2000)
    # df_suspicious = df[df['transaction_id_n'] == 'suspicious'].head(150)
    # df_final = pd.concat([df_normal, df_suspicious]).sample(frac=1).reset_index(drop=True)
    
    df_final = df.sample(frac=1).reset_index(drop=True) # Shuffles the dataset
    print(f"Successfully loaded {len(df_final)} rows from the dataset.")

except FileNotFoundError:
    print(f"Error: The file '{csv_file_path}' was not found in the current directory.")
    df_final = None
except Exception as e:
    print(f"Error reading the CSV file: {e}")
    df_final = None

# 3. Stream data row by row to Kafka
if df_final is not None:
    print(f"Starting live streaming to Kafka topic: '{KAFKA_TOPIC}'...\n")
    
    for index, row in df_final.iterrows():
        # Convert the current row to a dictionary format
        transaction_data = row.to_dict()
        
        # Display tracking in terminal
        print(f"Streaming Row {index+1} -> ID: {transaction_data.get('transaction_id')} | Amount: {transaction_data.get('transaction_id_e')} | Label: {transaction_data.get('transaction_id_n')}")
        
        if producer:
            # Send data to Kafka topic
            producer.send(KAFKA_TOPIC, value=transaction_data)
        
        # Stream delay interval (0.5 seconds gap)
        time.sleep(0.5)

    if producer:
        producer.flush()
    print("\nStreaming finished successfully.")
