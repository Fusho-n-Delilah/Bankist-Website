'use strict';
///////////////////////////////////////////
// selections

// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

//button scrolling
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

//tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

//navigation
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

///////////////////////////////////////////
//modal
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////
// Button Scrolling
btnScrollTo.addEventListener('click', function(e){
  const s1coords = section1.getBoundingClientRect();
  section1.scrollIntoView({behavior: 'smooth'});
})

///////////////////////////////////////////
//   Page Navigation 

//event delegation approach
// 1. Add event listener to common parent element
document.querySelector('.nav__links').addEventListener('click', function(e){
  // 2. determine what element triggered the event
  //matching strategy
  if(e.target.classList.contains('nav__link')){
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});

//Navbar fade animation
const handleHover = function(e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el =>{
      if(el !== link){
        el.style.opacity = this;
      }
    })
    logo.style.opacity = this;
  }
}
// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky Navigation (inefficient way)
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function(){
//   if(this.scrollY > initialCoords.top) nav.classList.add('sticky');
// })

//sticky navigation: intersection Observer API
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function(entries){
  const [entry] = entries;

  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//////////////////////////////////////////
//reveal sections 
const allSections = document.querySelectorAll('.section');
const revealSection = function(entries, observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return; 
  
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}
const sectionObserver = new IntersectionObserver(revealSection, {root: null,threshold: 0.15});
allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})

///////////////////////////////////////////
//Tabbed Component
tabsContainer.addEventListener('click',function(e){
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if(!clicked) return;

  // Active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Activate content area
  tabsContent.forEach(tc => tc.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

////////////////////////////////////////////
//lazy loading images
const loading = function(entries, observer){
  const [entry] = entries;

  if(!entry.isIntersecting) return;

  // replace src attribute with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgTargets = document.querySelectorAll('img[data-src]');

const imgObserver = new IntersectionObserver(loading, {root: null, threshold: 0, rootMargin: '200px'});

imgTargets.forEach(img => imgObserver.observe(img));

////////////////////////////////////////////
// Slider Component
const slider = function(){
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  const maxSlide = slides.length-1;
  let curSlide = 0;

  const createDots = function(){
    slides.forEach( function(_, i){
      dotContainer.insertAdjacentHTML(`beforeend`, 
      `<button class="dots__dot" data-slide="${i}"></button>`
      );
    })
  };
  const activateDot = function(slide){
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  };
  const goToSlide = function(slide){
    slides.forEach((s,i) => s.style.transform = `translateX(${100*(i-slide)}%)`);
  };
  //go to next slide
  const nextSlide = function(){
    if(curSlide === maxSlide){
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  }
  const prevSlide = function(){
    if(curSlide === 0){
      curSlide = maxSlide;
    } else {
      curSlide--;
      goToSlide(curSlide);
      activateDot(curSlide);
    }
  }
  const init = function(){
    goToSlide(0); //go to initial slide 0
    createDots();
    activateDot(0);
  }

  init();

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function(e){
    if(e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function(e){
    if(e.target.classList.contains('dots__dot')){
      const {slide} = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
///////////////////////////////////////////
//////////     Experiments    /////////////
///////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function(e){
  console.log('HTML parsed and DOM Tree Built');
})

// //sticky navigation: intersection Observer API
// const obsCallback = function (entries, observer){
//   entries.forEach(entry => {
//     console.log(entry);
//   })
// };

// const obsOptions = {
//   root: null,
//   threshold: [0,0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);


// const h1 = document.querySelector('h1');

// //going downwords: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.children);
// console.log(h1.firstElementChild);
// // selecting parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// //selecting siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);


// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function(el){
//   if(el !== h1) el.style.transform = 'scale(0.5)';
// })

// const randomInt = (min, max) => Math.floor(Math.random() * (max-min + 1) + min);
// const randomColor = () => `rgba(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)},1)`;

// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector('.nav__links').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector('.nav').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
// });

//event delegation



//types of events

// const alertH1 = function(e){
//   alert('addEventListener: Great! You are reading the heading :D');

//   h1.removeEventListener('mouseenter', alertH1);
// }

// //newer way
// const h1 = document.querySelector('h1');
// h1.addEventListener('mouseenter', alertH1);

// // oldschool
// h1.onmouseenter = function(e){
//   alert('addEventListener: Great! You are reading the heading :D');
// };

//for notes
// console.log(s1coords);

//   console.log(e.target.getBoundingClientRect());

//   console.log('Current scroll (x/y)', window.scrollX, scrollY);

//   console.log('height width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);


// //Display Cookie Message
// const header = document.querySelector('.header');
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics.';
// message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got It!</button>';
// header.append(message);

// //cookie message styling
// const cookie_btn = message.querySelector('.btn--close-cookie');
// cookie_btn.style.transform += 'scale(.8,.8)';
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';
// message.style.height = Number.parseFloat(getComputedStyle(message).height , 10) + 20 + 'px';

// //close cookie message
// cookie_btn.addEventListener('click', function(){
//   message.remove();
// });
