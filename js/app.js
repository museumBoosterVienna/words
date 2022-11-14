
let format;
let content;
let emotions;
let industry;

async function test(){
   let responseFormat = await fetch('./words/format.json');
   if (responseFormat.ok) {
      let json = await responseFormat.json();
      let text = json[0];
      for (let i = 1; i != json.length; i++){ text = text + '&&' + json[i]; }
      format = text.split('&&');
   } 
   let responseContent = await fetch('./words/content.json');
   if (responseContent.ok) {
      let json = await responseContent.json();
      let text = json[0];
      for (let i = 1; i != json.length; i++){ text = text + '&&' + json[i]; }
      content = text.split('&&');
   } 
   let responseEmotions = await fetch('./words/emotions.json');
   if (responseEmotions.ok) {
      let json = await responseEmotions.json();
      let text = json[0];
      for (let i = 1; i != json.length; i++){ text = text + '&&' + json[i]; }
      emotions = text.split('&&');
   } 
   let responseIndustry = await fetch('./words/industry.json');
   if (responseIndustry.ok) {
      let json = await responseIndustry.json();
      let text = json[0];
      for (let i = 1; i != json.length; i++){ text = text + '&&' + json[i]; }
      industry = text.split('&&');
   } 
   let words = [emotions, industry, content, format];
   console.log(words);

// Объявляем константы
const slotItems = document.querySelectorAll('.slot__item');
const slotItemsWrapper = document.querySelectorAll('.slot__item-wrapper');
const buttonsTop = document.querySelectorAll('.slot__item-btn-top');
const buttonsBottom = document.querySelectorAll('.slot__item-btn-bottom');
const generateRandom = document.querySelector('.slot-btn-random');
const manualButton = document.querySelector('.slot-btn-manual');
const buttons = document.querySelectorAll('.slot__item-btn');
const body = document.querySelector('body');
const Lists = document.getElementsByClassName('slot__item-list');

let spinning = false;

let lineHeight = 25;
let textGap = 30;
let textHeight = textGap + lineHeight;

// if(window.screen.width < 991){
//    lineHeight = 25;
//    textGap = 20;
//    textHeight = textGap + lineHeight;
// }

// Наполняем слот словами
Array.prototype.forEach.call(Lists, list => {
   list.style.top = `-${textHeight+1}px`
   const childs = list.querySelectorAll('.slot__item-text');
   let finalText;
   for (let i = 0; i < 1; i++){
      let wordsList = words[parseInt(list.dataset.index)];
      wordsList.forEach(word => finalText = `${finalText} <li class="slot__item-text"><span>${word}</span></li>`)
   }
   list.insertAdjacentHTML('beforeEnd', finalText);
   randomizeChildren(list);
   list.querySelectorAll('.slot__item-text')[list.querySelectorAll('.slot__item-text').length-3].classList.add('active');
});

// Прячем кнопки 
hideButtons();

// Показываем их по нажатию на кнопку Manual Spin
manualButton.addEventListener('click', function(e){
   if (spinning) return;
   toggleButtons();
});

// Накидываем прослушиватель на кнопки движения слотом
buttonsTop.forEach(element => element.addEventListener('click', function(e){
   moveSlot(element);
}));
buttonsBottom.forEach(element => element.addEventListener('click', function(e){
   moveSlot(element, true);
}));

// Функция которая движет слот по нажатию на кнопку движения слотом
function moveSlot(element, isPositive){ 
   const parent = element.closest('.slot__item');
   const slotList = parent.querySelector('.slot__item-list');
   let transform = slotList.style.transform;
   let currentPosition = parseInt(transform.split(', ')[1].replace(/[^-\d]/g, ''));

   const slotTexts = slotList.getElementsByClassName('slot__item-text');
   let activeText = getActiveText(slotTexts);
   
   let activeTextIndex = Array.prototype.indexOf.call(slotTexts, activeText);

   if (isPositive){
      if (activeTextIndex == slotTexts.length-2){
         const randomChild = slotList.querySelectorAll('.slot__item-text')[getRandomInt(0, slotList.querySelectorAll('.slot__item-text').length)];
         slotList.insertAdjacentHTML('beforeEnd', `<li class="slot__item-text">${randomChild.innerHTML}</li>`);
         slotList.style.transform = `translate(0, ${currentPosition+=textHeight}px)`;
         slotList.style.top = `${parseInt(slotList.style.top.replace(/[^-\d]/g, ''))-textHeight}px`;

         slotTexts[activeTextIndex+1].classList.add('active');
      }else{
         slotTexts[activeTextIndex+1].classList.add('active');
         slotList.style.transform = `translate(0, ${currentPosition+=textHeight}px)`;
      }
   }else if (!isPositive){
      if(activeTextIndex == 1){

            const randomChild = slotList.querySelectorAll('.slot__item-text')[getRandomInt(0, slotList.querySelectorAll('.slot__item-text').length)];
            slotList.insertAdjacentHTML('beforeEnd', `<li class="slot__item-text">${randomChild.innerHTML}</li>`);
            slotList.style.transform = `translate(0, ${currentPosition-=textHeight}px)`;
            slotList.style.top = `${parseInt(slotList.style.top.replace(/[^-\d]/g, ''))+textHeight}px`;
            slotTexts[activeTextIndex+1].classList.add('active');

      }else{
         slotTexts[activeTextIndex-1].classList.add('active');
         slotList.style.transform = `translate(0, ${currentPosition-=textHeight}px)`;
      }
   }
   activeText.classList.remove('active');
}

// Функционал кнопки Auto Spin
generateRandom.addEventListener('click', function(e){   
   autoSpin();
});
autoSpin();
function autoSpin(){
   if (spinning) return;
   let maxAnimationTime = 0;
   for (let i = 0; Lists.length != i; i++){
      const slotList = Lists[i];
      const scrollTo = 50;
      let currentPosition = parseInt(slotList.style.transform.split(', ')[1].replace(/[^-\d]/g, ''));
      
      let wordsList = words[parseInt(slotList.dataset.index)];
      let finalText = `<li class="slot__item-text"><span>${wordsList[0]}</span></li>`;
      for (let i = 0; i != scrollTo; i++){
         const rand = getRandomInt(0, wordsList.length-1);
         if (wordsList[rand]){
            finalText = `${finalText} <li class="slot__item-text"><span>${wordsList[rand]}</span></li>`
         }
      }
      slotList.insertAdjacentHTML('afterBegin', finalText);

      const slotTexts = slotList.getElementsByClassName('slot__item-text');

      let activeText = getActiveText(slotTexts);
      const activeTextIndex = Array.prototype.indexOf.call(slotTexts, activeText);

      hideButtons();
      activeText.classList.remove('active');
      spinning = true;

      const animationTime = getRandomInt(6, 11);
      
      if (maxAnimationTime < animationTime) maxAnimationTime = animationTime;

      slotList.style.transition = `${animationTime}s ease`;

      slotList.style.transform = `translate(0, ${currentPosition-=textHeight*scrollTo}px)`;
      setTimeout(function() {
         slotList.querySelectorAll('.slot__item-text')[activeTextIndex-scrollTo].classList.add('active');
         slotList.style.transition = `0.3s cubic-bezier(0.25, 1, 0.5, 1)`;
     }, animationTime*1000);
   }
   setTimeout(function() {
      spinning = false;
   }, maxAnimationTime*1000);
}

// Функция генерирует рандомное число
function getRandomInt(min = 0, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min + 1)) + min;
} 
// Функция мигания кнопок
function toggleButtons(){
   buttons.forEach(element => element.classList.toggle('hidden'));
}

function getActiveText(slotTexts){
   let activeText;
   for (let index = 0; index < slotTexts.length; index++) { if (slotTexts[index].classList.contains('active')) { activeText = slotTexts[index]; } }
   return activeText;
}

// Функция отключения кнопок
function hideButtons(){
   if (!buttons[0].classList.contains('hidden')){
      buttons.forEach(element => element.classList.toggle('hidden'));
   }
}

// Функция рандомизирует дочерние элементы
function randomizeChildren (nodeX) {
   const newNode = nodeX.cloneNode(true);
   const xChildren = newNode.children;
   const newNodeFrag = document.createDocumentFragment();

   while (xChildren.length > 0) {
       newNodeFrag.appendChild( xChildren [Math.floor(Math.random() * xChildren.length)] );
   };

   nodeX.innerHTML = "";
   nodeX.appendChild(newNodeFrag);
};

// Функция которая возвращает позицию курсора
function getPosition(e){
 
	if (!e) {
		var e = window.event;
	}

   let x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
   let y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
 
	return {x: x, y: y}
}

}
test();