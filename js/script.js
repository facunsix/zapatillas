document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const currencySelect = document.getElementById('currency-select');
    const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
    const prices = document.querySelectorAll('.price');
    const body = document.body;
    
// Función para crear partículas optimizadas
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const isMobile = window.innerWidth < 768; // Cambiamos el breakpoint a un valor más realista
    const particleCount = isMobile ? 5 : 19// Aumentamos significativamente la cantidad
    
    // Solo limpiar si hay partículas existentes
    if (particlesContainer.children.length === 0) {
        particlesContainer.innerHTML = '';
    }

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Tamaño más variado
        const size = Math.random() * 30 + 5; // Entre 5px y 35px
        
        // Posición inicial aleatoria
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Valores de animación
        const delay = Math.random() * 25;
        const duration = 50 + Math.random() * 50; // Animación más larga
        const hue = 350 + Math.random() * 20;
        const lightness = 65 + Math.random() * 10;
        
        // Valores para movimiento horizontal
        const moveX = (Math.random() - 0.5) * 100; // Movimiento horizontal aleatorio

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.background = `hsla(${hue}, 80%, ${lightness}%, 0.35)`;
        particle.style.setProperty('--move-x', `${moveX}vw`); // Variable CSS para movimiento horizontal
        
        // Brillo adicional
        particle.style.boxShadow = `0 0 ${size/2}px ${size/4}px hsla(${hue}, 80%, ${lightness}%, 0.3)`;

        particlesContainer.appendChild(particle);
    }
}

// Inicializar partículas al cargar
window.addEventListener('load', createParticles);

// Recrear partículas al redimensionar (con throttling)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(createParticles, 200);
});

// Crear más partículas al hacer scroll
window.addEventListener('scroll', () => {
    const particles = document.querySelectorAll('.particle');
    if (particles.length < 300) { // Mantener un máximo de 300 partículas
        createParticles();
    }
});
    
    // --- Funcionalidad de Tema Claro/Oscuro ---
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Aplicar tema guardado o preferencia del sistema
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    } else {
        body.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
        themeToggle.innerHTML = systemPrefersDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', systemPrefersDark ? 'dark' : 'light');
    }

    // Cambiar tema al hacer clic
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        themeToggle.style.transform = 'rotate(360deg)';
        
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 500);
    });

    // --- Funcionalidad de Conversión de Moneda ---
    const exchangeRates = {
        ARS: 1, // Base
        USD: 1298.46, // Ejemplo: 1 USD = 1000 ARS
        BRL: 240.24, // Ejemplo: 1 BRL = 200 ARS
        PYG: 0.17, // Ejemplo: 1 PYG = 0.15 ARS
    };

    const currencySymbols = {
        ARS: '$',
        USD: '$',
        BRL: 'R$',
        PYG: '₲',
    };

    const formatCurrency = (amount, currency) => {
        if (currency === 'USD' || currency === 'BRL') {
            return `${currencySymbols[currency]}${amount.toLocaleString('es-AR', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            })}`;
        } else {
            return `${currencySymbols[currency]}${amount.toLocaleString('es-AR', { 
                minimumFractionDigits: 0, 
                maximumFractionDigits: 0 
            })}`;
        }
    };


    const updatePrices = (selectedCurrency) => {
        prices.forEach(priceElement => {
            const priceARS = parseFloat(priceElement.dataset.priceArs);
            let convertedPrice = priceARS;

            if (selectedCurrency !== 'ARS') {
                convertedPrice = priceARS / exchangeRates[selectedCurrency];
            }

            priceElement.textContent = formatCurrency(convertedPrice, selectedCurrency);
        });
    };

    // Establecer la moneda inicial
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency && exchangeRates[savedCurrency]) {
        currencySelect.value = savedCurrency;
        updatePrices(savedCurrency);
    } else {
        updatePrices(currencySelect.value);
    }

    currencySelect.addEventListener('change', (event) => {
        const selectedCurrency = event.target.value;
        localStorage.setItem('selectedCurrency', selectedCurrency);
        updatePrices(selectedCurrency);
        
        // Efecto visual al cambiar moneda
        event.target.style.transform = 'scale(1.05)';
        setTimeout(() => {
            event.target.style.transform = '';
        }, 300);
    });

    // --- Funcionalidad de WhatsApp ---
    const whatsappNumber = '+5493764634206'; // Reemplaza con tu número real
    
    whatsappButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.dataset.product;
            const message = `¡Hola! Me interesan las zapatillas ${productName}. ¿Podrías darme más información?`;
            const webLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
            
            window.open(webLink, '_blank');
        });
    });
    


    // Animación de carga suave
    document.querySelectorAll('.product-card, #hero').forEach(el => {
        el.style.animation = 'fadeIn 0.8s forwards';
    });
    
    // Actualizar partículas al cambiar tamaño de ventana
    window.addEventListener('resize', () => {
        createParticles();
    });
});


