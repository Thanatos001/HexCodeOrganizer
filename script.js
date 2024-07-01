document.addEventListener('DOMContentLoaded', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js');
    }

    displayFolders(); // Display existing folders on page load
    updateLastUsedFolder(); // Display last used folder on page load
});

function openFolder(folderName) {
    const folders = JSON.parse(localStorage.getItem('folders')) || [];
    const folder = folders.find(f => f.name === folderName);

    if (folder) {
        document.getElementById('folder-page-title').textContent = folder.name;
        document.getElementById('folder-description-display').textContent = folder.description || '';
        const colorList = document.getElementById('color-list');
        colorList.innerHTML = ''; // Clear existing colors

        folder.hexCodes.forEach((hexCode, index) => {
            const colorItem = document.createElement('div');
            colorItem.className = 'color-item';

            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = hexCode;

            const colorCode = document.createElement('p');
            colorCode.className = 'color-code';
            colorCode.textContent = hexCode;

            const deleteColorButton = document.createElement('button');
            deleteColorButton.className = 'delete-color-button';
            deleteColorButton.textContent = 'Delete';
            deleteColorButton.onclick = (e) => {
                e.stopPropagation();
                deleteColor(folder.name, index);
            };

            colorItem.appendChild(colorBox);
            colorItem.appendChild(colorCode);
            colorItem.appendChild(deleteColorButton);

            colorList.appendChild(colorItem);
        });

        document.getElementById('main-page').classList.add('hidden');
        document.getElementById('folder-page').classList.remove('hidden');
        
        // Update last used folder
        localStorage.setItem('lastUsed', folderName);
        updateLastUsedFolder();
    }
}

function openCreateFolder() {
    document.getElementById('main-page').classList.add('hidden');
    document.getElementById('create-folder-page').classList.remove('hidden');
    
    // Clear previous folder data
    document.getElementById('folder-name').value = '';
    document.getElementById('folder-description').value = '';
    document.getElementById('hex-code').value = '';
    document.getElementById('hex-codes-container').innerHTML = '';
}

function openEditFolder() {
    const folderName = document.getElementById('folder-page-title').textContent;
    const folders = JSON.parse(localStorage.getItem('folders')) || [];
    const folder = folders.find(f => f.name === folderName);

    if (folder) {
        const editHexCodesContainer = document.getElementById('edit-hex-codes-container');
        editHexCodesContainer.innerHTML = ''; // Clear existing hex codes

        folder.hexCodes.forEach((hexCode, index) => {
            const hexCodeDiv = document.createElement('div');
            hexCodeDiv.className = 'color-item';

            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = hexCode;

            const colorCode = document.createElement('input');
            colorCode.className = 'edit-color-input';
            colorCode.type = 'text';
            colorCode.value = hexCode;

            const deleteColorButton = document.createElement('button');
            deleteColorButton.className = 'delete-color-button';
            deleteColorButton.textContent = 'Delete';
            deleteColorButton.onclick = () => {
                hexCodeDiv.remove();
            };

            hexCodeDiv.appendChild(colorBox);
            hexCodeDiv.appendChild(colorCode);
            hexCodeDiv.appendChild(deleteColorButton);

            editHexCodesContainer.appendChild(hexCodeDiv);
        });

        document.getElementById('folder-page').classList.add('hidden');
        document.getElementById('edit-folder-page').classList.remove('hidden');
    }
}

function goBack() {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById('main-page').classList.remove('hidden');
}

function acceptHexCode() {
    const hexCodeInput = document.getElementById('hex-code');
    const hexCode = hexCodeInput.value.trim();

    if (!/^#[0-9A-F]{6}$/i.test(hexCode)) {
        alert('Please enter a valid hex code starting with #.');
        return;
    }

    if (hexCode) {
        const hexCodeDiv = document.createElement('div');
        hexCodeDiv.className = 'color-item';

        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = hexCode;

        const colorCode = document.createElement('p');
        colorCode.className = 'color-code';
        colorCode.textContent = hexCode;

        const deleteColorButton = document.createElement('button');
        deleteColorButton.className = 'delete-color-button';
        deleteColorButton.textContent = 'Delete';
        deleteColorButton.onclick = () => {
            hexCodeDiv.remove();
        };

        hexCodeDiv.appendChild(colorBox);
        hexCodeDiv.appendChild(colorCode);
        hexCodeDiv.appendChild(deleteColorButton);

        document.getElementById('hex-codes-container').appendChild(hexCodeDiv);
        hexCodeInput.value = ''; // Clear the input
    }
}

function addHexCodeInput() {
    const hexCodeInput = document.createElement('input');
    hexCodeInput.type = 'text';
    hexCodeInput.name = 'hex-code';
    hexCodeInput.required = true;
    hexCodeInput.className = 'edit-color-input';
    hexCodeInput.style.marginBottom = '10px';
    hexCodeInput.placeholder = '#000000';

    const deleteColorButton = document.createElement('button');
    deleteColorButton.className = 'delete-color-button';
    deleteColorButton.textContent = 'Delete';
    deleteColorButton.onclick = () => {
        hexCodeInput.remove();
        deleteColorButton.remove();
    };

    document.getElementById('edit-hex-codes-container').appendChild(hexCodeInput);
    document.getElementById('edit-hex-codes-container').appendChild(deleteColorButton);
}

