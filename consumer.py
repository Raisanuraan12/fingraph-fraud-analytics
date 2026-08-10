import json
from kafka import KafkaConsumer

# 1. Initialize Kafka Consumer Configuration
KAFKA_TOPIC = 'financial-transactions'
KAFKA_SERVER = 'localhost:9092'

print(f"Initializing Kafka Consumer for topic: '{KAFKA_TOPIC}'...")

try:
    consumer = KafkaConsumer(
        KAFKA_TOPIC,
        bootstrap_servers=[KAFKA_SERVER],
        auto_offset_reset='latest',  # Read new streaming data arriving right now
        value_deserializer=lambda m: json.loads(m.decode('utf-8'))
    )
    print(f"Successfully connected to Kafka server. Waiting for live streaming data...\n")
except Exception as e:
    print(f"Error: Could not connect to Kafka server. Details: {e}")
    consumer = None

# 2. Process the Real-Time Streaming Data
if consumer is not None:
    try:
        for message in consumer:
            # Extract the raw row dictionary sent by the producer
            transaction_data = message.value
            
            # Extract values dynamically using generic fallbacks or empty strings if keys differ
            # Looking at your CSV columns: A (ID), B (Timestamp), E (Amount), N (Label)
            tx_id = transaction_data.get('transaction_id', 'N/A')
            timestamp = transaction_data.get('transaction_id_a', 'N/A')  # Column B
            amount = transaction_data.get('transaction_id_e', 'N/A')     # Column E
            label = transaction_data.get('transaction_id_n', 'N/A')      # Column N
            
            # Print the incoming transaction cleanly
            print("-" * 60)
            print(f"🚀 [NEW TRANSACTION RECEIVED]")
            print(f"   🔹 ID        : {tx_id}")
            print(f"   🔹 Timestamp : {timestamp}")
            print(f"   🔹 Amount    : {amount}")
            print(f"   🔹 Label     : {label}")
            
            # Basic validation check example for your fraud project
            if 'suspicious' in str(label).lower() or str(label) == '1':
                print("   ⚠️ WARNING: Suspicious transaction activity detected!")
                
    except KeyboardInterrupt:
        print("\nStopping consumer engine cleanly...")
