//	Testing in Chrome 84 and Firefox 79 -	32 bit
//	12-08-20
//	CHANGES:
//	1.	Разнесены классы по файлам библиотек
//	2.	Изменено поведение колец после совпадения вращений (нахождения spinPair).
//	Теперь закрашенные (filled) круги появляются не сразу после первого же совпадения, а только при наличии совпадения и отпуска клавиши мыши.
//	13-08
//	1.	Реализована передача радиуса самого большого круга в общий класс эффектов.
//		Это позволило масштабировать звездную орбиту по размерам кругов.

function c(dataIn){console.log(dataIn);};
//------------------
let mouse,			//	обьект с данными нажатий.
	previousMouse;	//	предыдущая каория обьекта с данными нажатий мыши ( для вычислений приращения для задания вращения изображений)
//------------------
//общий класс кругов
class Circles{
	constructor(	massRbIn	){
		this.rb				=	massRbIn;	//	rigitBody[]
		this.activeCircleCh	=	-1;			//	индекс this.rb[] активного круга
		this.current		=	0;			//	активный круг из this.rb
		//результаты совпадения угла поворота пары кругов
		this.spinResults	=	{
			pair						:	0,		//	пара вращения из this.rb (при наличии)
			insideCircleNumber			:	-1,		//	НОМЕР внутреннего круга пары вращений
			outsideCircleNumber			:	-1,		//	~ внешнего
			stringNumberOfArrayOfAngles	:	-1,		//	НОМЕР строки в массиве[][] углов вращений
			code						:	0		//	NNN код для нахождения закрашенного (filled) круга по массиву fillPixIndexes
													//		Где [НОМЕР активного круга]	[НОМЕР активного круга + 1 ]	[НОМЕР (цвета) строки массива spinData].
			
		};
		//
		this.flags	=	{
			replaceSpinPairToNewCircles		:	false,	//
			replaceSpinPairToNewCirclesDone	:	false,
			hiddenSpinPair					:	false
		};
		
	};
	//прорисовка на холст
	publish(){
		this.rb.forEach((value)=>{
			draw.context.save();
			value.rotating();
			value.drawing();
			draw.context.restore();
		}
		);
	};
	//ловит Фокус мыши на нужном круге. Круги добжны быть сортированы по возростанию радиусов
	getEntrysPointCircle(	xyIn	){
		let ch	=	0;
		
		while(	ch	<	this.rb.length	){
			if(	!this.rb[	ch	].checkEntryPoint()	){
				this.activeCircleCh	=	ch;
				this.current		=	this.rb[	ch	];
				return this.current;
				break;
			};
			ch++;
		};
		
		this.current		=	0;
		this.activeCircleCh	=	-1;
		return false;
	};
	//сделать непрозрачность всех кругов кроме текущего по умолчанию
	setDisfocusOpacityAllBesidesCurrent(){
		this.rb.forEach(
			(value,	ch)=>{
				if(	ch	!=	this.activeCircleCh	){
					//c('setDisfoc '+value.getOpacityMode()+' '+value.img.src+' '+ch	);
					value.changeOpacityMode(	'disfocus'	);
				}
			}
			/*
			(value)=>{
				if(	value	!=	this.current	){
					c('setDisfoc '+value.getOpacityMode()+value.img.src	);
					//value.setOpacityByConst(	'disfocus'	);
					value.changeOpacityMode(	'disfocus'	);
				};
			}
			*/
		);
	};
	//проверяет разность углов поворота выделенного (активного) круга и внешнего на совпадение с массивом углов
	checkOnSpinDifferenceCurrentCircleFromOutsideCircle(){
		if(	this.current	){	//	is not emty?
			let result	=	0;
			if(	this.activeCircleCh	<	(this.rb.length-1)	){	//	is not a last?
				//проверка пересечения текущего круга с внешним (следущим)
				result	=	this.current.checkSpinDifferenceWith(	this.rb[this.activeCircleCh+1].getRadian()	);
				//занесение результата (пару совпадающих кругов)
				if(	result	){
					//заносим совпадающую пару
					this.spinResults.pair							=	[	this.current,	this.rb[this.activeCircleCh+1]	];
					//заносим номер активного (т.е. внутреннего) круга
					this.spinResults.insideCircleNumber				=	this.activeCircleCh;
					//и номер следующего круга
					this.spinResults.outsideCircleNumber			=	this.activeCircleCh	+	1;
					//заносим номер строки массива найденного угла
					this.spinResults.stringNumberOfArrayOfAngles	=	this.current.getSpinCh();
					//заносим код для последущего нахождения по нему закрашенного (filled) круга
					this.spinResults.code							=	(this.activeCircleCh+1)*100	+	(this.activeCircleCh+2)*10	+	this.current.getSpinCh()+1;
					//c('spinCode: '+this.spinResults.code);
				}else{
					//нету пары
					this.spinResults.pair	=	0;
				};
			};
			return result;
		};
	};
	//~ аналогично предыдущей функции, проверяет по разнице с внутренним (ближе к центру) кругом
	checkOnSpinDifferenceCurrentCircleFromInsideCircle(){
		
	};
	//возвращает пару кругов, найденные функциями выше
	getSpinPair(){
		return this.spinResults.pair;
	};
	//возвращает результаты пересечения пар кругов по функции выше
	getSpinResults(){
		return this.spinResults;
	};
	//вернуть все круги
	getAllCircles(){
		return this.rb;
	};
	//вернуть следущий от активного круг
	getNextCircleFromActive(){
		if(	(this.spinResults.outsideCircleNumber	<	this.rb.length-1)	&&	(this.spinResults.outsideCircleNumber	>=	0)	){
			return this.rb[this.spinResults.outsideCircleNumber	+	1];
		}else	
			return false;
	};
	//вернуть предыдущий от активного круг
	getPreviousCircleFromActive(){
		
	};
	//назначить каждому кругу свою непрозрачность
	setCustomOpacityForAllCircles(	massiIn	){
		this.rb.forEach(	(value,	ch)	=>	{
				value.setCustomOpacity(	massiIn[	ch	]	);
			}
		);
	};
	//скрываем все круги (если есть) что внутри совпадающей пары
	hideCirclesInsideSpinPair(){
		//проверим на существование совпадающей пары
		if(	this.spinResults.pair	){
			//если внутри них есть хотя быодин круг
			if(	this.spinResults.insideCircleNumber	>	0	){
				//скроем их
				this.rb.forEach(	(value,	ch)	=>	{
						if(	ch	<	this.spinResults.insideCircleNumber	){
							value.changeOpacityMode(	'hidden'	);
							//c('hide ch: '+ch);
							//и запретим их изменение непрозрачности
							value.lockChangeOpacity();
						};
					}
				);
			};
		};
	};
	//вращать все круги, кроме активного, в фоновом режиме.
	rotateAllCirclesBesidesCurrent(	massfRadianIn	){	//	вызывать для анимации
		this.rb.forEach(	(value,	ch)	=>	{
				if(	ch	!=	this.activeCircleCh	){
					value.rotate(	massfRadianIn[ch]	);
				}
			}
		);
	};
	//понижаем непрозрачность всех кругов за парой вращения
	toLowerOpacityInOutsideOfSpinPairCircles(){
		//если пара вращения есть
		if(	this.spinResults.pair	){
			//перебираем все круги (так проще)
			this.rb.forEach(	(value,	ch)	=>	{
					//если счетчик больше внешнего круга пары вращений,то
					if(	ch	>	this.spinResults.outsideCircleNumber	){
						//присваиваем свою непрозрачность.
						//	получается, что чем дальше от центра, тем больше она меняется
						value.setCustomOpacity(	ch	*	10	);
					};
				}
			);
		};
	};
	//вернуть максимальный радиус из всех изображений
	getMaxRadiusOfAllImages(){
		return this.rb[	this.rb.length-1	].getRadius();
	};
	//удалить данные о паре вращения
	eraseSplitPairData(){
		this.spinResults.pair							=	0;
		this.spinResults.insideCircleNumber				=	-1;
		this.spinResults.outsideCircleNumber			=	-1;
		this.spinResults.stringNumberOfArrayOfAngles	=	-1;
		this.spinResults.code							=	0;
	};
	//заменить 
	replaceSpinPairToNewCirclesAndSetVisible(){//	
		//
		if(	this.spinResults.pair	&&	!this.flags.replaceSpinPairToNewCircles	){
			//проверяем непрозрачность внутреннего круга пары вращения. Она меняется постепенно, ...
			if(	this.spinResults.pair[0].isHidden()	){
				let spinPair	=	this.spinResults.pair;
				//
				this.flags.replaceSpinPairToNewCircles		=	true;
				//let spinCodeArr		=	String(circles.getSpinResults().code).split('');
				let [	insideCircleNumber,	outsideCircleNumber,	...other	]	=	String(	this.spinResults.code	);
				//возьмем случайное значение 1..[максимального числа разнообразия геометрий]
				let geometryCode			=	MAX_PIX_GEOMETRIES;
				//возьмем случайное значение 1..[максимального числа разнообразия цветов]
				let colorSetCode			=	Math.round(	iGetRandWithin(1,	MAX_PIX_COLORSETS)	);
				c('colorSetCode: '+colorSetCode);
				//новое имя файла внутреннего круга
				let newInsideCirclePixName	=	String(geometryCode)	+	String(colorSetCode)	+	insideCircleNumber	+	'.png';
				//let newInsideCirclePixName	=	'121.png';
				//повторно (опционально)
				colorSetCode			=	Math.round(	iGetRandWithin(1,	MAX_PIX_COLORSETS)	);
				//	~	внешнего
				let newOutsideCirclePixName	=	String(geometryCode)	+	String(colorSetCode)	+	outsideCircleNumber	+	'.png';
				//let newOutsideCirclePixName	=	'122.png';
				//передаем данные для замены на новые в <data.js>
				replaceFillPixNamesBySpinCode(	this.spinResults.code,	newInsideCirclePixName,	newOutsideCirclePixName	);
				//сбрасываем данные о паре вращения
				this.eraseSplitPairData();
				//
				let successReplaceSecond	=	()	=>	{
					
					c('src '+spinPair[0].img.src);
					
					spinPair[1].unlockChangeOpacity();
					//
					//spinPair[1].changeOpacityMode	=	'disfocus';
					//
					spinPair[1].allowRotate();
					//
					this.flags.replaceSpinPairToNewCirclesDone	=	true;
					//c('done '+newOutsideCirclePixName);
					//c(this.current);
				};
				//
				let errorReplace		=	()	=>	{
					c('ресурс не загружен');
				};
				//
				let successReplaceFirst		=	()	=>	{
					c('done '+newInsideCirclePixName);
					//
					spinPair[0].unlockChangeOpacity();
					//
					//spinPair[0].changeOpacityMode	=	'disfocus';
					//
					spinPair[0].allowRotate();
					//
					spinPair[1].loadAndReplaceImg(	newOutsideCirclePixName,	successReplaceSecond,	errorReplace	);
				};
				//
				spinPair[0].loadAndReplaceImg(	newInsideCirclePixName,	successReplaceFirst,	errorReplace	);
				//
				
			};
		};
	};
	//Произошла ли замена изображений (обновление кругов) ?
	isNewCirclesBecomesVisible(){
		return this.flags.replaceSpinPairToNewCirclesDone;
	};
	//скрывает пару вращения и запрещает их вращения
	hiddenSpinPair(){
		//
		if(	!this.flags.hiddenSpinPair	&&	this.spinResults.pair	){
			//меняем режим непрозрачности на скрытый (hidden) - 0
			this.spinResults.pair[0].changeOpacityMode(	'hidden'	);
			this.spinResults.pair[1].changeOpacityMode(	'hidden'	);
			//блокируем их от последущих изменений непрозрачности
			this.spinResults.pair[0].lockChangeOpacity();
			this.spinResults.pair[1].lockChangeOpacity();
			//понижаем непрозрачность остальных кругов
			//	стоит обратить внимание, что эта функция будет конфликтовать с событиями, меняющими непрозрачность в будущем.
			//	Но по скольку на данный момент изменения непрозрачности по указателю мыши блокируеются после нахождения пары аращения, то сейчас так.
			//circles.toLowerOpacityInOutsideOfSpinPairCircles();
			//и скрываем внутренние круги (при наличии)
			this.hideCirclesInsideSpinPair();
			//запрещаем вращение совпадающей пары
			//c(spinPair[0]);
			this.spinResults.pair[0].forbidRotate();
			this.spinResults.pair[1].forbidRotate();
			//отмечаем флаг, что мы нашли пару вращений и больше не будем вызывать этот участок кода
			//scenario.flags.spinPairIsFound	=	true;
			this.flags.hiddenSpinPair	=	true;
		};
	};
};
let circles;

