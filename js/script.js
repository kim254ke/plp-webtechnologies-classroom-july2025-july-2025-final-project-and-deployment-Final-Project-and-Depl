/* ============================================================
   DOM HELPERS
   ============================================================ */
   const $ = (sel, ctx = document) => ctx.querySelector(sel);
   const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
   
   /* ============================================================
      MOBILE MENU TOGGLE
      ============================================================ */
   const mobileBtn = $('#mobileMenuBtn');
   const navLinks = $('#navLinks');
   
   mobileBtn?.addEventListener('click', () => {
     navLinks.classList.toggle('open');
   });
   
   /* ============================================================
      CAROUSEL (Homepage)
      ============================================================ */
   (function carouselModule(){
     const slides = $$('.slide');
     const prev = $('.carousel-nav.prev');
     const next = $('.carousel-nav.next');
     const dotsWrap = $('#carouselDots');
     const carousel = $('.carousel');
   
     if (!slides.length) return;
   
     let index = 0;
     let timer = null;
   
     // Create navigation dots
     slides.forEach((s, i) => {
       const b = document.createElement('button');
       b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
       b.addEventListener('click', () => goTo(i));
       dotsWrap.appendChild(b);
     });
   
     const dots = $$('#carouselDots button');
   
     function render() {
       slides.forEach((s, i) => s.classList.toggle('active', i === index));
       dots.forEach((d, i) => d.classList.toggle('active', i === index));
     }
   
     function goTo(i) {
       index = (i + slides.length) % slides.length;
       render();
       resetTimer();
     }
   
     function nextSlide() { goTo(index + 1); }
     function prevSlide() { goTo(index - 1); }
   
     next?.addEventListener('click', nextSlide);
     prev?.addEventListener('click', prevSlide);
   
     // Auto-slide
     function resetTimer() {
       clearInterval(timer);
       timer = setInterval(nextSlide, 5000);
     }
   
     // Pause on hover
     carousel?.addEventListener('mouseenter', () => clearInterval(timer));
     carousel?.addEventListener('mouseleave', resetTimer);
   
     render();
     resetTimer();
   })();
   
   /* ============================================================
      FADE-IN ON SCROLL (Intersection Observer)
      ============================================================ */
   (function scrollReveal(){
     const faders = $$('.fade-in');
     const io = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
         if (entry.isIntersecting) {
           entry.target.classList.add('show');
           io.unobserve(entry.target);
         }
       });
     }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });
   
     faders.forEach(f => io.observe(f));
   })();
   
   /* ============================================================
      VIDEO MODAL
      ============================================================ */
   const videoModal = $('#videoModal');
   const openVideo = $('#openVideo');
   const closeVideo = $('#closeVideo');
   const heroVideo = $('#heroVideo');
   
   openVideo?.addEventListener('click', () => {
     videoModal?.setAttribute('aria-hidden', 'false');
     heroVideo?.play();
   });
   
   closeVideo?.addEventListener('click', () => {
     heroVideo?.pause();
     heroVideo.currentTime = 0;
     videoModal?.setAttribute('aria-hidden', 'true');
   });
   
   videoModal?.addEventListener('click', (e) => {
     if (e.target === videoModal) closeVideo.click();
   });
   
   // Close with ESC key
   document.addEventListener('keydown', (e) => {
     if (e.key === "Escape" && videoModal?.getAttribute('aria-hidden') === 'false') {
       closeVideo.click();
     }
   });
   
   /* ============================================================
      SMOOTH SCROLL FOR IN-PAGE ANCHORS
      ============================================================ */
   document.addEventListener('click', (e) => {
     const anchor = e.target.closest('a[href^="#"]');
     if (!anchor) return;
     e.preventDefault();
     const id = anchor.getAttribute('href').slice(1);
     const el = document.getElementById(id);
     if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
   });
   
   /* ============================================================
      FORM VALIDATION HELPERS
      ============================================================ */
   function showMessage(el, text, type = "error") {
     if (!el) return;
     el.textContent = text;
     el.className = type === "success" ? "msg-success" : "msg-error";
   }
   
   /* ============================================================
      BOOKING FORM VALIDATION
      ============================================================ */
   $('#bookingForm')?.addEventListener('submit', function(e){
     e.preventDefault();
     const name = this.querySelector('#name')?.value.trim();
     const email = this.querySelector('#email')?.value.trim();
     const pkg = this.querySelector('#package')?.value;
     const date = this.querySelector('#date')?.value;
     const msg = $('#formMessage');
   
     if (!name || !email || !pkg || !date) {
       showMessage(msg, "⚠️ Please fill all fields.", "error");
       return;
     }
   
     showMessage(msg, `✅ Thank you, ${name}! Your booking for the ${pkg} has been received.`, "success");
     this.reset();
   });
   
   /* ============================================================
      CONTACT FORM VALIDATION
      ============================================================ */
   $('#contactForm')?.addEventListener('submit', function(e){
     e.preventDefault();
     const name = this.querySelector('#name')?.value.trim();
     const email = this.querySelector('#email')?.value.trim();
     const message = this.querySelector('#message')?.value.trim();
     const msg = $('#contactMessage');
   
     if (!name || !email || !message) {
       showMessage(msg, "⚠️ Please fill in all fields.", "error");
       return;
     }
   
     showMessage(msg, `✅ Thank you, ${name}! Your message has been sent.`, "success");
     this.reset();
   });
   