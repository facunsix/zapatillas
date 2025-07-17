document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const currencySelect = document.getElementById('currency-select');
    const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
    const prices = document.querySelectorAll('.price');
    const body = document.body;
    
    // Crear efecto de partículas mejorado
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 25;
        
        // Limpiar partículas existentes
        particlesContainer.innerHTML = '';
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Tamaño y posición aleatorios (evitando bordes)
            const size = Math.random() * 30 + 10;
            const posX = Math.random() * 80 + 10; // Entre 10% y 90%
            const posY = Math.random() * 80 + 10; // Entre 10% y 90%
            const animationDelay = Math.random() * 15;
            const hue = 350 + Math.random() * 20; // Tonos rojos
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.animationDelay = `${animationDelay}s`;
            particle.style.background = `hsla(${hue}, 70%, 60%, 0.15)`;
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // Iniciar partículas
    createParticles();
    
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
        USD: 1000, // Ejemplo: 1 USD = 1000 ARS
        BRL: 200, // Ejemplo: 1 BRL = 200 ARS
        PYG: 0.15, // Ejemplo: 1 PYG = 0.15 ARS
    };

    const currencySymbols = {
        ARS: '$',
        USD: 'U$D',
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