//------------------
//общий класс закрашенных (filled) кругов
class CirclesFilled{
	constructor(	massRbIn	){
		this.rb			=	massRbIn;
		this.current	=	0;	//	current rb
		//рисовать зеркально вращающиеся копии кругов?
		this._enableOppositeSpinImageFlag	=	false;
		//рисовать мини-копии?
		this._enableDrawMiniCopiesFlag		=	false;
		this.sizeMiniCopiesPercent			=	35;
	};
	//прорисовка на холст. Вызывается для анимации
	publish(){
		this.rb.forEach(	(value)=>{
			draw.context.save();
			value.rotating();
			value.drawing();
			draw.context.restore();
		}
		);
		//рисовать зеркально вращающиеся копии кругов
		if(	this._enableOppositeSpinImageFlag	){
			//проверяем на существование круга-образца
			if(	this.current	){
				draw.context.save();
			
				draw.context.translate(	draw.center.x,	draw.center.y	);
				draw.context.rotate(	-1	*	this.current.getRadian()	);
			
				this.current.drawing();
				draw.context.restore();
			};
		};
		//рисовать мини копии
		if(	this._enableDrawMiniCopiesFlag	){
			//проверяем на существование круга-образца
			if(	this.current	){
				//уменьшаем копию
				this.current.resizeImageByPercent(	this.sizeMiniCopiesPercent	);
				//
				draw.context.save();
				draw.context.translate(	draw.center.x,	draw.center.y		);
				draw.context.rotate(	-1	*	this.current.getRadian()	);
				this.current.drawing();
				draw.context.restore();
				//
				draw.context.save();
				draw.context.translate(	draw.center.x,	draw.center.y	);
				draw.context.rotate(	this.current.getRadian()		);
				this.current.drawing();
				draw.context.restore();
				//восстанавливаем исходный размер изображения
				this.current.restoreSizeImage();
			};
		};
	};
	//
	hideAll(){
		this.rb.forEach(
			(value)	=>	{
				value.disableDraw();
			}
		);
	};
	//
	setCurrentByIndex(	iIn	){
		this.current	=	this.rb[	iIn	];
	};
	//
	unhideCurrent(){
		if(	this.current	){
			this.current.enableDraw();
		};
	};
	//
	getCurrent(){
		return this.current;
	};
	//
	enableOppositeSpinImage(){
		this._enableOppositeSpinImageFlag	=	true;
	};
	//
	disableOppositeSpinImage(){
		this._enableOppositeSpinImageFlag	=	false;
	};
	//
	enableMiniCopies(){
		this._enableDrawMiniCopiesFlag		=	true;
	};
	//
};
let circlesFilled;