function createFolder(event) {
    event.preventDefault();
    
    // Get form data
    const folderName = document.getElementById('folder-name').value;
    const folderDescription = document.getElementById('folder-description').value;
    const hexCodes = Array.from(document.querySelectorAll('#hex-codes-container .color-code')).map(item => item.textContent);

    // Create new folder object
    const newFolder = {
        name: folderName,
        description: folderDescription,
        hexCodes: hexCodes,
        createdAt: Date.now()
    };

    // Retrieve existing folders from local storage
    let folders = JSON.parse(localStorage.getItem('folders')) || [];

    // Add new folder to the list
    folders.push(newFolder);

    // Save updated folder list back to local storage
    localStorage.setItem('folders', JSON.stringify(folders));

    // Go back to the main page
    goBack();

    // Refresh the main page to display the new folder
    displayFolders();
}

function saveFolder() {
    const folderName = document.getElementById('folder-page-title').textContent;
    const folders = JSON.parse(localStorage.getItem('folders')) || [];
    const folderIndex = folders.findIndex(f => f.name === folderName);

    if (folderIndex > -1) {
        const hexCodes = Array.from(document.querySelectorAll('#edit-hex-codes-container .edit-color-input')).map(input => input.value);

        folders[folderIndex].hexCodes = hexCodes;

        // Save updated folder list back to local storage
        localStorage.setItem('folders', JSON.stringify(folders));

        // Go back to the folder view
        openFolder(folderName);
    }
}

function deleteColor(folderName, colorIndex) {
    const folders = JSON.parse(localStorage.getItem('folders')) || [];
    const folder = folders.find(f => f.name === folderName);

    if (folder) {
        folder.hexCodes.splice(colorIndex, 1);
        localStorage.setItem('folders', JSON.stringify(folders));
        openFolder(folderName);
    }
}

function displayFolders() {
    let folders = JSON.parse(localStorage.getItem('folders')) || [];
    let folderList = document.getElementById('folders-container');
    folderList.innerHTML = ''; // Clear existing folders

    const sortOption = document.getElementById('sort-options').value;
    if (sortOption === 'alphabetical') {
        folders.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'lastCreated') {
        folders.sort((a, b) => b.createdAt - a.createdAt);
    }

    folders.forEach(folder => {
        let folderDiv = document.createElement('div');
        folderDiv.className = 'folder';
        folderDiv.onclick = () => openFolder(folder.name);

        let colorPreviewDiv = document.createElement('div');
        colorPreviewDiv.className = 'color-preview';

        folder.hexCodes.forEach(hexCode => {
            let colorBoxDiv = document.createElement('div');
            colorBoxDiv.className = 'color-box';
            colorBoxDiv.style.backgroundColor = hexCode;
            colorPreviewDiv.appendChild(colorBoxDiv);
        });

       let folderNameP = document.createElement('p');
            folderNameP.className = 'folder-name';
            folderNameP.textContent = folder.name; // Add this line to complete the assignment
            folderDiv.appendChild(folderNameP);
        
function updateLastUsedFolder() {
    const lastUsed = localStorage.getItem('lastUsed');
    const lastUsedContainer = document.getElementById('last-used-folder');

    if (lastUsed) {
        const folders = JSON.parse(localStorage.getItem('folders')) || [];
        const folder = folders.find(f => f.name === lastUsed);

        if (folder) {
            lastUsedContainer.innerHTML = `
                <p class="folder-name">${folder.name}</p>
                <div class="color-preview">
                    ${folder.hexCodes.map(hexCode => `<div class="color-box" style="background-color: ${hexCode};"></div>`).join('')}
                </div>
            `;
        } else {
            lastUsedContainer.innerHTML = `<p>No recent folder used</p>`;
        }
    } else {
        lastUsedContainer.innerHTML = `<p>No recent folder used</p>`;
    }
}

function searchFolders() {
    const query = document.getElementById('search').value.toLowerCase();
    const folders = JSON.parse(localStorage.getItem('folders')) || [];
    const filteredFolders = folders.filter(folder => folder.name.toLowerCase().includes(query));
    const folderList = document.getElementById('folders-container');
    folderList.innerHTML = ''; // Clear existing folders

    filteredFolders.forEach(folder => {
        let folderDiv = document.createElement('div');
        folderDiv.className = 'folder';
        folderDiv.onclick = () => openFolder(folder.name);

        let colorPreviewDiv = document.createElement('div');
        colorPreviewDiv.className = 'color-preview';

        folder.hexCodes.forEach(hexCode => {
            let colorBoxDiv = document.createElement('div');
            colorBoxDiv.className = 'color-box';
            colorBoxDiv.style.backgroundColor = hexCode;
            colorPreviewDiv.appendChild(colorBoxDiv);
        });

        let folderNameP = document.createElement('p');
        folderNameP.className = 'folder-name';
        folderNameP.textContent = folder.name;

        folderDiv.appendChild(colorPreviewDiv);
        folderDiv.appendChild(folderNameP);

        folderList.appendChild(folderDiv);
    });
}

// Call updateLastUsedFolder on page load to display the last used folder
document.addEventListener('DOMContentLoaded', updateLastUsedFolder);
