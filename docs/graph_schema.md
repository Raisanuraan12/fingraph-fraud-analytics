# FinGraph – Graph Schema

## 1. Project Purpose

FinGraph is a real-time fraud syndicate analytics project.
The graph database represents people, accounts, banks, devices,
IP addresses, and money transfers as connected data.

## 2. Nodes

### Person
Represents a customer/person associated with an account.

Properties:
- person_id
- name

### Account
Represents a bank account involved in transactions.

Properties:
- account_id
- account_type

### Bank
Represents the bank associated with an account.

Properties:
- bank_id
- bank_name

### Device
Represents a device used to access accounts.

Properties:
- device_id

### IPAddress
Represents an IP address used by an account.

Properties:
- ip_address

## 3. Relationships

### OWNS
Person → Account

A person owns an account.

### HELD_AT
Account → Bank

An account is held at a bank.

### TRANSFERRED_TO
Account → Account

Represents a money transfer from one account to another.

Properties:
- transaction_id
- amount
- timestamp

### USES_DEVICE
Account → Device

An account is accessed using a device.

### USES_IP
Account → IPAddress

An account is associated with an IP address.

## 4. Fraud Patterns

The graph should support detection of:

1. More than 10 transactions from the same IP within 5 minutes.
2. More than 5 accounts using the same device.
3. More than 20 micro-transactions to one account.
4. Circular transfer pattern:

   Account A → Account B → Account C → Account A

## 5. Basic Graph Structure

Person → OWNS → Account
Account → HELD_AT → Bank
Account → TRANSFERRED_TO → Account
Account → USES_DEVICE → Device
Account → USES_IP → IPAddress