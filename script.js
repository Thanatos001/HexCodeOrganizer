document.addEventListener("DOMContentLoaded", () => {
    const createButton = document.querySelector('.create-new');
    const creationSection = document.querySelector('.creation');
    const detailsSection = document.querySelector('.details');

    createButton.addEventListener('click', () => {
        creationSection.style.display = 'block';
        detailsSection.style.display = 'none';
    });

    const addHexButton = document.querySelector('.add-hex');
    addHexButton.addEventListener('click', () => {
        const hexInput = creationSection.querySelector('input[placeholder="Hex Code"]');
        if (hexInput.value) {
            const newHex = document.createElement('div');
            newHex.className = 'hex-preview';
            newHex.textContent = hexInput.value;
            creationSection.appendChild(newHex);
            hexInput.value = '';
        }
    });

    const createFolderButton = document.querySelector('.create');
    createFolderButton.addEventListener('click', () => {
        const folderName = creationSection.querySelector('input[placeholder="Name"]').value;
        if (folderName) {
            const newFolder = document.createElement('div');
            newFolder.className = 'hex-folder';
            newFolder.textContent = folderName;
            document.querySelector('.list').appendChild(newFolder);
            creationSection.querySelectorAll('input').forEach(input => input.value = '');
            creationSection.style.display = 'none';
        }
    });
});
