# 🛠️ Day 4 Exercises - Python File I/O, JSON and API

## 🎯 Exercise Goals

These exercises help you master:
- 📁 **Reading and writing files** in different formats
- 📊 **Processing and validating CSV data**
- 🔄 **Advanced JSON serialization and deserialization**
- 🌐 **Consuming REST APIs** and handling their responses
- 🛡️ **Handling errors and validating external data**

---

## 🥉 Exercise 1: CSV Data Analysis System

### 📊 Description
Build a system that reads CSV files, processes the data, and produces statistical reports.

### 📋 Requirements
- Read a CSV file with pandas and with the standard `csv` module
- Validate and convert data types (int, float, date)
- Calculate basic statistics (sum, average, maximum, minimum, median)
- Filter rows by conditions (for example: sales > 1000)
- Export the results to a new CSV file

---

## 🥈 Exercise 2: News Aggregator from APIs

### 🌐 Description
Write a script that calls a public news API, processes the results, and stores them as JSON.

### 📋 Requirements
- Use `requests` to send GET requests to a news API (for example: NewsAPI, GNews)
- Process the response and extract the key fields (title, source, date, summary)
- Save the results to a JSON file
- Handle errors and retry failed requests
- Support keyword search and pagination

---

## 🥇 Exercise 3: Backup and Sync System

### 💾 Description
Build a system that creates automatic file backups and keeps two folders in sync.

### 📋 Requirements
- Create timestamped backups of files
- Sync files between two folders (copy only new or modified files)
- Log every operation to a text file
- Check file integrity (MD5/SHA256 hash)
- Handle permission errors and insufficient disk space

---

## 💪 Exercise 4: Data Processing Pipeline

### 🔄 Description
Implement a complete pipeline that reads CSV data, transforms it, enriches it with data from an API, and exports the result as JSON.

### 📋 Requirements
- Read and clean data from a CSV file
- Call an API to enrich the data (for example: fetch extra details by ID)
- Validate and transform the combined data
- Export the final result to a JSON file
- Handle errors and log the process

---

## ✅ Evaluation Criteria
- [ ] Robust file reading and writing
- [ ] CSV processing and validation
- [ ] Advanced JSON serialization/deserialization
- [ ] API calls with error handling
- [ ] Logging and clear documentation

---

**💡 Tip**: Always validate external data before processing it. Add logs to trace errors and results.

**🎯 Target**: Each exercise should show real integration of external data and careful handling of files and APIs.
