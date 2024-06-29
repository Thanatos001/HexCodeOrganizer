const categories = document.querySelectorAll('.category');
const mainContent = document.querySelector('.main');

categories.forEach((category) => {
    category.addEventListener('click', () => {
        // Load content dynamically based on category selection
        const categoryName = category.querySelector('h2').textContent;
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
