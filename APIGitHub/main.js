// Tu usuario de GitHub
const GITHUB_USERNAME = 'Eduardo24012';

// URLs de la API con parámetros
const API_URLS = {
    user: `https://api.github.com/users/${GITHUB_USERNAME}`,
    repos: `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6&type=owner&direction=desc`,
    followers: `https://api.github.com/users/${GITHUB_USERNAME}/followers?per_page=5`
};

// Función para formatear fechas
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return `Hace ${Math.floor(diffDays / 365)} años`;
}

// Función para obtener el perfil del usuario
async function fetchUserProfile() {
    try {
        const response = await fetch(API_URLS.user);
        if (!response.ok) throw new Error('Error al obtener el perfil');
        
        const user = await response.json();
        
        // Actualizar el DOM con la información del usuario
        document.getElementById('avatar').src = user.avatar_url;
        document.getElementById('avatar').alt = user.name || user.login;
        document.getElementById('name').textContent = user.name || user.login;
        document.getElementById('bio').textContent = user.bio || 'Desarrollador de software';
        document.getElementById('location').textContent = user.location || 'Ubicación no especificada';
        document.getElementById('followers-count').textContent = `${user.followers} seguidores`;
        
        console.log('Perfil cargado:', user.login);
    } catch (error) {
        console.error('Error al cargar el perfil:', error);
        document.getElementById('name').textContent = 'Error al cargar perfil';
    }
}

// Función para obtener los repositorios
async function fetchRepositories() {
    try {
        const response = await fetch(API_URLS.repos);
        if (!response.ok) throw new Error('Error al obtener repositorios');
        
        const repos = await response.json();
        const projectsGrid = document.getElementById('projects-grid');
        
        if (repos.length === 0) {
            projectsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-light);">No hay proyectos disponibles</p>';
            return;
        }
        
        // Limpiar el grid
        projectsGrid.innerHTML = '';
        
        // Crear una tarjeta por cada repositorio
        repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            card.innerHTML = `
                <div class="project-header">
                    <h3 class="project-name">${repo.name}</h3>
                    ${repo.language ? `<span class="project-language">${repo.language}</span>` : ''}
                </div>
                <p class="project-description">${repo.description || 'Sin descripción disponible'}</p>
                <div class="project-meta">
                    <span class="project-stars">${repo.stargazers_count}</span>
                    <span class="project-updated">${formatDate(repo.updated_at)}</span>
                </div>
            `;
            
            // Hacer la tarjeta clickeable
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                window.open(repo.html_url, '_blank');
            });
            
            projectsGrid.appendChild(card);
        });
        
        console.log(`${repos.length} repositorios cargados`);
    } catch (error) {
        console.error('Error al cargar repositorios:', error);
        document.getElementById('projects-grid').innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-light);">Error al cargar proyectos</p>';
    }
}

// Función para obtener los seguidores
async function fetchFollowers() {
    try {
        const response = await fetch(API_URLS.followers);
        if (!response.ok) throw new Error('Error al obtener seguidores');
        
        const followers = await response.json();
        const followersList = document.getElementById('followers-list');
        
        if (followers.length === 0) {
            followersList.innerHTML = '<p style="color: var(--color-text-light);">No hay seguidores disponibles</p>';
            return;
        }
        
        // Limpiar la lista
        followersList.innerHTML = '';
        
        // Crear un avatar por cada seguidor
        followers.forEach(follower => {
            const followerItem = document.createElement('a');
            followerItem.className = 'follower-item';
            followerItem.href = follower.html_url;
            followerItem.target = '_blank';
            followerItem.title = follower.login;
            
            const avatar = document.createElement('img');
            avatar.src = follower.avatar_url;
            avatar.alt = follower.login;
            avatar.className = 'follower-avatar';
            
            followerItem.appendChild(avatar);
            followersList.appendChild(followerItem);
        });
        
        console.log(`${followers.length} seguidores cargados`);
    } catch (error) {
        console.error('Error al cargar seguidores:', error);
        document.getElementById('followers-list').innerHTML = '<p style="color: var(--color-text-light);">Error al cargar seguidores</p>';
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Iniciando carga del portafolio...');
    
    // Cargar todos los datos en paralelo
    await Promise.all([
        fetchUserProfile(),
        fetchRepositories(),
        fetchFollowers()
    ]);
    
    console.log('Portafolio cargado completamente');
});