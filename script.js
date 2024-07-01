document.addEventListener('DOMContentLoaded', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js');
    }

    displayFolders(); // Display existing folders on page load
});

function openFolder(folderName) {
    const folders = JSON.parse(localStorage.getItem('folders')) || [];
    const folder = folders.find(f => f.name === folderName);

    if (folder) {
        document.getElementById('folder-name-display').textContent = folder.name;
        const colorList = document.getElementById('color-list');
        colorList.innerHTML = ''; // Clear existing colors

        folder.hexCodes.forEach(hexCode => {
            const colorItem = document.createElement('div');
            colorItem.className = 'color-item';

            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = hexCode;

            const colorCode = document.createElement('p');
            colorCode.className = 'color-code';
            colorCode.textContent = hexCode;

            colorItem.appendChild(colorBox);
            colorItem.appendChild(colorCode);

            colorList.appendChild(colorItem);
        });

        document.getElementById('main-page').classList.add('hidden');
        document.getElementById('folder-page').classList.remove('hidden');
    }
}

function openCreateFolder() {
    document.getElementById('main-page').classList.add('hidden');
    document.getElementById('create-folder-page').classList.remove('hidden');
}

function goBack() {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById('main-page').classList.remove('hidden');
}

function addHexCode() {
    const hexCodeInput = document.createElement('input');
    hexCodeInput.type = 'text';
    hexCodeInput.name = 'hex-code';
    hexCodeInput.required = true;
    hexCodeInput.style.padding = '10px';
    hexCodeInput.style.marginBottom = '10px';
    hexCodeInput.style.border = 'none';
    hexCodeInput.style.borderRadius = '5px';
    hexCodeInput.style.backgroundColor = '#555';
    hexCodeInput.style.color = '#fff';
    document.getElementById('create-folder-form').insertBefore(hexCodeInput, document.querySelector('.add-hex-button'));
}

function createFolder(event) {
    event.preventDefault();
    
    // Get form data
    const folderName = document.getElementById('folder-name').value;
    const folderDescription = document.getElementById('folder-description').value;
    const hexCodes = Array.from(document.querySelectorAll('input[name="hex-code"]')).map(input => input.value);

    // Create new folder object
    const newFolder = {
        name: folderName,
        description: folderDescription,
        hexCodes: hexCodes
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

function displayFolders() {
    let folders = JSON.parse(localStorage.getItem('folders')) || [];
    let folderList = document.querySelector('.folder-list');
    folderList.innerHTML = ''; // Clear existing folders

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
        folderNameP.textContent = folder.name;

        folderDiv.appendChild(colorPreviewDiv);
        folderDiv.appendChild(folderNameP);

        folderList.appendChild(folderDiv);
    });
}
