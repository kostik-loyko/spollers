const spollersArray = document.querySelectorAll("[data-spollers]");
if (spollersArray.length > 0) {
   // получение обычных споллеров
   const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
      return !item.dataset.spollers.split(",")[0]
   });
   // инициализация обычных споллеров
   if (spollersRegular.length > 0) {
      initSpollers(spollersRegular);
   };
   // получение спойлеров с медиа запросами
   const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
      return item.dataset.spollers.split(",")[0]
   });
   // инициализация спойлеров с медиа запросами
   if (spollersMedia.length > 0) {
      const breakpointsArray = [];
      spollersMedia.forEach(item => {
         const params = item.dataset.spollers;
         const breakpoint = {};
         const paramsArray = params.split(",");
         breakpoint.value = paramsArray[0];
         breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
         breakpoint.item = item;
         breakpointsArray.push(breakpoint);
      })
      // получаем уникальные брейкпоинты
      let mediaQueries = breakpointsArray.map(function (item) {
         return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
      });
      mediaQueries = mediaQueries.filter(function (item, index, self) {
         return self.indexOf(item) === index
      });
      // работаем с каждым брйкпоинтом
      mediaQueries.forEach(breakpoint => {
         const paramsArray = breakpoint.split(",");
         const mediaBreakpoint = paramsArray[1];
         const mediaType = paramsArray[2];
         const matchMedia = window.matchMedia(paramsArray[0]);
         // объеткы с нужными условиями
         const spollersArray = breakpointsArray.filter(function (item) {
            if (item.value === mediaBreakpoint && item.type === mediaType) {
               return true
            }
         });
         // событие
         matchMedia.addListener(function () {
            initSpollers(spollersArray, matchMedia);
         });
         initSpollers(spollersArray, matchMedia);
      });
   }
   // Инициализация
   function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach(spollersBlock => {
         spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
         if (matchMedia.matches || !matchMedia) {
            spollersBlock.classList.add("init");
            initSpollerBody(spollersBlock);
            spollersBlock.addEventListener("click", setSpollerAction);
         } else {
            spollersBlock.classList.remove("init");
            initSpollerBody(spollersBlock, false);
            spollersBlock.removeEventListener("click", setSpollerAction);
         }
      });
   }
   // работа с контентом
   function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      const spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
      if (spollerTitles.length > 0) {
         spollerTitles.forEach(spollerTitle => {
            if (hideSpollerBody) {
               spollerTitle.removeAttribute("tabindex");
               if (!spollerTitle.classList.contains("active")) {
                  spollerTitle.nextElementSibling.hidden = true;
               }
            } else {
               spollerTitle.setAttribute("tabindex", "-1");
               spollerTitle.nextElementSibling.hidden = false;
            }
         });
      }
   }
   function setSpollerAction(e) {
      const el = e.target;
      if (el.hasAttribute("data-spoller") || el.closest("[data-spoller]")) {
         const spollerTitle = el.hasAttribute("data-spoller") ? el : el.closest("[data-spoller]");
         const spollersBlock = spollerTitle.closest("[data-spollers]");
         const oneSpoller = spollersBlock.hasAttribute("data-one-spoller") ? true : false;
         if (!spollersBlock.querySelectorAll("slide").length) {
            if (oneSpoller && !spollerTitle.classList.contains("active")) {
               hideSpollersBody(spollersBlock);
            }
            spollerTitle.classList.toggle("active");
            slideToggle(spollerTitle.nextElementSibling, 500);
         }
         e.preventDefault();
      }
   }
   function hideSpollersBody(spollersBlock) {
      const spollerActiveTitle = spollersBlock.querySelector("[data-spoller].active");
      if (spollerActiveTitle) {
         spollerActiveTitle.classList.remove("active");
         slideUp(spollerActiveTitle.nextElementSibling, 500);
      }
   }
}

// SlideToggle
let slideUp = (target, duration = 500) => {
   if (!target.classList.contains("slide")) {
      target.classList.add("slide");
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = target.offsetHeight + 'px';
      target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
         target.hidden = true;
         target.style.removeProperty('height');
         target.style.removeProperty('padding-top');
         target.style.removeProperty('padding-bottom');
         target.style.removeProperty('margin-top');
         target.style.removeProperty('margin-bottom');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove("slide");
      }, duration);
   }
}
let slideDown = (target, duration = 500) => {
   if (!target.classList.contains("slide")) {
      target.classList.add("slide");
      if (target.hidden) {
         target.hidden = false;
      }
      let height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + 'ms';
      target.style.height = height + 'px';
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      window.setTimeout(() => {
         target.style.removeProperty('height');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove("slide");
      }, duration);
   }
}
let slideToggle = (target, duration = 500) => {
   if (target.hidden) {
      return slideDown(target, duration);
   } else {
      return slideUp(target, duration);
   }
}





















// let slideUp = (target, duration = 500) => {
//    if (target.classList.contains("slide")) return;
//    target.classList.add("slide");

//    let style = target.style;

//    style.transitionProperty = "height, margin, padding";
//    style.transitionDuration = `${duration}ms`;
//    style.height = `${target.offsetHeight}px`;
//    target.offsetHeight;

//    style.overflow = "hidden";

//    style.height = 0;
//    style.paddingTop = 0;
//    style.paddingBottom = 0;
//    style.marginTop = 0;
//    style.marginBottom = 0;

//    setTimeout(() => {
//       target.hidden = true;
//       [
//          "height",
//          "padding-top",
//          "padding-bottom",
//          "margin-top",
//          "margin-bottom",
//          "overflow",
//          "transition-duration",
//          "transition-property",
//       ].forEach(e => style.removeProperty(e));
//       target.classList.remove("slide");
//    }, duration);
// };

// let slideDown = (target, duration = 500) => {
//    if (target.classList.contains("slide")) return;
//    target.classList.add("slide");

//    if (target.hidden) target.hidden = false;

//    let style = target.style;

//    let height = target.offsetHeight;

//    style.overflow = "hidden";

//    style.height = 0;
//    style.paddingTop = 0;
//    style.paddingBottom = 0;
//    style.marginTop = 0;
//    style.marginBottom = 0;

//    target.offsetHeight;

//    style.transitionProperty = "height, margin, padding";
//    style.transitionDuration = `${duration}ms`;
//    style.height = `${height}px`;

//    [
//       "padding-top",
//       "padding-bottom",
//       "margin-top",
//       "margin-bottom",
//    ].forEach(e => style.removeProperty(e));

//    setTimeout(() => {
//       [
//          "height",
//          "overflow",
//          "transition-duration",
//          "transition-property",
//       ].forEach(e => style.removeProperty(e));
//       target.classList.remove("slide");
//    }, duration);
// };

// let slideToggle = (target, duration = 500) => {
//    if (target.hidden) return slideDown(target, duration);
//    slideUp(target, duration);
// };