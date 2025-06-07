// Función para manejar el estado activo de los nav-links
function handleNavLinks() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const logoLink = document.querySelector('.navbar-brand');

  // Función para remover la clase active de todos los links
  function removeActiveClass() {
    navLinks.forEach(link => {
      link.classList.remove('active');
    });
    // Limpiar el localStorage cuando se remueve la clase active
    localStorage.removeItem('lastClickedNav');
  }

  // Agregar event listener al logo
  logoLink.addEventListener('click', function() {
    removeActiveClass();
  });

  // Agregar event listeners a cada nav-link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      removeActiveClass();
      this.classList.add('active');
      
      // Guardar el último botón clickeado
      const linkText = this.textContent.trim();
      localStorage.setItem('lastClickedNav', linkText);
    });
  });

  // Establecer el link activo basado en el último click o la página actual
  const lastClickedNav = localStorage.getItem('lastClickedNav');
  
  if (lastClickedNav) {
    navLinks.forEach(link => {
      if (link.textContent.trim() === lastClickedNav) {
        link.classList.add('active');
      }
    });
  } else {
    // Si no hay último click guardado, usar la página actual
    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref === currentPage) {
        link.classList.add('active');
      }
    });
  }
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', handleNavLinks);
