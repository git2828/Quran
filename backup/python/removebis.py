import json

# Load the JSON data from the file
with open('fixed_quran.json', 'r', encoding='utf-8') as file:
    quran_data = json.load(file)

# Define the phrase to remove
phrase_to_remove = "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ"

# Process the JSON data
updated_quran_data = []
for verse in quran_data:
    # If the verse text matches the phrase to remove and it's the first verse of a Surah
    if verse[3] == phrase_to_remove:
        # Remove the phrase by setting it to an empty string
        verse[3] = ""
    updated_quran_data.append(verse)

# Save the modified data back to a new JSON file
with open('quran_updated.json', 'w', encoding='utf-8') as file:
    json.dump(updated_quran_data, file, ensure_ascii=False, indent=4)

print("Quran data has been updated successfully.")