//------------------
//класс сценарной обработка событий игры
class Scenario{
	constructor(){
		//флаги сценариев
		this.flags	=	{
			spinPairIsFoundAndHidden				:	false,	//	нахождение пары вращения и последущее сокрытие
			changeSpinPairCirclesToCirclesFilled	:	false	//	замена пары вращения на закрашенный (fileed) круг
		};
		//
	};
	//
	
};
let scenario	=	new Scenario();

//------------------
//функция вызывается при каждом событии мыши
let update		=	function(){};

//ф-ция замены совпадающей пары на новые круги
function replaceSpinPairToNewCircles(){
	//заменим пару вращения новыми кругами
	circles.replaceSpinPairToNewCirclesAndSetVisible();
	//если новые круги уже заменены
	if(	circles.isNewCirclesBecomesVisible	){
		//скрыть закрашенные (filled) круги
		circlesFilled.getCurrent().changeOpacityMode(	'hidden'	);
		//перезапуск эффектов расширяющихся кругов
		effects.restartExpandingCircle();
		//
	};
	//
};

//ф-ция замены пары вращений на закрашенный (filled) круг.
//	Включаются эффекты.
function changeSpinPairCirclesToCirclesFilled(	onfocusCircleIn	){
	//---SCENARIO---
	//берем код этой пары
	let spinCode	=	circles.getSpinResults().code;
	//находим его индекс в массиве
	let index		=	fillPixIndexes.indexOf(	spinCode	);
	//делаем его текущим
	circlesFilled.setCurrentByIndex(	index	);
	//показываем закрашенный (filled) круг
	circlesFilled.unhideCurrent();
	//получаем закрашенный (filled) круг
	let filled	=	circlesFilled.getCurrent();
		if(	filled	){
		//задаем полную непрозрачность для них
		circlesFilled.getCurrent().changeOpacityMode(	'fullVisible'	);
		//а лучше плавающую непрозрачность для них
		circlesFilled.getCurrent().setUnevenOpacityMode(	50	);
		//уменьшаем шаг непрозрачности для анимации
		circlesFilled.getCurrent().setStepLess();
		circlesFilled.getCurrent().setStepLess();
		//синхронизируем углы вращения (можно по внутреннему кругу)
		circlesFilled.getCurrent().setRadian(	onfocusCircleIn.getRadian()	);
		//включаем отображение и вращение дубликата в противоположную сторону
		circlesFilled.enableOppositeSpinImage();
		//включаем мини копии закрашенного (filled) круга
		circlesFilled.enableMiniCopies();
	};
	//задаем цвет и радиус эффекта анимации радиального градиента
	effects.setParametersForRadialGradient(	colorsOfRadialGradientsEffectsForFillPix[	index	],	circlesFilled.getCurrent().radius	);
	//перезапускаем этот эффект
	effects.restartAllRadialGradients();
	//рисуем эффект расширяющегося круга
	//	из центра экрана по радиусу и цвету закрашенного (filled) круга
	effects.setParametrsForExpandingCircle(	colorsOfRadialGradientsEffectsForFillPix[	index	],	circlesFilled.getCurrent().radius	);
	
	//зададим цвет расширяющегося круга под указателем
	effects.setColor(	colorsOfRadialGradientsEffectsForFillPix[	index	]	);
	//сменим цвет ланейного градиента фона
	effects.setParametersForLinearGradient(	dataLinearGradientsEffects[index],	dataLinearGradientsEffects[index],	dataLinearGradientsEffects[index]	);
	//
	
};
//
function updateFunc(){
	//сбрасываем непрозрачность всех кругов, кроме активного и заблокированных (locked)
	circles.setDisfocusOpacityAllBesidesCurrent();
	//получаем активный круг
	let onfocusCircle	=	circles.getEntrysPointCircle(	mouse	);
	//c(onfocusCircle);
	//берем пару совпадающих по вращению кругов
	let spinPair		=	circles.getSpinPair();
	//события при движении мыши
	if(	mouse.inEvent	==	'mousemove'	){
		//если есть активный круг и нету пары вращений
		if(	onfocusCircle	){
			if(	onfocusCircle.getOpacityMode()	==	'disfocus'	){	//	если режим непрозрачности соотв. [невыделено]
				//сменить непрозрачность на [в фокусе]
				onfocusCircle.changeOpacityMode(	'onfocus'	);
			}
			if(	onfocusCircle.getOpacityMode()	==	'onclick'	){	//	если режим непрозрачности соотв. нажатию
				//поворот активного круга
				onfocusCircle.rotate(	calculateAngleViaThreePoints2(previousMouse,	draw.center,	mouse)	);
				//проверка активного круга и внешнего на совпадения вращений. (подр. в функции)
				let checkSpinResult	=	circles.checkOnSpinDifferenceCurrentCircleFromOutsideCircle();
				//если совпадения вращений есть
				if(	checkSpinResult	){
					//c('spin: '+checkSpinResult);
					//ставим флаг: разрешение сменить пару вращения на закрашенные (filled) круги
					scenario.flags.changeSpinPairCirclesToCirclesFilled	=	true;
				}else{
					//	~	если пары вращения нет, значит не меняем
					scenario.flags.changeSpinPairCirclesToCirclesFilled	=	false;
				};
				
			};
			
		};
	};
	//события при нажатии мыши (срабатывает однократно, пока не отпустить (mouseup)
	if(	mouse.inEvent	==	'mousedown'	){
		if(	onfocusCircle	){	//	при наличии активного круга
			if(	!spinPair	){	//	при отсутствии совпадающей пары
				//меняем непрозрачность по константе [нажато]
				onfocusCircle.changeOpacityMode(	'onclick'	);
			};
			
		};
		//рисуем эффект расширяющегося круга под мышью
		effects.paintExpandingCircle(	mouse,	1	);	//	координаты щелчка {x,y} и радиус - 1
	};
	//события при отпускании мыши (срабатывает однократно, пока не нажать (mousedown)
	if(	mouse.inEvent	==	'mouseup'	){
		//флаг: если пара вращения найдена и 
		if(	scenario.flags.spinPairIsFoundAndHidden	){
			//меняем пару вращения на новые круги
			replaceSpinPairToNewCircles();
			//флаг: меняем состояние, что операция выполнена
			scenario.flags.spinPairIsFoundAndHidden	=	false;
		};
		if(	onfocusCircle	){	//	при наличии активного круга
			if(	!spinPair	){	//	при отсутствии совпадающей пары
				//меняем непрозрачность по константе [в фокусе]
				onfocusCircle.changeOpacityMode(	'onfocus'	);
			}else{
				//
				if(	scenario.flags.changeSpinPairCirclesToCirclesFilled	){	//	
					//постепенно скрываем совпадающую пару кругов
					//	[пара вращений]	*	[флаг сценария - пара вращения найдена]
					//if(	spinPair	){
						//скрываем пару вращений
						circles.hiddenSpinPair();
					//};
					//меняем пару вращения на закрашенные (filled) круги
					changeSpinPairCirclesToCirclesFilled(	onfocusCircle	);
					//отмечаем флаг сценария что замена пары вращения на закрашенный круг выполнена
					scenario.flags.changeSpinPairCirclesToCirclesFilled	=	false;
					//отмеяаем, что эта операция выполнена
					scenario.flags.spinPairIsFoundAndHidden				=	true;
				};
				//
				
			};
		};
	};
};

