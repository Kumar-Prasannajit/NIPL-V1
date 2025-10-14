// ---------- Lenis (Smooth Scrolling) ----------
const lenis = new Lenis({ duration: 1.2, smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// ---------- NAVBAR ----------
function initNavbar() {
  const nav = document.querySelector("#nav");
  const landingPage = document.querySelector("#landingPage");
  if (!nav) return;

  const landingHeight = landingPage ? landingPage.offsetHeight : 0;
  let lastScrollTop = 0, scrollTimeout;
  const navbarHeight = nav.offsetHeight + 20;

  const showNavbar = () => gsap.to(nav, { y: 0, duration: 0.25, ease: "power2.out" });
  const hideNavbar = () => {
    if (window.scrollY > landingHeight)
      gsap.to(nav, { y: -navbarHeight, duration: 0.3, ease: "power.inOut" });
  };
}

// ---------- HAMBURGER MENU ----------
function initHamburgerMenu() {
  const hamburger = document.getElementById("navHamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeBtn = document.getElementById("closeBtn");
  if (!hamburger || !mobileMenu || !closeBtn) return;

  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
    const links = mobileMenu.querySelectorAll("a");
    links.forEach((link, i) => {
      link.style.animation = mobileMenu.classList.contains("show")
        ? `slideUp 0.5s forwards ${i * 0.1}s`
        : "";
    });
  });

  closeBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("show");
    mobileMenu.querySelectorAll("a").forEach(link => link.style.animation = "");
  });

  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("show");
      mobileMenu.querySelectorAll("a").forEach(link => link.style.animation = "");
    });
  });
}

// ---------- RESPONSIVE HEADING ----------
function initDeepTechHeading() {
  const heading = document.getElementById("deepTechHeading");
  if (!heading) return;

  function update() {
    const isMobile = window.innerWidth <= 768;
    const textDesktop = "Building Deep Tech";
    const textMobile = "Building Deep<br>Tech";
    heading.innerHTML = isMobile ? textMobile : textDesktop;
  }

  update();
  window.addEventListener("resize", update);
}

// ---------- MOUSE FOLLOWER ----------
function initMouseFollower() {
  const minicircle = document.querySelector("#minicircle");
  if (!minicircle) return;

  let xscale = 1, yscale = 1, xprev = 0, yprev = 0, timeout;
  window.addEventListener("mousemove", e => {
    clearTimeout(timeout);
    xscale = gsap.utils.clamp(0.8, 1.2, e.clientX - xprev);
    yscale = gsap.utils.clamp(0.8, 1.2, e.clientY - yprev);
    xprev = e.clientX; yprev = e.clientY;
    minicircle.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(${xscale}, ${yscale})`;
    timeout = setTimeout(() =>
      minicircle.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(1,1)`, 100);
  });
}

// ---------- GSAP ENTRANCE ANIMATIONS ----------
function initGSAPAnimations() {
  gsap.to("#nav .bounding-elem", { y: 0, duration: 1, stagger: 0.2, ease: "power4.out" });
  gsap.to("#landingMain .bounding-elem", { y: 0, duration: 1, stagger: 0.2, delay: 0.5, ease: "power4.out" });
  gsap.to("#landingfooter .bounding-elem", { y: 0, duration: 1, stagger: 0.2, delay: 1.5, ease: "power4.out" });
}

// ---------- SMOOTH SCROLL ----------
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// ---------- INFINITE LOOP ----------
function initInfiniteLoop() {
  const track = document.querySelector(".scroll-track");
  const item = document.querySelector(".scroll-item");
  if (!track || !item) return;
  const width = item.offsetWidth;
  for (let i = 0; i < 4; i++) track.appendChild(item.cloneNode(true));
  gsap.to(track, {
    x: `-=${width}`,
    duration: 10,
    ease: "none",
    repeat: -1,
    modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % width) },
  });
}

// ---------- SWIPER ----------
function initSwiper() {
  if (typeof Swiper === "undefined") return;
  let swiper;
  if (window.innerWidth > 768) {
    swiper = new Swiper(".mySwiper", {
      slidesPerView: 5,
      spaceBetween: 10,
      loop: true,
      grabCursor: true,
    });
  }
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 768 && swiper) swiper.destroy(true, true);
  });
}

