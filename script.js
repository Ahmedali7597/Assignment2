document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('userInput');
    const contentDiv = document.getElementById('responseContainer');    
    let isTableRequired = false;

    document.getElementById('btnFirst').addEventListener('click', function() {
        fetchContent('', function(text) {
            handleTextResponse(text + '000824753');
        });
    });

    document.getElementById('btnSecond').addEventListener('click', function() {
        isTableRequired = false;
        const url = `https://csunix.mohawkcollege.ca/~adams/10259/a6_responder.php?choice=${userInput.value}`;
        fetchContent(url, handleJsonResponse);
        userInput.disabled = true;
    });

    document.getElementById('btnThird').addEventListener('click', function() {
        isTableRequired = true;
        const formData = new FormData();
        formData.append('choice', userInput.value);
        fetchContent('https://csunix.mohawkcollege.ca/~adams/10259/a6_responder.php', handleJsonResponse, 'POST', formData);
        userInput.disabled = true;
    });

    function fetchContent(url, callback, method = 'GET', body = null) {
        fetch(url, {
            method: method,
            body: body
        }).then(response => response.json()) // Explicitly parse as JSON
          .then(data => {
              console.log(data); // Log the parsed data
              callback(data);
          })
          .catch(error => console.error('Error:', error));
    }

    function handleTextResponse(text) {
        contentDiv.innerHTML = `<h1 style="text-align: center; width: 100%;">${text}</h1>`;
    }

    function handleJsonResponse(json) {
        console.log(json);
        contentDiv.innerHTML = ''; // Clear existing content
        if (!isTableRequired) {
            // Handle display for the second button
            const rowDiv = document.createElement('div');
            rowDiv.className = 'row';
            json.forEach(item => {
                const colDiv = document.createElement('div');
                colDiv.className = `col-${12 / json.length}`;
                colDiv.innerHTML = `
                    <h2>${item.series}</h2>
                    <img src="${item.url}" alt="${item.name}" style="width: 100%;">
                    <p>${item.name}</p>
                `;
                rowDiv.appendChild(colDiv);
            });
            contentDiv.appendChild(rowDiv);
        } else {
            // Handle table generation for the third button
            const table = document.createElement('table');
            table.className = 'table';
            json.forEach(item => {
                const row = table.insertRow();
                Object.values(item).forEach(text => {
                    const cell = row.insertCell();
                    cell.textContent = text;
                });
            });
            contentDiv.appendChild(table);
        }
        // Dynamically set the copyright notice
        const copyright = document.createElement('p');
        const choice = userInput.value.toLowerCase();
        if (choice.includes('mario')) {
            copyright.innerHTML = 'Game trademarks and copyrights are properties of their respective owners. Nintendo properties are trademarks of Nintendo. © 2019 Nintendo.';
        } else if (choice.includes('starwars')) {
            copyright.innerHTML = 'Star Wars © & TM 2022 Lucasfilm Ltd. All rights reserved. Visual material © 2022 Electronic Arts Inc.';
        }
        contentDiv.appendChild(copyright);
    }
});
