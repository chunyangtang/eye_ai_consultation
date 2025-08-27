import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app) # Enable CORS for all routes, allowing frontend to connect

DATA_FILE = '../data/questionnaire_data.json'
PORT = 8001

# Function to load existing data from file
def load_data():
    if os.path.exists(DATA_FILE) and os.path.getsize(DATA_FILE) > 0:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                # Handle empty or malformed JSON file
                return []
    return []

# Function to save data to file
def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

@app.route('/submit-questionnaire', methods=['POST'])
def submit_questionnaire():
    if not request.is_json:
        return jsonify({"message": "Request must be JSON"}), 400

    new_entry = request.get_json()

    # Basic server-side validation
    if not new_entry.get('name') or len(new_entry['name']) < 2:
        return jsonify({"message": "姓名至少需要2个字符"}), 400
    # Phone number validation: removed the 11-digit length restriction
    if not new_entry.get('phone') or not str(new_entry['phone']).isdigit():
        return jsonify({"message": "联系电话需要为数字"}), 400
    if not new_entry.get('affectedArea') or len(new_entry['affectedArea']) == 0:
        return jsonify({"message": "请选择受累部位"}), 400

    # Load existing data, add new entry, and save
    data = load_data()
    data.append(new_entry)
    save_data(data)

    return jsonify({"message": "问卷提交成功！"}), 200

@app.route('/', methods=['GET'])
def home():
    return "AI Eye Clinic Backend is running!"

if __name__ == '__main__':
    # Run the Flask app on host '0.0.0.0' to make it accessible within the local network,
    # and on the specified port.
    app.run(host='0.0.0.0', port=PORT)
