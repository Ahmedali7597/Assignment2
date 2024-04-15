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

    function handleJsonResponse(data) {
        console.log('Received data:', data); // Log the entire data object

        let itemsArray = typeof data === 'string' ? JSON.parse(data) : data;

        contentDiv.innerHTML = ''; // Clear existing content

        if (isTableRequired) {
            // Generate a table with series, name, and link without images
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            // Add header row
            const headerRow = document.createElement('tr');
            ['Series', 'Name', 'Link'].forEach(text => {
                const th = document.createElement('th');
                th.innerText = text;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);

            // Add body rows
            itemsArray.forEach(item => {
                const bodyRow = document.createElement('tr');
                ['series', 'name', 'url'].forEach(key => {
                    const td = document.createElement('td');
                    if (key === 'url') {
                        const a = document.createElement('a');
                        a.href = item[key];
                        a.innerText = item[key];
                        a.target = '_blank'; // Open link in a new tab
                        td.appendChild(a);
                    } else {
                        td.innerText = item[key];
                    }
                    bodyRow.appendChild(td);
                });
                tbody.appendChild(bodyRow);
            });

            table.appendChild(thead);
            table.appendChild(tbody);
            contentDiv.appendChild(table);

            // Adjust the table style
            table.style.width = '100%';
            table.border = '1';
        } else {
            // Generate content with images for other buttons
            itemsArray.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.style.width = '33.3333%';
                itemDiv.style.float = 'left';
                itemDiv.style.boxSizing = 'border-box';

                const seriesTitle = document.createElement('h2');
                seriesTitle.innerText = item.series;
                itemDiv.appendChild(seriesTitle);

                if (!isTableRequired) {
                    const image = document.createElement('img');
                    image.src = item.url.replace(/\\/g, '');
                    image.alt = item.name;
                    image.style.width = '100%';
                    image.style.height = 'auto';
                    itemDiv.appendChild(image);
                }

                const nameCaption = document.createElement('p');
                nameCaption.innerText = item.name;
                itemDiv.appendChild(nameCaption);

                contentDiv.appendChild(itemDiv);
            });

            contentDiv.style.display = 'flex';
            contentDiv.style.flexWrap = 'wrap';
        }
    }
});