// ---------- SCROLL TRIGGER ----------
function initScrollAnimations() {
  if (!gsap || !gsap.registerPlugin) return;
  try {
    gsap.registerPlugin(ScrollTrigger);
    const desc = document.querySelector(".description-text");
    if (!desc) return;
    gsap.to(desc, {
      y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
      scrollTrigger: {
        trigger: "#description", start: "top 80%", end: "bottom 70%",
        toggleActions: "play none none reverse"
      }
    });
  } catch (e) { console.warn("ScrollTrigger registration failed:", e); }
}

// ---------- SBOX HOVER ----------
function initSboxHover() {
  document.querySelectorAll(".sbox").forEach(box => {
    const content = box.querySelector(".sbox-content");
    const hover = box.querySelector(".sbox-hover");
    if (!content || !hover) return;
    let isAnimating = false, tl = null;
    gsap.set(content, { y: 0, opacity: 1 });
    gsap.set(hover, { opacity: 0, y: 30 });

    box.addEventListener("mouseenter", () => {
      if (isAnimating) tl?.kill();
      tl = gsap.timeline({ onStart: () => isAnimating = true, onComplete: () => isAnimating = false })
        .to(content, { y: -50, opacity: 0, duration: 0.4, ease: "power3.inOut" })
        .to(hover, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" });
    });

    box.addEventListener("mouseleave", () => {
      if (isAnimating) tl?.kill();
      gsap.set(hover, { opacity: 0, y: 30 });
      tl = gsap.timeline({ onStart: () => isAnimating = true, onComplete: () => isAnimating = false })
        .fromTo(content, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
    });
  });
}

// ---------- MODALS ----------
function initModals() {
  const overlay = document.getElementById("modal-overlay");
  const partnerModal = document.getElementById("partner-modal");
  const supportModal = document.getElementById("support-modal");
  const openPartner = document.getElementById("open-partner");
  const openSupport = document.getElementById("open-support");

  if (openPartner && overlay && partnerModal)
    openPartner.addEventListener("click", e => { e.preventDefault(); overlay.classList.add("active"); partnerModal.classList.add("active"); });
  if (openSupport && overlay && supportModal)
    openSupport.addEventListener("click", e => { e.preventDefault(); overlay.classList.add("active"); supportModal.classList.add("active"); });

  document.querySelectorAll("[data-close]").forEach(btn =>
    btn.addEventListener("click", () => { overlay?.classList.remove("active"); partnerModal?.classList.remove("active"); supportModal?.classList.remove("active"); }));

  overlay?.addEventListener("click", () => {
    overlay.classList.remove("active");
    partnerModal?.classList.remove("active");
    supportModal?.classList.remove("active");
  });
}

// ---------- PROJECT OVERLAY ----------
function initProjects() {
  const projectOverlay = document.getElementById("project-overlay");
  const projectElems = document.querySelectorAll("#elem");
  const overlayContent = projectOverlay?.querySelector(".project-overlay-content");
  if (!projectOverlay || !overlayContent) return;

  const projects = [ /* your project data array unchanged */ ];

  function renderProjectOverlay(project) {
    overlayContent.innerHTML = `
      <button class="project-overlay-close">&times;</button>
      <div id="project-overlay-top">
        <h1>${project.title}</h1>
        <video autoplay muted loop src="./assets/vid1.mp4"></video>
      </div>
      <div id="project-overlay-middle">
        <div class="project-middle-left">
          <h1>Supported By : <span>${project.supportedBy}</span></h1>
          <h1>Domain : <span>${project.domain}</span></h1>
        </div>
        <div class="project-middle-right">
          <h1>Year : <span>${project.year}</span></h1>
          <h1>Duration : <span>${project.duration}</span></h1>
          <h1>Technologies : <span>${project.technologies.join(", ")}</span></h1>
        </div>
      </div>
      <div id="project-overlay-bottom">
        <div class="projectDesc"><h2>Description</h2><p>${project.description}</p></div>
        <div class="projectTeam"><h2>Team Members</h2><ul>${project.teamMembers.map(m => `<li>${m}</li>`).join("")}</ul></div>
      </div>`;
    overlayContent.querySelector(".project-overlay-close").addEventListener("click", () => projectOverlay.classList.add("hidden"));
  }

  projectElems.forEach((elem, i) => elem.addEventListener("click", () => {
    renderProjectOverlay(projects[i]);
    projectOverlay.classList.remove("hidden");
  }));

  projectOverlay.addEventListener("click", e => { if (e.target === projectOverlay) projectOverlay.classList.add("hidden"); });
}

// ---------- EMAIL FORM ----------
const emailForm = document.getElementById('email-form');

  if (emailForm) {
    const successMsg = document.createElement('p');
    successMsg.textContent = "✅ Thank you! Please check your email to complete your message.";
    Object.assign(successMsg.style, {
      color: "#FCA311",
      fontFamily: "Syne, sans-serif",
      fontSize: "1rem",
      marginTop: "10px",
      opacity: "0",
      transition: "opacity 0.4s ease"
    });
    emailForm.parentElement.appendChild(successMsg);

    emailForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(emailForm);
      const userEmail = document.getElementById('mail').value;

      try {
 // 1️⃣ Submit to Netlify (optional, if you want to store submissions)
        await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(formData).toString()
        });

        // 2️⃣ Reset form and show success message
        emailForm.reset();
        successMsg.style.opacity = "1";
        setTimeout(() => successMsg.style.opacity = "0", 4000);

        // 3️⃣ Open Gmail compose with pre-filled message
        setTimeout(() => {
  const subject = encodeURIComponent("Client Project Inquiry");
  const body = encodeURIComponent(
    `Hi Navgyan Innovations,\n\nI would like to share my idea or vision for a potential project. Please find my details below:\n\nEmail: ${userEmail}\n\n[You can add more details here...]`
  );
  window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&to=navgyanpvt@gmail.com&su=${subject}&body=${body}`,
    '_blank'
  );
}, 1000);


      } catch (error) {
        alert("❌ Something went wrong. Please try again.");
        console.error("Form submission error:", error);
      }
    });
  }



// ---------- TEAM SCROLL ----------
function initTeamScroll() {
  const track = document.querySelector('.team-track');
  if (!track) return;

  // Clone items for seamless loop
  const items = Array.from(track.children);
  items.forEach(item => track.appendChild(item.cloneNode(true)));

  // Start animation
  track.classList.add('animate');

  // Pause on hover/focus
  track.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
  });
  
  track.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
  });

  // Accessibility: pause on focus
  track.querySelectorAll('.member-card').forEach(card => {
      card.addEventListener('focus', () => {
          track.style.animationPlayState = 'paused';
      });
      card.addEventListener('blur', () => {
          track.style.animationPlayState = 'running';
      });
  });
}

// ---------- TEAM MEMBER CARDS ----------
function initTeamCards() {
    const cards = document.querySelectorAll('.member-card');
    cards.forEach(card => {
        const bubble = card.querySelector('.name-bubble');
        const name = card.dataset.name || '';
        bubble.textContent = name;

        function move(e) {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX ?? (rect.left + rect.width / 2)) - rect.left;
            const y = (e.clientY ?? (rect.top + rect.height / 2)) - rect.top;
            card.style.setProperty('--mx', x + 'px');
            card.style.setProperty('--my', y + 'px');
        }

        card.addEventListener('mousemove', e => {
            move(e);
            card.classList.add('is-hover');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('is-hover');
        });

        card.addEventListener('focus', () => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', (rect.width / 2) + 'px');
            card.style.setProperty('--my', (rect.height / 2) + 'px');
            card.classList.add('is-hover');
        });
        card.addEventListener('blur', () => card.classList.remove('is-hover'));
    });
}

// ---------- PROJECT MODAL ----------
// Project data object
const projects = {
    'Breath X': {
        title: "Breath X",
        supportedBy: "BIRAC, Dept. of Biotechnology, Navgyan Innovations",
        domain: "Healthcare IoT",
        year: 2024,
        technologies: ["Python", "Flask", "Sensors", "IoT"],
        description: "Advanced respiratory monitoring solution using AI-powered analytics for early detection of respiratory conditions and comprehensive health tracking.",
    },
    'Brain Viz': {
        title: "Brain Viz",
        supportedBy: "Navgyan Innovations, BIRAC",
        domain: "AI & Data Visualization",
        year: 2024,
        technologies: ["Python", "TensorFlow", "D3.js", "Computer Vision"],
        description: "Revolutionary brain imaging visualization platform for enhanced diagnostic capabilities and treatment planning using advanced AI algorithms.",
    },
    'NEUROLANG': {
        title: "NEUROLANG",
        supportedBy: "Navgyan Innovations",
        domain: "Natural Language Processing",
        year: 2024,
        technologies: ["Python", "Keras", "NLP Libraries", "Deep Learning"],
        description: "Natural language processing system designed for neurological assessment and communication assistance for patients with speech disorders.",
    },
    'AQUATRON': {
        title: "AQUATRON",
        supportedBy: "Navgyan Innovations",
        domain: "Environmental Monitoring",
        year: 2025,
        technologies: ["IoT", "Cloud", "JavaScript", "Data Analytics"],
        description: "Smart aquaculture monitoring system for sustainable fish farming and water quality management using IoT sensors and real-time analytics.",
    },
    'UNICOLLAB': {
        title: "UNICOLLAB",
        supportedBy: "Navgyan Innovations",
        domain: "Web Development",
        year: 2025,
        technologies: ["HTML", "CSS", "JavaScript", "Cloud Computing"],
        description: "Collaborative platform for university-industry partnerships and research project management with integrated communication tools.",
    },
    'MANIMA': {
        title: "MANIMA",
        supportedBy: "Navgyan Innovations",
        domain: "Mobile Application",
        year: 2025,
        technologies: ["React Native", "Firebase", "Node.js", "Machine Learning"],
        description: "A digital platform for performing Pinddaan rituals online, offering seamless booking of priests, customizable ritual packages, and guided spiritual services. Designed to simplify traditional ceremonies with modern convenience and cultural sensitivity.",
    }
};

function showProjectModal(title, category, year) {
    const projectOverlay = document.getElementById('project-overlay');
    const overlayContent = projectOverlay.querySelector('.project-overlay-content');
    
    const project = projects[title];
    if (!project) {
        console.warn('Project not found:', title);
        return;
    }

    overlayContent.innerHTML = `
        <button class="project-overlay-close" aria-label="Close overlay">&times;</button>
        <div id="project-overlay-top">
            <h1>${project.title}</h1>
            <video autoplay muted loop src="./assets/vid1.mp4"></video>
        </div>
        <div id="project-overlay-middle">
            <div class="project-middle-left">
                <h1>Supported By : <span>${project.supportedBy}</span></h1>
            </div>
            <div class="project-middle-right">
                <h1>Domain : <span>${project.domain}</span></h1>
                <h1>Year : <span>${project.year}</span></h1>
                <h1>Technologies : <span>${project.technologies.join(', ')}</span></h1>
            </div>
        </div>
        <div id="project-overlay-bottom">
            <div class="projectDesc">
                <h2>Description</h2>
                <p>${project.description}</p>
            </div>
        </div>
    `;

    projectOverlay.classList.remove('hidden');

    const closeBtn = overlayContent.querySelector('.project-overlay-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            projectOverlay.classList.add('hidden');
        });
    }

    projectOverlay.addEventListener('click', (e) => {
        if (e.target === projectOverlay) {
            projectOverlay.classList.add('hidden');
        }
    });
}

// ---------- TIME DISPLAY ----------
function initTimeDisplay() {
    const timeSpan = document.getElementById('time');
    if (!timeSpan) return;

    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const month = now.toLocaleString('en-US', { month: 'short' });
        
        timeSpan.textContent = ` ${hours}:${minutes} ${month}`;
    }

    // Update immediately and then every minute
    updateTime();
    setInterval(updateTime, 60000);
}

// Update your DOMContentLoaded event listener to include the new initializations
document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
    initHamburgerMenu();
    initDeepTechHeading();
    initMouseFollower();
    initGSAPAnimations();
    initSmoothScroll();
    initInfiniteLoop();
    initSwiper();
    initScrollAnimations();
    initSboxHover();
    initModals();
    initProjects();
    initTeamScroll();
    initTeamCards(); // Add this new initialization
    initTimeDisplay();
});
