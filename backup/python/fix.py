import json

# Load the JSON data from a file
input_file = 'quran.json'
output_file = 'fixed_quran.json'

# Read the JSON data
with open(input_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Process the data: remove the last element of each sublist (the second Arabic text)
fixed_data = [item[:-1] if len(item) == 6 else item for item in data]

# Write the fixed data to a new file
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(fixed_data, f, ensure_ascii=False, indent=2)

print(f"Fixed JSON saved to {output_file}")
