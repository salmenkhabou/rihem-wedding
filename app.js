document.addEventListener('DOMContentLoaded', () => {
  // CONFIGURATION: Deploy your Google Apps Script and paste the web app URL here.
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz5n5-RrzdaNefnWm7l-kUMR2mP9VpkECkamka0yagbAZUOJPDva6yboNIJus8Gklft/exec";

  // Elements
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelope = document.getElementById('envelope');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const mainContent = document.getElementById('main-content');
  
  const musicToggle = document.getElementById('music-toggle');
  const musicIcon = document.getElementById('music-icon');
  const bgMusic = document.getElementById('bg-music');

  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpResponse = document.getElementById('rsvp-response');
  const submitBtn = document.getElementById('submit-btn');

  // Mobile Nav Elements
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Lightbox Elements
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxImg = document.getElementById('lightbox-img');

  // Photo Hub Elements
  const uploadZone = document.getElementById('upload-zone');
  const photoInput = document.getElementById('photo-input');
  const progressContainer = document.getElementById('upload-status-container');
  const progressBar = document.getElementById('upload-progress-bar');
  const percentageText = document.getElementById('upload-percentage');
  const filenameText = document.getElementById('upload-filename');
  const statusMsg = document.getElementById('upload-status-msg');
  const galleryGrid = document.getElementById('gallery-grid');

  // 1. Envelope Opening Logic
  waxSealBtn.addEventListener('click', () => {
    envelope.classList.add('open');
    playMusic();

    setTimeout(() => {
      envelopeWrapper.style.opacity = '0';
      envelopeWrapper.style.pointerEvents = 'none';
      mainContent.classList.add('visible');
      
      // Load default showcase gallery items (safely check first)
      loadGallery();

      // Trigger scroll reveals for initial elements
      setTimeout(() => {
        revealCards.forEach(card => {
          const rect = card.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
            card.classList.add('revealed');
          }
        });
      }, 100);

      setTimeout(() => {
        envelopeWrapper.style.display = 'none';
      }, 1000);
    }, 1500);
  });

  // 2. Music Player Logic
  let isPlaying = false;

  function playMusic() {
    bgMusic.play()
      .then(() => {
        isPlaying = true;
        musicIcon.textContent = 'pause';
        musicToggle.classList.add('audio-playing');
      })
      .catch(err => {
        console.log("Audio autoplay prevented: ", err);
      });
  }

  function toggleMusic() {
    if (isPlaying) {
      bgMusic.pause();
      isPlaying = false;
      musicIcon.textContent = 'music_note';
      musicToggle.classList.remove('audio-playing');
    } else {
      playMusic();
    }
  }

  musicToggle.addEventListener('click', toggleMusic);

  // 3. Countdown Timer - Mohamed & Rihem: July 11, 2026 at 7:00 PM (19:00:00)
  const targetDate = new Date('July 11, 2026 19:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 4. RSVP/Message Form Submission (Saves locally on node server)
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin h-4 w-4 text-charcoal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Envoi en cours...</span>
    `;

    const rsvpData = {
      name: document.getElementById('rsvp-name').value,
      email: document.getElementById('rsvp-email').value,
      attendance: 'attending', // Default value required by the backend schema
      guests: 0,               // Default guests value
      dietary: '',             // Default dietary value
      message: document.getElementById('rsvp-message').value
    };

    fetch('/api/rsvp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rsvpData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      rsvpResponse.classList.remove('hidden');
      rsvpResponse.style.backgroundColor = 'rgba(197, 168, 128, 0.1)';
      rsvpResponse.style.borderColor = '#c5a880';
      rsvpResponse.style.color = '#997c55';
      
      rsvpResponse.innerHTML = `
        <h4 class="font-serif text-lg font-semibold mb-1 text-gold-dark">Message Envoyé !</h4>
        <p class="font-sans text-xs font-medium">Merci, ${rsvpData.name} ! Votre présence a été confirmée et votre note a été enregistrée.</p>
      `;
      
      rsvpForm.style.display = 'none';
    })
    .catch(error => {
      console.error('Error submitting RSVP:', error);
      rsvpResponse.classList.remove('hidden');
      rsvpResponse.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
      rsvpResponse.style.borderColor = '#ef4444';
      rsvpResponse.style.color = '#ef4444';
      rsvpResponse.innerHTML = `
        <h4 class="font-serif text-lg font-semibold mb-1">Échec de l'envoi</h4>
        <p class="font-sans text-xs">Un problème de connexion est survenu lors de l'enregistrement. Veuillez réessayer ou nous contacter directement.</p>
      `;
      
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    });
  });

  // 6. Showcase Gallery (Renders only static wedding showcase photos)
  function loadGallery() {
    if (!galleryGrid) return;
    
    const DEFAULT_PHOTOS = [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600',
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600'
    ];
    galleryGrid.innerHTML = '';
    DEFAULT_PHOTOS.forEach(photoUrl => {
      const card = document.createElement('div');
      card.className = 'overflow-hidden rounded-lg border border-gold/30 shadow-md aspect-square relative group bg-[#eae3d2]/20 cursor-pointer';
      
      const img = document.createElement('div');
      img.className = 'absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500';
      img.style.backgroundImage = `url('${photoUrl}')`;
      
      card.appendChild(img);

      // Open in lightbox on click
      card.addEventListener('click', () => {
        openLightbox(photoUrl);
      });

      galleryGrid.appendChild(card);
    });
  }

  // 7. Dynamic File Upload Handlers (Uploads directly to Google Drive)
  uploadZone.addEventListener('click', () => photoInput.click());

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    uploadZone.addEventListener(eventName, () => uploadZone.classList.add('drag-over'), false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    uploadZone.addEventListener(eventName, () => uploadZone.classList.remove('drag-over'), false);
  });

  // Handle dropped files
  uploadZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  });

  // Handle selected file
  photoInput.addEventListener('change', (e) => {
    if (photoInput.files.length > 0) {
      uploadFile(photoInput.files[0]);
    }
  });

  function uploadFile(file) {
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      showUploadStatus('Veuillez sélectionner un fichier image (JPG, PNG, WEBP, GIF).', 'error');
      return;
    }

    // Check if configuration is set
    if (APPS_SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
      showUploadStatus('Veuillez d\'abord configurer votre Google Apps Script.', 'error');
      return;
    }

    // Display progress UI
    filenameText.textContent = file.name;
    progressBar.style.width = '20%';
    percentageText.textContent = '20%';
    progressContainer.classList.remove('hidden');
    statusMsg.classList.add('hidden');

    // Read file as base64
    const reader = new FileReader();
    reader.onload = function(e) {
      progressBar.style.width = '50%';
      percentageText.textContent = '50%';
      
      const base64 = e.target.result.split(',')[1];
      const payload = {
        base64: base64,
        mimeType: file.type,
        fileName: file.name
      };

      progressBar.style.width = '70%';
      percentageText.textContent = '70%';

      // POST to Google Apps Script Web App
      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      })
      .then(res => {
        progressBar.style.width = '90%';
        percentageText.textContent = '90%';
        if (!res.ok) {
          throw new Error('Le serveur a retourné un statut d\'erreur ' + res.status);
        }
        return res.json();
      })
      .then(data => {
        progressBar.style.width = '100%';
        percentageText.textContent = '100%';

        if (data.success) {
          showUploadStatus('Photo téléversée directement sur Google Drive avec succès !', 'success');
        } else {
          showUploadStatus('Erreur de téléversement Google Drive : ' + data.error, 'error');
        }

        setTimeout(() => {
          progressContainer.classList.add('hidden');
        }, 3000);
      })
      .catch(error => {
        console.error('Error uploading to Drive:', error);
        showUploadStatus('Échec du téléversement. Erreur de connexion.', 'error');
        progressContainer.classList.add('hidden');
      });
    };

    reader.onerror = function() {
      showUploadStatus('Échec de la lecture des données du fichier.', 'error');
      progressContainer.classList.add('hidden');
    };

    reader.readAsDataURL(file);
  }

  function showUploadStatus(msg, type) {
    statusMsg.textContent = msg;
    statusMsg.classList.remove('hidden', 'bg-red-500/10', 'border-red-500', 'text-red-300', 'bg-gold/10', 'border-gold', 'text-gold-light');
    
    if (type === 'success') {
      statusMsg.classList.add('bg-gold/10', 'border', 'border-gold', 'text-gold-light');
    } else {
      statusMsg.classList.add('bg-red-500/10', 'border', 'border-red-500', 'text-red-300');
    }
  }

  // 8. Copy Website Link Handler
  const copyLinkBtn = document.getElementById('copy-link-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      const siteUrl = 'https://rihem-mohamed-wedding.netlify.app/';
      
      function showSuccess() {
        copyBtnText.textContent = 'Lien copié !';
        copyLinkBtn.classList.add('bg-gold/40');
        setTimeout(() => {
          copyBtnText.textContent = 'Partager le lien';
          copyLinkBtn.classList.remove('bg-gold/40');
        }, 2000);
      }

      function fallbackCopyText(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            showSuccess();
          } else {
            console.error('Fallback copy failed');
          }
        } catch (err) {
          console.error('Fallback copy error: ', err);
        }
        document.body.removeChild(textArea);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(siteUrl)
          .then(showSuccess)
          .catch(err => {
            console.error('Failed to copy link using clipboard API: ', err);
            fallbackCopyText(siteUrl);
          });
      } else {
        fallbackCopyText(siteUrl);
      }
    });
  }

  // 10. Lightbox Modal Controller
  function openLightbox(photoUrl) {
    if (lightboxImg && lightboxModal) {
      lightboxImg.src = photoUrl;
      lightboxImg.alt = "Agrandissement";
      lightboxModal.classList.add('active');
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Close lightbox or mobile menu on Escape key press
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        if (menuIcon) {
          menuIcon.textContent = 'menu';
          menuIcon.classList.remove('text-gold');
        }
      }
    }
  });

  // 11. Scroll Reveal Intersection Observer
  const revealCards = document.querySelectorAll('.reveal-card');
  const observerOptions = {
    root: null,
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  };

  const cardObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealCards.forEach(card => {
    cardObserver.observe(card);
  });
});