//------------------
//массив для загрузки изображений
let data		=	[];
//массив для загрузки закрашенных (filled) изображений
let dataFilled	=	[];

//------------------
//функция обновления холста
let refresh		=	function(){
	//очистка холста
	draw.context.clearRect(	0,	0,	draw.canvas.width,	draw.canvas.height	);
	//прорисовываем эффекты
	effects.publish();
	//прорисовываем круги
	circles.publish();
	//непрерывно обновляем непрозрачность кругов. Обновляю все, по-скольку в начале уровня производится постепенная их прорисовка
	circles.getAllCircles().forEach(	(value)	=>	{
			value.countOpacity();
		}
	);
	//прорисовываем закрашенные (filled) круги
	circlesFilled.publish();
	//непрерывно обновляем непрозрачность активного закрашенного (filled) круга
	if(	circlesFilled.getCurrent()	){	//	если есть
		circlesFilled.getCurrent().countOpacity();
		//и анимируем их вращение
		circlesFilled.getCurrent().rotate(	ANIMATE_ROTATE_SPEED	);
	};
	//вращение всех кругов,кроме активного
	//по скольку проверка кругов на совпадения углов происходит только при наличии активного круга
	//	с прозрачностью в режиме нажатия [onclick], можно без проблем вращать круги в фоновом режиме
	circles.rotateAllCirclesBesidesCurrent(	deltaAnglesAutoRotateCircles	);
};

