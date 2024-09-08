import json

# Load the JSON data from the file
with open('translation.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Process the data to only keep the first element of each inner list
fixed_data = [[item[0]] for item in data]

# Save the fixed data back to a new JSON file
with open('fixed_translation.json', 'w', encoding='utf-8') as file:
    json.dump(fixed_data, file, ensure_ascii=False, indent=2)

print("Fixed translation saved to 'fixed_translation.json'")
