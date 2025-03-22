function calculateTgtListCounts() {
    const rows = document.querySelectorAll('.bottom-table tr');
    const counts = {};

    rows.forEach((row, index) => {
        if (index === 0) return; // Skip header row

        const cells = row.querySelectorAll('td');
        const tgtList = cells[2].innerText.trim();
        const engmtBy = cells[7].innerText.trim();

        if (!counts[tgtList]) {
            counts[tgtList] = { LRV: 0, GUNS: 0, AIR: 0 };
        }

        if (engmtBy == 'G' || engmtBy == 'S' || engmtBy == 'P') {
            counts[tgtList].LRV++;
        } else if (engmtBy.includes('REGT')) {
            counts[tgtList].GUNS++;
        } else if (engmtBy.includes('AIR')) {
            counts[tgtList].AIR++;
        }
    });

    updateTable(counts);
}
/**
 * Updates the table with the provided counts.
 * 
 * @param {object} counts - The counts object containing the LRV, GUNS, and AIR values for each target list.
 */
function updateTable(counts) {
    const tableRows = document.querySelectorAll('.tables-container table tr');
    let totalLRV = 0, totalGUNS = 0, totalAIR = 0;

    tableRows.forEach((row, index) => {
        if (index < 2) return; // Skip header rows

        const cells = row.querySelectorAll('td');
        const tgtList = cells[0].innerText.trim();

        if (counts[tgtList]) {
            cells[1].innerText = counts[tgtList].LRV;
            cells[2].innerText = counts[tgtList].GUNS;
            cells[3].innerText = counts[tgtList].AIR;
            cells[4].innerText = counts[tgtList].LRV + counts[tgtList].GUNS + counts[tgtList].AIR;

            totalLRV += counts[tgtList].LRV;
            totalGUNS += counts[tgtList].GUNS;
            totalAIR += counts[tgtList].AIR;
        }
    });

    // Update the TOTAL row
    const totalRow = tableRows[tableRows.length - 1].querySelectorAll('td');
    totalRow[1].innerText = totalLRV;
    totalRow[2].innerText = totalGUNS;
    totalRow[3].innerText = totalAIR;
    totalRow[4].innerText = totalLRV + totalGUNS + totalAIR;
}
/**
 * Update engaged counts based on the selected checkboxes in the bottom table.
 */
function updateEngagedCounts() {
    const rows = document.querySelectorAll('.bottom-table tr');
    const engagedCounts = {};

    rows.forEach((row, index) => {
        if (index === 0) return; // Skip header row

        const checkbox = row.querySelector('input[type="checkbox"]');
        const cells = row.querySelectorAll('td');
        const tgtList = cells[2].innerText.trim();
        const engmtBy = cells[7].innerText.trim();

        if (!engagedCounts[tgtList]) {
            engagedCounts[tgtList] = { LRV: 0, GUNS: 0, AIR: 0 };
        }

        if (checkbox.checked) {
            if (engmtBy.includes('GRAD')) {
                engagedCounts[tgtList].LRV++;
            } else if (engmtBy.includes('REGT')) {
                engagedCounts[tgtList].GUNS++;
            } else if (engmtBy.includes('AIR')) {
                engagedCounts[tgtList].AIR++;
            }
        }
    });

    updateEngagedTable(engagedCounts);
}
/**
 * Updates the engaged table with the provided engaged counts.
 *
 * @param {Object} engagedCounts - Object containing the engaged counts for each target list.
 */
function updateEngagedTable(engagedCounts) {
    const tableRows = document.querySelectorAll('.tables-container table tr');
    let totalLRV = 0, totalGUNS = 0, totalAIR = 0;

    tableRows.forEach((row, index) => {
        if (index < 2) return; // Skip header rows

        const cells = row.querySelectorAll('td');
        const tgtList = cells[0].innerText.trim();

        if (engagedCounts[tgtList]) {
            cells[5].innerText = engagedCounts[tgtList].LRV;
            cells[6].innerText = engagedCounts[tgtList].GUNS;
            cells[7].innerText = engagedCounts[tgtList].AIR;
            cells[8].innerText = engagedCounts[tgtList].LRV + engagedCounts[tgtList].GUNS + engagedCounts[tgtList].AIR;

            totalLRV += engagedCounts[tgtList].LRV;
            totalGUNS += engagedCounts[tgtList].GUNS;
            totalAIR += engagedCounts[tgtList].AIR;
        } else {
            cells[5].innerText = 0;
            cells[6].innerText = 0;
            cells[7].innerText = 0;
            cells[8].innerText = 0;
        }
    });

    // Update the TOTAL row for engaged counts
    const totalRow = tableRows[tableRows.length - 1].querySelectorAll('td');
    totalRow[5].innerText = totalLRV;
    totalRow[6].innerText = totalGUNS;
    totalRow[7].innerText = totalAIR;
    totalRow[8].innerText = totalLRV + totalGUNS + totalAIR;
}

function addCheckboxListeners() {
    const checkboxes = document.querySelectorAll('.bottom-table input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateEngagedCounts);
    });
}
/**
 * Exports the tables to an Excel file.
 */
function exportTablesToExcel() {
    const tgtRcvdTable = document.getElementById('tgt-rcvd-table');
    const tgtEngagedTable = document.getElementById('tgt-engaged-table');

    const wb = XLSX.utils.book_new();

    // Convert TGT RCVD table to worksheet
    const tgtRcvdWs = XLSX.utils.table_to_sheet(tgtRcvdTable);
    XLSX.utils.book_append_sheet(wb, tgtRcvdWs, 'TGT RCVD');

    // Filter selected rows from TGT ENGAGED table
    const selectedRows = [];
    const rows = tgtEngagedTable.querySelectorAll('tr');
    rows.forEach((row, index) => {
        if (index === 0) {
            // Add header row
            selectedRows.push(row);
        } else {
            const checkbox = row.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                selectedRows.push(row);
            }
        }
    });

    // Create a new table element for selected rows
    const selectedTable = document.createElement('table');
    selectedRows.forEach(row => {
        selectedTable.appendChild(row.cloneNode(true));
    });

    // Convert selected rows table to worksheet
    const tgtEngagedWs = XLSX.utils.table_to_sheet(selectedTable);
    XLSX.utils.book_append_sheet(wb, tgtEngagedWs, 'TGT ENGAGED');

    // Export the workbook and trigger download
    XLSX.writeFile(wb, 'TGT_Analysis.xlsx');
}

// Call the function to calculate and update the table on page load
window.onload = () => {
    calculateTgtListCounts();
    addCheckboxListeners();
};