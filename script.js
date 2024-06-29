const categories = document.querySelectorAll('.category');
const mainContent = document.querySelector('.main');
const addCategoryButton = document.querySelector('.add-category');
let lastUsedCategory = null;
let categoriesList = [];

addCategoryButton.addEventListener('click', () => {
    const categoryName = prompt('Enter a new category name:');
    if (categoryName) {
        const newCategory = document.createElement('div');
        newCategory.className = 'category';
        newCategory.innerHTML = `<h2>${categoryName}</h2>`;
        categoriesList.push(categoryName);
        document.querySelector('.categories').appendChild(newCategory);
    }
});

categories.forEach((category) => {
    category.addEventListener('click', () => {
        const categoryName = category.querySelector('h2').textContent;
        lastUsedCategory = categoryName;
        loadContent(categoryName);
    });
});

function loadContent(categoryName) {
    // Load content from a separate HTML file or API
    // For demonstration purposes, we'll just load a static HTML content
    const content = `
        <div class="section">
            <div class="header">
                <h1>HEX Code Organizer</h1>
                <div class="back-button">←</div>
            </div>
            <div class="content">
<h2>${categoryName}</h2>
                <!-- Hex code list will be loaded dynamically -->
                <ul>
                    <li>#1F1F22</li>
                    <li>#2A2D31</li>
                    <li>#313339</li>
                    <li>#FCFCFC</li>
                    <li>#22A55A</li>
                    <li>#FE6057</li>
                </ul>
            </div>
        </div>
    `;
    mainContent.innerHTML = content;
}

// Load categories from local storage
if (localStorage.categories) {
    categoriesList = JSON.parse(localStorage.categories);
    categoriesList.forEach((category) => {
        const newCategory = document.createElement('div');
        newCategory.className = 'category';
        newCategory.innerHTML = `<h2>${category}</h2>`;
        document.querySelector('.categories').appendChild(newCategory);
    });
}

// Save categories to local storage
document.addEventListener('beforeunload', () => {
    localStorage.categories = JSON.stringify(categoriesList);
});
