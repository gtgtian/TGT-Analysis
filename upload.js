/**
 * Handles the file upload and parses the Excel file.
 */
function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        appendToTable(json);
    };

    reader.readAsArrayBuffer(file);
}

/**
 * Appends the parsed data to the tgt-engaged-table.
 *
 * @param {Array} data - The parsed data from the Excel file.
 */
function appendToTable(data) {
    const table = document.getElementById('tgt-engaged-table');
    const requiredColumns = 11; // Number of columns in the table (excluding S. No.)

    data.forEach((row, index) => {
        if (index === 0) return; // Skip header row

        if (row.length === requiredColumns) {
            const newRow = table.insertRow();

            // Add checkbox to the first cell
            const checkboxCell = newRow.insertCell();
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkboxCell.appendChild(checkbox);

            // Add the rest of the cells
            row.forEach((cellData, cellIndex) => {
                const newCell = newRow.insertCell(cellIndex + 1); // Adjust index to skip the checkbox cell
                newCell.innerText = cellData;
            });
        }
    });

    // Update serial numbers
    updateSerialNumbers();
}

/**
 * Updates the serial numbers in the tgt-engaged-table.
 */
function updateSerialNumbers() {
    const table = document.getElementById('tgt-engaged-table');
    const rows = table.querySelectorAll('tr');

    rows.forEach((row, index) => {
        if (index === 0) return; // Skip header row

        const serialNumberCell = row.cells[1];
        serialNumberCell.innerText = index;
    });
}

// Add event listener for file upload
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-upload');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
});