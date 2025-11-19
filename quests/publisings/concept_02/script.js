document.addEventListener('DOMContentLoaded', () => {

    // --- DATA ---
    let brands = [
        { id: 1, rank: 1, brand_name: "Cartier", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Cartier_logo.svg/2560px-Cartier_logo.svg.png", score: 98.2, last_updated: "2025-11-18" },
        { id: 2, rank: 2, brand_name: "Tiffany & Co.", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Tiffany_%26_Co._logo.svg/2560px-Tiffany_%26_Co._logo.svg.png", score: 95.5, last_updated: "2025-11-17" },
        { id: 3, rank: 3, brand_name: "Bvlgari", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bulgari_logo.svg/2560px-Bulgari_logo.svg.png", score: 92.8, last_updated: "2025-11-18" },
        { id: 4, rank: 4, brand_name: "Van Cleef & Arpels", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Van_Cleef_%26_Arpels_logo.svg/2560px-Van_Cleef_%26_Arpels_logo.svg.png", score: 91.0, last_updated: "2025-11-16" },
        { id: 5, rank: 5, brand_name: "Hermès", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Hermes_logo.svg/2560px-Hermes_logo.svg.png", score: 89.7, last_updated: "2025-11-19" }
    ];

    // --- DOM Elements ---
    const tableBody = document.querySelector('#brand-ranking-table tbody');
    const addBrandBtn = document.getElementById('add-new-brand-btn');
    const editModal = document.getElementById('brand-edit-modal');
    const deleteModal = document.getElementById('delete-confirm-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const brandForm = document.getElementById('brand-form');
    const modalTitle = document.getElementById('modal-title');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

    let brandToDeleteId = null;

    // --- FUNCTIONS ---

    /**
     * Re-renders the table based on the current state of the 'brands' array.
     */
    const renderTable = () => {
        tableBody.innerHTML = '';
        if (brands.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No brands found.</td></tr>';
            return;
        }
        
        // Sort brands by score descending to determine rank
        brands.sort((a, b) => b.score - a.score);
        
        brands.forEach((brand, index) => {
            brand.rank = index + 1; // Update rank based on sorted order
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${brand.rank}</td>
                <td>${brand.brand_name}</td>
                <td><img src="${brand.logo_url}" alt="${brand.brand_name} Logo" class="logo-img"></td>
                <td>${brand.score}</td>
                <td>${brand.last_updated}</td>
                <td class="actions-cell">
                    <button class="edit-btn" data-id="${brand.id}" title="Edit">✏️</button>
                    <button class="delete-btn" data-id="${brand.id}" title="Delete">🗑️</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    };

    /**
     * Opens the Create/Edit modal.
     * @param {object|null} brand - The brand object to edit, or null to create.
     */
    const openEditModal = (brand = null) => {
        brandForm.reset();
        if (brand) {
            modalTitle.textContent = 'Edit Brand';
            document.getElementById('brand-id').value = brand.id;
            document.getElementById('brand_name').value = brand.brand_name;
            document.getElementById('score').value = brand.score;
            document.getElementById('logo_url').value = brand.logo_url;
        } else {
            modalTitle.textContent = 'Add New Brand';
            document.getElementById('brand-id').value = '';
        }
        editModal.style.display = 'flex';
    };

    /**
     * Opens the Delete confirmation modal.
     * @param {number} id - The ID of the brand to delete.
     */
    const openDeleteModal = (id) => {
        brandToDeleteId = id;
        deleteModal.style.display = 'flex';
    };

    /**
     * Closes all modals.
     */
    const closeModals = () => {
        editModal.style.display = 'none';
        deleteModal.style.display = 'none';
    };

    /**
     * Handles the form submission for creating or updating a brand.
     * @param {Event} e - The form submission event.
     */
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const id = document.getElementById('brand-id').value;
        const newBrandData = {
            brand_name: document.getElementById('brand_name').value,
            score: parseFloat(document.getElementById('score').value),
            logo_url: document.getElementById('logo_url').value,
            last_updated: new Date().toISOString().split('T')[0] // YYYY-MM-DD
        };

        if (id) { // Update existing brand
            const index = brands.findIndex(b => b.id == id);
            if (index !== -1) {
                brands[index] = { ...brands[index], ...newBrandData };
            }
        } else { // Create new brand
            newBrandData.id = Date.now(); // Simple unique ID
            brands.push(newBrandData);
        }
        
        renderTable();
        closeModals();
    };

    /**
     * Handles the confirmed deletion of a brand.
     */
    const handleDeleteConfirm = () => {
        if (brandToDeleteId) {
            brands = brands.filter(b => b.id !== brandToDeleteId);
            brandToDeleteId = null;
            renderTable();
            closeModals();
        }
    };

    // --- EVENT LISTENERS ---

    addBrandBtn.addEventListener('click', () => openEditModal());

    tableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.dataset.id;
            const brand = brands.find(b => b.id == id);
            if (brand) openEditModal(brand);
        }
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            openDeleteModal(parseInt(id));
        }
    });

    brandForm.addEventListener('submit', handleFormSubmit);
    confirmDeleteBtn.addEventListener('click', handleDeleteConfirm);
    
    // Listeners for closing modals
    closeModalBtns.forEach(btn => btn.addEventListener('click', closeModals));
    cancelBtn.addEventListener('click', closeModals);
    cancelDeleteBtn.addEventListener('click', closeModals);
    
    // Close modal if clicking on the overlay
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeModals();
    });
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) closeModals();
    });


    // --- INITIALIZATION ---
    renderTable();
});
