import openpyxl
from openpyxl import Workbook

# Create a new workbook and select the active worksheet
wb = Workbook()
ws = wb.active

# Set the header row
headers = ["SELECT TGTS", "TGT LIST/ ORIGINATOR", "PRIORITY", "TYPE OF TGT", "NAME", "DMPI NO", "ENGMENT BY", "DEGN GUN AREA", "AMN", "RATE", "ENGAGEMENT RECORD"]
ws.append(headers)

# Add sample data rows
data = [
    ["", "CTL", 12, "TRENCH", "ABC", 5, "XX REGT", "ABC", "HE", "2RPG", ""],
    ["", "JTL", 14, "BR", "DAD BR", 7, "XY REGT", "DEF", "HE", "3RPG", ""]
]

for row in data:
    ws.append(row)

# Save the workbook to a file
wb.save("sample_upload.xlsx")