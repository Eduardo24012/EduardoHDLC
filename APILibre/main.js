// URLs de la API
const API_BASE = 'https://dogapi.dog/api/v2';
const ENDPOINTS = {
    allBreeds: `${API_BASE}/breeds?page[size]=1000`,
    breedDetail: (id) => `${API_BASE}/breeds/${id}`
};

// Variables globales
let allBreeds = [];
let filteredBreeds = [];

// Elementos del DOM
const searchInput = document.getElementById('search-input');
const showAllBtn = document.getElementById('show-all-btn');
const breedsList = document.getElementById('breeds-list');
const loading = document.getElementById('loading');
const modal = document.getElementById('modal');
const closeModal = document.querySelector('.close');
const modalBody = document.getElementById('modal-body');

// Función para obtener todas las razas (Endpoint 1)
async function fetchAllBreeds() {
    try {
        showLoading(true);
        const response = await fetch(ENDPOINTS.allBreeds);
        
        if (!response.ok) {
            throw new Error('Error al obtener las razas');
        }
        
        const data = await response.json();
        allBreeds = data.data;
        filteredBreeds = allBreeds;
        
        console.log(`${allBreeds.length} razas cargadas`);
        displayBreeds(filteredBreeds);
        showLoading(false);
        
    } catch (error) {
        console.error('Error:', error);
        showLoading(false);
        breedsList.innerHTML = '<p style="text-align: center; color: #666;">Error al cargar las razas. Por favor, recarga la página.</p>';
    }
}

// Función para obtener detalles de una raza específica (Endpoint 2)
async function fetchBreedDetail(breedId) {
    try {
        const response = await fetch(ENDPOINTS.breedDetail(breedId));
        
        if (!response.ok) {
            throw new Error('Error al obtener detalles de la raza');
        }
        
        const data = await response.json();
        const breed = data.data.attributes;
        
        console.log('Detalles de la raza cargados:', breed.name);
        showBreedDetail(breed);
        
    } catch (error) {
        console.error('Error:', error);
        modalBody.innerHTML = '<p style="color: red;">Error al cargar los detalles de la raza.</p>';
    }
}

// Mostrar/ocultar loading
function showLoading(show) {
    if (show) {
        loading.classList.remove('hidden');
        breedsList.innerHTML = '';
    } else {
        loading.classList.add('hidden');
    }
}

// Renderizar lista de razas
function displayBreeds(breeds) {
    breedsList.innerHTML = '';
    
    if (breeds.length === 0) {
        breedsList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">No se encontraron razas.</p>';
        return;
    }
    
    breeds.forEach(breedData => {
        const breed = breedData.attributes;
        const card = document.createElement('div');
        card.className = 'breed-card';
        
        card.innerHTML = `
            <h3>${breed.name}</h3>
            <div class="breed-info">
                <p><strong>Esperanza de vida:</strong> ${breed.life?.min || '?'}-${breed.life?.max || '?'} años</p>
                ${breed.male_weight?.min ? `<p><strong>Peso (macho):</strong> ${breed.male_weight.min}-${breed.male_weight.max} kg</p>` : ''}
            </div>
        `;
        
        // Al hacer clic, mostrar detalles completos
        card.addEventListener('click', () => {
            fetchBreedDetail(breedData.id);
        });
        
        breedsList.appendChild(card);
    });
    
    console.log(`Mostrando ${breeds.length} razas`);
}

// Mostrar detalles de una raza en el modal
function showBreedDetail(breed) {
    modalBody.innerHTML = `
        <h2>${breed.name}</h2>
        
        <div class="detail-row">
            <span class="label">Descripción:</span>
            <span class="value">${breed.description || 'No disponible'}</span>
        </div>
        
        <div class="detail-row">
            <span class="label">Esperanza de vida:</span>
            <span class="value">${breed.life?.min || '?'} - ${breed.life?.max || '?'} años</span>
        </div>
        
        ${breed.male_weight?.min ? `
        <div class="detail-row">
            <span class="label">Peso del macho:</span>
            <span class="value">${breed.male_weight.min} - ${breed.male_weight.max} kg</span>
        </div>
        ` : ''}
        
        ${breed.female_weight?.min ? `
        <div class="detail-row">
            <span class="label">Peso de la hembra:</span>
            <span class="value">${breed.female_weight.min} - ${breed.female_weight.max} kg</span>
        </div>
        ` : ''}
        
        ${breed.hypoallergenic !== undefined ? `
        <div class="detail-row">
            <span class="label">Hipoalergénico:</span>
            <span class="value">${breed.hypoallergenic ? 'Sí' : 'No'}</span>
        </div>
        ` : ''}
    `;
    
    modal.classList.add('show');
}

// Buscar razas
function searchBreeds(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredBreeds = allBreeds;
    } else {
        filteredBreeds = allBreeds.filter(breedData => {
            const breedName = breedData.attributes.name.toLowerCase();
            return breedName.includes(searchTerm);
        });
    }
    
    displayBreeds(filteredBreeds);
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
    searchBreeds(e.target.value);
});

showAllBtn.addEventListener('click', () => {
    searchInput.value = '';
    filteredBreeds = allBreeds;
    displayBreeds(filteredBreeds);
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
});

// Cerrar modal al hacer clic fuera
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    console.log('Iniciando Dog Breeds Explorer...');
    fetchAllBreeds();
});