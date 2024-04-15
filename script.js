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
        
        // Parse the JSON string if it's a string, otherwise use it directly
        let itemsArray = typeof data === 'string' ? JSON.parse(data) : data;
        
        contentDiv.innerHTML = ''; // Clear existing content
    
        itemsArray.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.style.width = '33.3333%'; // Assume 3 items, adjust for more/less
            itemDiv.style.float = 'left'; // Make divs align horizontally
            itemDiv.style.boxSizing = 'border-box'; // Include padding and border in the element's total width and height
            
            // Create and append the series title
            const seriesTitle = document.createElement('h2');
            seriesTitle.innerText = item.series;
            itemDiv.appendChild(seriesTitle);
            
            // Create and append the image
            const image = document.createElement('img');
            image.src = item.url.replace(/\\/g, ''); // Remove escape characters for the URL
            image.alt = item.name;
            image.style.width = '100%'; // Make the image responsive to the div's width
            image.style.height = 'auto';
            itemDiv.appendChild(image);
            
            // Create and append the name caption
            const nameCaption = document.createElement('p');
            nameCaption.innerText = item.name;
            itemDiv.appendChild(nameCaption);
            
            contentDiv.appendChild(itemDiv);
        });
    
        // Adjust contentDiv style to handle overflow from floats
        contentDiv.style.display = 'flex';
        contentDiv.style.flexWrap = 'wrap';
    }
    
    function setCopyrightNotice(choice) {
        // Dynamically set the copyright notice
        const copyright = document.createElement('p');
        choice = choice.toLowerCase();
        if (choice.includes('mario')) {
            copyright.innerHTML = 'Game trademarks and copyrights are properties of their respective owners. Nintendo properties are trademarks of Nintendo. © 2019 Nintendo.';
        } else if (choice.includes('starwars')) {
            copyright.innerHTML = 'Star Wars © & TM 2022 Lucasfilm Ltd. All rights reserved. Visual material © 2022 Electronic Arts Inc.';
        } else {
            // Default or other cases can be added here
        }
        contentDiv.appendChild(copyright);
    }
})