//------------------
//инициализация после загрузки ресурсов
let timer;
	//start;
let init		=	function(){
	//создаем основной  класс кругов
	circles		=	new Circles(
		[
			new SpinDifference(	data[0],	spinData[0]	),
			new SpinDifference(	data[1],	spinData[1]	),
			new SpinDifference(	data[2],	spinData[2]	),
			new SpinDifference(	data[3],	spinData[3]	),
			new SpinDifference(	data[4],	spinData[4]	),
			new SpinDifference(	data[5],	spinData[5]	)
		]
	);
	//и назначаем каждой свою непрозрачность (для постепенного поочередного появления)
	//circles.setCustomOpacityForAllCircles(	customStartOpacitiesCircles	);
	//создаем основной класс закрашенных (filled) кругов
	circlesFilled	=	new	CirclesFilled(
		[
			new RigitbodyRound2d(	dataFilled[0]	),
			new RigitbodyRound2d(	dataFilled[1]	),
			new RigitbodyRound2d(	dataFilled[2]	),
			new RigitbodyRound2d(	dataFilled[3]	),
			new RigitbodyRound2d(	dataFilled[4]	),
			new RigitbodyRound2d(	dataFilled[5]	),
			new RigitbodyRound2d(	dataFilled[6]	),
			new RigitbodyRound2d(	dataFilled[7]	)
		]
	);
	//скрываем закрашенные
	circlesFilled.hideAll();
	//передадим максимальный ридиус круга в класс эффектов.
	//	В нашем случае это радиус последнего круга, т.к. они сортированы по возрастанию
	effects.setParameters(	circles.getMaxRadiusOfAllImages()	);
	//создаем таймер для фунции обновления холста
	timer	=	window.setInterval(	refresh,	FRAME_TIME	);
	/*
	start	=	Date.now();
	setTimeout(
		function run(){
			c('runnnn');
			if(	(Date.now()	-	start)	==	20	){
				c('run');
				start	=	Date.now();
				refresh();
			}else{
				setTimeout(	run	);
			};
		}
	);
	*/
	//присваиваем фунцию обновления событий мыши
	update	=	updateFunc;
	//
};

//------------------
//загрузки окрашенных (filled) изображений
function loadFillPix(){
	//загружаем щакрашенные (fileed) круги
	loadPix(	fillPixNames,	dataFilled,	init,	0	);
};

loadPix(	pixNames,	data,	loadFillPix,	0	);

//------------------
//события мыши
canvas.addEventListener('mousemove',	function(){
	previousMouse	=	mouse;
	mouse	=	{
		inEvent	:	'mousemove',
		x		:	event.offsetX,
		y		:	event.offsetY
	};
	//
	update();
});

canvas.addEventListener('mouseup',		function(){
	mouse	=	{
		inEvent	:	'mouseup',
		x		:	event.offsetX,
		y		:	event.offsetY
	};
	update();
});

canvas.addEventListener('mousedown',	function(){
	mouse	=	{
		inEvent	:	'mousedown',
		x		:	event.offsetX,
		y		:	event.offsetY
	};
	update();
});













