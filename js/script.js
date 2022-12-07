window.addEventListener('DOMContentLoaded', ()=>{
	///////////////////////////////////////////////////// slider
	const slides = document.querySelectorAll('.slider__item'),
	arrowPrev = document.querySelector('.slider__arrow-prev'),
	arrowNext = document.querySelector('.slider__arrow-next'),
	sliderWindow = document.querySelector('.slider__window'),
	sliderWrapper = document.querySelector('.slider__wrapper'),
	dots = document.querySelectorAll('.slider__indicator li');

	let count = 0,
	widthSlideWindow  = sliderWindow.offsetWidth;
	slides.forEach(item => item.style.width = widthSlideWindow + 'px');

	window.addEventListener('resize', ()=>{
		widthSlideWindow = sliderWindow.offsetWidth;
		slides.forEach(item => item.style.width = widthSlideWindow + 'px');
		sliderWrapper.style.transform = `translateX(-${widthSlideWindow * count}px)`;
	})

	function setSliderPosition() {
		sliderWrapper.style.transform = `translateX(-${widthSlideWindow * count}px)`;
		dots.forEach(item => item.style.opacity = 0.5);
		dots[count].style.opacity = 1;
	}

	
	arrowPrev.addEventListener('click', ()=>{
		count--;
		if (count < 0) {
			count = slides.length - 1;
		}
		setSliderPosition();
	})

	arrowNext.addEventListener('click', ()=>{
		count++;
		if (count >= slides.length) {
			count = 0;
		} 
		setSliderPosition();
	})

	dots.forEach(dot =>{
		dot.addEventListener('click', (e)=>{
			count = e.target.getAttribute('data-slide');
			setSliderPosition();
		})
	})

	let x1 = null,
		xMove = false;

	slides.forEach(slide => {
		slide.addEventListener('touchstart', (e)=>{
			e.preventDefault();
			x1 = e.touches[0].clientX;
			xMove = true;
		})

		slide.addEventListener('touchmove', (e)=>{
			e.preventDefault();
			let x2 = e.touches[0].clientX;
			let xDiff = x2 - x1;

			if (xDiff > 0) {
				if (count <= 0) {
					count = 0;
				} else {
					count--;
				}
			} else {
				if (count >= slides.length-1) {
					count = slides.length -1;
				} else {
					count++;
				}
			}
			if (xMove) {
				setSliderPosition();
				xMove = false;
			}
			
		}) 
	
	})

	//////////////////////////////////////////////////////////// tabs
	const tabs = document.querySelectorAll('.catalog__tab'),
	tabContent = document.querySelectorAll('.catalog__content'),
	linkItem = document.querySelectorAll('.catalog-item__link'),
	linkBack = document.querySelectorAll('.catalog-item__back'),
	itemContent = document.querySelectorAll('.catalog-item__content'),
	itemList = document.querySelectorAll('.catalog-item__list');

	tabs.forEach((item, index)=>{
		item.addEventListener('click', ()=>{
			tabContent.forEach(item=>{
				item.classList.remove('catalog__content_active');
			});
			tabContent[index].classList.add('catalog__content_active');


			tabs.forEach((item)=>{
				item.classList.remove('catalog__tab_active');
			})
			item.classList.add('catalog__tab_active');
		})
	})

	linkItem.forEach((item, index)=>{
		item.addEventListener('click', (e)=>{
			e.preventDefault();
			itemContent[index].classList.remove('catalog-item__content_active');
			itemList[index].classList.add('catalog-item__list_active');
		})
	})

	linkBack.forEach((item, index)=>{
		item.addEventListener('click', (e)=>{
			e.preventDefault();
			itemList[index].classList.remove('catalog-item__list_active');
			itemContent[index].classList.add('catalog-item__content_active');
		})
	})

	//////////////////////////////////////animation
	new WOW().init();

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////modal window
	const buttonConsultation = document.querySelectorAll('[data-modal="consultation"]'),
	buttonBuy = document.querySelectorAll('.button_mini'),
	formConsultation = document.querySelector('#consultation'),
	formOrder = document.querySelector('#order'),
	overlay = document.querySelector('.overlay'),
	formOrderSubtitle = document.querySelector('#order .modal__descr'),
	thanks = document.querySelector('#thanks'),
	error = document.querySelector('#error'),
	catalogItemSubtitle = document.querySelectorAll('.catalog-item__subtitle');
	let informartionModalTimer;


	function showModalConsultation () {
		formConsultation.classList.add('modal_active');
		overlay.classList.add('overlay_active');
		document.body.style.overflow = 'hidden';
		removeEventListener('scroll', showModalConsultationEnd);
		// clearTimeout(consultatuonModalTimer);
	}

	function closeModals () {
		formConsultation.classList.remove('modal_active');
		formOrder.classList.remove('modal_active');
		thanks.classList.remove('modal_active');
		error.classList.remove('modal_active');
		overlay.classList.remove('overlay_active');
		document.body.style.overflow = '';
		clearTimeout(informartionModalTimer);
	}

	buttonConsultation.forEach((item)=>{
		item.addEventListener('click', ()=>{
			showModalConsultation();
		})
	})

	buttonBuy.forEach((item, i)=>{
		item.addEventListener('click', ()=>{
			formOrderSubtitle.innerHTML = catalogItemSubtitle[i].innerHTML;
			overlay.classList.add('overlay_active');
			formOrder.classList.add('modal_active');
			document.body.style.overflow = 'hidden';
		})
	})

	overlay.addEventListener('click', (e)=>{
		if (e.target === overlay || e.target.classList.contains('modal__close')) {
			closeModals();
		}
	})

	document.addEventListener('keydown', (e)=>{
		if (e.code === 'Escape') {
			closeModals ();
		}
	})

	// const consultatuonModalTimer = setTimeout(showModalConsultation, 3000);

	function showModalConsultationEnd () {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
				showModalConsultation();
				removeEventListener('scroll', showModalConsultationEnd)
			}
	}

	window.addEventListener('scroll', showModalConsultationEnd);

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////forms
	const forms = document.querySelectorAll('form');

	forms.forEach(form=>postData(form));

	async function queryConstructor(url, body) {
		const res = await fetch(url, {
			method: 'POST',
			body: body
		})
		if (!res.ok) {
			throw new Error(`Could not fetch${url}. Status: ${res.status}.`)
		}
		return res;
	}

	function postData (form){
		form.addEventListener('submit', (e)=>{
			e.preventDefault();

			const formData = new FormData(form);

			queryConstructor('server.php', formData)
			.then(response => response.text())
			.then(response => {
				console.log(response);
				workModal(thanks, form);
			})
			.catch(()=>{
				console.log('error')
				workModal(error, form);
			})
		})
	}



	function workModal(modal, form) {
		formConsultation.classList.remove('modal_active');
		formOrder.classList.remove('modal_active');
		if (!overlay.classList.contains('overlay_active')) {
			overlay.classList.add('overlay_active');
		}
		modal.classList.add('modal_active');
		form.reset();
		informartionModalTimer = setTimeout(closeModals, 3000);
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// pageUp
	const linkUp = document.querySelector('.pageup');
	window.addEventListener('scroll', ()=>{
		if (document.documentElement.scrollTop >= 1600) {
			linkUp.style.display = 'block';
		} else {
			linkUp.style.display = 'none';
		}
	})

	linkUp.addEventListener('click', function(e) {
		e.preventDefault();

		document.querySelector('#up').scrollIntoView({
				behavior: 'smooth',
				block: 'start'
		})
	});
	////////////////////////////////////////////////maskPhone
	var selector = document.querySelectorAll(".tel");

	var im = new Inputmask("+7(999) 999-99-99");
	im.mask(selector);
	
	////////////// timer

	let day = 1,
		month = 1,
		year = 22,
		countDay = [31,28,31,30,31,30,31,31,30,31,30,31],
		currentDay = new Date(),
		timeEnd = `20${year}-${addZero(month)}-${addZero(day)}`;

	while (Date.parse(currentDay)>=Date.parse(timeEnd)){
		day++;
		for (let i = 0; i<countDay.length; i++){
			if (i == currentDay.getMonth()){
				month = i;
			}
		}
		if (day > countDay[month]) {
			month++;
			day = 1;
		}
		if (month >= countDay.length) {
			year++;
			month = 0;
			day = 1;
		}
		
		timeEnd = `20${year}-${addZero(month + 1)}-${addZero(day)}`;
	}

	function transformTime(timeEnd) {
	let t = Date.parse(timeEnd) - Date.parse(new Date()),
		days = Math.floor(t / (1000 * 60 * 60 * 24)),
		hours = Math.floor((t / (1000 * 60 * 60) % 24)),
		minutes = Math.floor((t / (1000 * 60) % 60)),
		seconds = Math.floor((t / 1000) % 60);

		return {
			'total': t,
			'days': days,
			'hours': hours,
			'minutes': minutes,
			'seconds': seconds
		};
	}

	function addZero(num) {
		if (num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}

	function getTime(timeEnd) {
		const days = document.querySelector('#days'),
			hours = document.querySelector('#hours'),
			minutes = document.querySelector('#minutes'),
			seconds = document.querySelector('#seconds'),
			timer = setInterval(setTime, 1000);

		setTime();

		function setTime() {
			const t = transformTime(timeEnd);
			if (t.total > 0) {
				days.innerHTML = addZero(t.days);
				hours.innerHTML = addZero(t.hours);
				minutes.innerHTML = addZero(t.minutes);
				seconds.innerHTML = addZero(t.seconds);
			}
			
		}
	}

	getTime(timeEnd);
})

