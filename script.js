document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('userInput');
    const contentDiv = document.getElementById('responseContainer');    
    let isTableRequired = false;

    document.getElementById('btnFirst').addEventListener('click', function() {
        fetchContent('https://csunix.mohawkcollege.ca/~adams/10259/a6_responder.php', function(text) {
            handleTextResponse(text);
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
        }).then(response => {
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                return response.text();
            }
        }).then(data => {
            console.log(data);
            callback(data);
        })
        .catch(error => console.error('Error:', error));
    }

    function handleTextResponse(text) {
        const studentNumber = "000824753"; 
        contentDiv.innerHTML = `<h1 style="text-align: center; width: 100%;">${text} ${studentNumber}</h1>`;
    }

    
function handleJsonResponse(json) {
    console.log(json);
    contentDiv.innerHTML = ''; // Clear existing content
    if (!isTableRequired) {
        // Handle display for individual items
        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'items';
        json.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.innerHTML = `
                <h2>${item.series}</h2>
                <img src="${item.url}" alt="${item.name}" style="max-width: 100%;">
                <p>${item.name}</p>
            `;
            itemsDiv.appendChild(itemDiv);
        });
        contentDiv.appendChild(itemsDiv);
    } else {
        // Handle table generation
        const table = document.createElement('table');
        table.className = 'table';
        // Create a header row
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        const headers = ['Name', 'Series', 'Image'];
        headers.forEach(headerText => {
            const headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
        });
        // Insert data rows
        const tbody = table.createTBody();
        json.forEach(item => {
            const row = tbody.insertRow();
            const nameCell = row.insertCell();
            nameCell.textContent = item.name;
            const seriesCell = row.insertCell();
            seriesCell.textContent = item.series;
            const imageCell = row.insertCell();
            const image = document.createElement('img');
            image.src = item.url;
            image.alt = item.name;
            image.style.maxWidth = '100px'; // Set a max-width for images
            imageCell.appendChild(image);
        });
        contentDiv.appendChild(table);
    }
    // Handle copyright notice dynamically based on content
    handleCopyright(json);
}

function handleCopyright(json) {
    if (choice.includes('mario')) {
        copyright.innerHTML = 'Game trademarks and copyrights are properties of their respective owners. Nintendo properties are trademarks of Nintendo. © 2019 Nintendo.';
    } else if (choice.includes('starwars')) {
        copyright.innerHTML = 'Star Wars © & TM 2022 Lucasfilm Ltd. All rights reserved. Visual material © 2022 Electronic Arts Inc.';
    }
    contentDiv.appendChild(copyright);
}
})