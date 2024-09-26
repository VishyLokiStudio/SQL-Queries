let tableCount = 0;

        function addTable() {
            tableCount++;

            const tableContainer = document.createElement('div');
            tableContainer.className = "table-container";
            tableContainer.id = `table-container-${tableCount}`;

            const tableTitle = document.createElement('h3');
            tableTitle.innerText = `Table ${tableCount}:`;
            tableContainer.appendChild(tableTitle);

            // Table Name Input
            const tableNameInput = document.createElement('input');
            tableNameInput.type = 'text';
            tableNameInput.placeholder = 'Enter table name';
            tableNameInput.className = 'custom-name';
            tableContainer.appendChild(tableNameInput);

            // Fields Input
            const fieldsInput = document.createElement('input');
            fieldsInput.type = 'text';
            fieldsInput.placeholder = 'Enter field names (comma separated)';
            fieldsInput.className = 'input-field';
            tableContainer.appendChild(fieldsInput);

            // Number of Rows Input
            const noOfRowsInput = document.createElement('input');
            noOfRowsInput.type = 'number';
            noOfRowsInput.placeholder = 'Enter number of rows';
            noOfRowsInput.className = 'input-field';
            tableContainer.appendChild(noOfRowsInput);

            // Create Table Button
            const createTableButton = document.createElement('button');
            createTableButton.innerText = "Create Table";
            createTableButton.className = "button";
            createTableButton.onclick = function() { createTable(tableContainer, tableNameInput.value, fieldsInput.value, noOfRowsInput.value); };
            tableContainer.appendChild(createTableButton);

            // Initial Text Box for extra content
            const textBox = document.createElement('textarea');
            textBox.placeholder = 'Add any additional text here...';
            textBox.className = 'text-area';
            tableContainer.appendChild(textBox);

            document.getElementById('tables-container').appendChild(tableContainer);
        }

        function createTable(container, tableName, fieldsStr, noOfRows) {
            const fields = fieldsStr.split(',').map(field => field.trim());
            const table = document.createElement('table');
            table.id = `table-${tableCount}`;

            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            fields.forEach(field => {
                const th = document.createElement('th');
                th.innerText = field;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            for (let i = 1; i <= noOfRows; i++) {
                const row = document.createElement('tr');
                fields.forEach(() => {
                    const td = document.createElement('td');
                    td.contentEditable = true;
                    row.appendChild(td);
                });
                tbody.appendChild(row);
            }
            table.appendChild(tbody);
            container.appendChild(table);
        }

        function convertToPrompt() {
            const tables = document.querySelectorAll('.table-container');
            let promptText = '';

            // Process Tables First
            tables.forEach((tableContainer, index) => {
                const table = tableContainer.querySelector('table');
                const tableName = tableContainer.querySelector('input[type="text"]').value;
                const fields = Array.from(table.querySelectorAll('thead th')).map(th => th.innerText);
                const rows = Array.from(table.querySelectorAll('tbody tr')).map(row => 
                    Array.from(row.querySelectorAll('td')).map(td => td.innerText.trim())
                );

                // Building the prompt format for tables
                promptText += `Table ${index + 1}:\n`;
                promptText += `table name: ${tableName}\n`;
                promptText += `fields: ${fields.join(', ')}\n`;
                promptText += `rows:\n`;
                rows.forEach(row => {
                    promptText += row.join(', ') + '\n';
                });
                promptText += '\n';
            });

            // Add Additional Text Boxes After Tables
            const additionalTextBoxes = document.querySelectorAll('.table-container textarea');
            additionalTextBoxes.forEach(textBox => {
                const additionalText = textBox.value.trim();
                if (additionalText) {
                    promptText += `\n${additionalText}\n`;
                }
            });

            // Add initial additional text
            const initialTextAreaValue = document.getElementById('initial-text-area').value.trim();
            if (initialTextAreaValue) {
                promptText += `\n${initialTextAreaValue}\n`;
            }

            document.getElementById('prompt-output').innerText = promptText.trim();
        }

        function copyPrompt() {
            const promptOutput = document.getElementById('prompt-output');
            navigator.clipboard.writeText(promptOutput.innerText)
                .then(() => alert('Prompt copied to clipboard!'))
                .catch(err => console.error('Could not copy text: ', err));
        }