function openModal(videoSrc, talles, fotos) {
  const modal = document.getElementById("modal");
  const video = document.getElementById("modal-video");
  const tallesList = document.getElementById("talles-list");
  const gallery = document.getElementById("modal-gallery");

  // Cargar video
  video.src = videoSrc;
  video.play();

  // Cargar talles
  tallesList.innerHTML = "";
  talles.forEach(talle => {
    const span = document.createElement("span");
    span.textContent = talle;
    tallesList.appendChild(span);
  });

  // Cargar fotos
  gallery.innerHTML = "";
  fotos.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    gallery.appendChild(img);
  });

  // Mostrar modal con animación
  modal.style.display = "block";
  setTimeout(() => {
    modal.classList.add("active");
  }, 10);
}

function closeModal() {
  const modal = document.getElementById("modal");
  const video = document.getElementById("modal-video");
  
  // Iniciar animación de salida
  modal.classList.remove("active");
  
  // Esperar a que termine la animación antes de ocultar
  setTimeout(() => {
    modal.style.display = "none";
    video.pause();
    video.src = "";
  }, 300); // Debe coincidir con la duración de la transición CSS
}

 // Función para filtrar productos por marca
        function filterProducts(brand) {
            const allProducts = document.querySelectorAll('.product-card');
            let visibleCount = 0;
            
            allProducts.forEach(product => {
                if (brand === 'all' || product.getAttribute('data-brand') === brand) {
                    product.style.display = 'block';
                    product.style.animation = 'fadeIn 0.5s ease-out';
                    visibleCount++;
                } else {
                    product.style.display = 'none';
                }
            });
            
            // Actualizar contador en el botón "Todas"
            if (brand === 'all') {
                document.querySelector('.brand-card[data-brand="all"] .product-count').textContent = `(${allProducts.length})`;
            }
            
            return visibleCount;
        }

        // Función para contar productos por marca
        function updateProductCounts() {
            const brands = ['all', 'adidas', 'puma', 'new-balance', 'vans', 'cat'];
            const countMap = {};
            const allProducts = document.querySelectorAll('.product-card');
            
            // Inicializar contadores
            brands.forEach(brand => {
                countMap[brand] = 0;
            });
            
            // Contar productos por marca
            allProducts.forEach(product => {
                const brand = product.getAttribute('data-brand');
                countMap[brand]++;
                countMap['all']++;
            });
            
            // Actualizar tarjetas de marca
            document.querySelectorAll('.brand-card').forEach(card => {
                const brand = card.getAttribute('data-brand');
                const count = countMap[brand] || 0;
                const countElement = card.querySelector('.product-count');
                
                if (countElement) {
                    countElement.textContent = `(${count})`;
                } else {
                    const newCountElement = document.createElement('span');
                    newCountElement.classList.add('product-count');
                    newCountElement.textContent = `(${count})`;
                    card.querySelector('.brand-name').appendChild(newCountElement);
                }
            });
        }

        // Inicialización
        document.addEventListener('DOMContentLoaded', function() {
            // Actualizar contadores
            updateProductCounts();
            
            // Filtrar todos los productos inicialmente
            filterProducts('all');
            
            // Event listeners para las tarjetas de marca
            document.querySelectorAll('.brand-card').forEach(card => {
                card.addEventListener('click', function(e) {
                    e.preventDefault();
                    const brand = this.getAttribute('data-brand');
                    
                    // Actualizar clase activa
                    document.querySelectorAll('.brand-card').forEach(c => {
                        c.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    // Filtrar productos
                    filterProducts(brand);
                });
            });
            
          
        });
        
        document.addEventListener('DOMContentLoaded', () => {
            // Funcionalidad de WhatsApp para productos Skalas
            const whatsappButtons = document.querySelectorAll('.skalas-whatsapp-btn');
            const whatsappNumber = '+5493764634206';
            
            whatsappButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const productName = button.dataset.product;
                    const message = `¡Hola! Me interesa la crema ${productName}. ¿Podrías darme más información?`;
                    const webLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
                    
                    window.open(webLink, '_blank');
                });
            });
            });


            document.querySelectorAll('.skalas-product-card').forEach(card => {
    const image = card.querySelector('.skalas-product-image');
    const title = card.querySelector('h3')?.textContent;
    const line = card.querySelector('.skalas-line')?.textContent;
    const priceCaja = card.querySelector('.price-box:nth-child(1) .price')?.textContent;
    const priceUnidad = card.querySelector('.price-box:nth-child(2) .price')?.textContent;

    image.addEventListener('click', () => {
        document.querySelector('#skalas-modal').style.display = 'flex';
        document.querySelector('.skalas-modal-img').src = image.src;
        document.querySelector('.skalas-modal-title').textContent = title;
        document.querySelector('.skalas-modal-line').textContent = line;
        document.querySelector('.price-caja').textContent = priceCaja;
        document.querySelector('.price-unidad').textContent = priceUnidad;
    });
});

document.getElementById("floatingBtn").addEventListener("click", function() {
    const menu = document.getElementById("floatingMenu");
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
});
