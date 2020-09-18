//	CHANGES:
//	13-08-20
//	1.	Реализован механизм передачи параметров эффектов (ф-ция setParameters класса Effects).
//		Конкретно передается минимальный радиус орбит для звезд.
//	14-08
//	1.	Добавлен перезапуск эффекта расширяющегося круга (restartExpandingCircle) по последним параметрам вызова (expandingCirclesData).
//	27-08
//	1.	Обнаружен баг на непорисовку на пол холста. Откуда, не понятно. Проявляется в Chrome. В FF все в норме.
//		За это время я переделывал свой сайт и наустанавливал Steam, что-то из git, обновил винду, поставил и удалил несколько игр.
//		Выявлено,что он вызывается линейным градиентом. Радиальные градиенты прорисовываются рывками.
//		Возможно, что это из-за обновления Chrome до v85.

//класс эффектов	-	звезды на орбите
class Stars{
	constructor(	maxStarsIn,	speed,	iThicknessIn	){
		this.stars			=	{
			orbitCenter		:	draw.center,
			xy				:	[],
			radii			:	[],
			minStarSize		:	1,
			maxStarSize		:	2,
			maxOrbitRadius	:	draw.center.y	*	.65	+	iThicknessIn,
			minOrbitRadius	:	draw.center.y	*	.65,
			color			:	'white',
			opacity			:	[],
			iMinOpacity		:	1,
			iMaxOpacity		:	40,
			maxStars		:	maxStarsIn,
			//анимация
			angleRadian		:	0,
			angleDelta		:	speed
		};
	};
	//создаем звездное облако. 
	creatureStarCloud(){
		//добавляем новую звезду
		//добавим ее размер случаймым значением в пределах радиусов
		this.stars.radii.push(	iGetRandWithin(this.stars.minStarSize,	this.stars.maxStarSize)	);
		//заполняем ее координаты {x,y} случаймыми значениями
		//случайный радиус орбиты
		let radius	=	iGetRandWithin(this.stars.minOrbitRadius,	this.stars.maxOrbitRadius);
		//координаты
		let X	=	iGetRandWithin(0,	radius)	*	iGetPlusMinusOne();
		let Y	=	getYCircle(X,		radius)	*	iGetPlusMinusOne();
		this.stars.xy.push(	{
			x	:	X,
			y	:	Y
		}	);
		//c(X+' '+Y+' '+radius+' '+this.stars.maxOrbitRadius);
		//задаем непрозрачность
		this.stars.opacity.push(	iGetRandWithin(	this.stars.iMinOpacity,	this.stars.iMaxOpacity)	/	100	);
	};
	//Прорисовка на холст. Вызывать для анимации
	drawStars(){
		if(	this.stars.maxStars	>	this.stars.radii.length	){	//	создаем не больше максимума
			this.creatureStarCloud();
		};
		//
		draw.context.save();
		draw.context.translate(	draw.center.x,	draw.center.y	);
		draw.context.rotate(	this.stars.angleRadian	);
		//
		for(	let ch	=	0;	ch	<	this.stars.xy.length;	ch++	){
			draw.context.beginPath();
			draw.context.globalAlpha	=	this.stars.opacity[ch];
			draw.context.fillStyle		=	this.stars.color;
			//дуга
			draw.context.arc(
				this.stars.xy[ch].x,
				this.stars.xy[ch].y,
				this.stars.radii[ch],
				0,
				Math.PI*2
			);
			draw.context.fill();
		};
		draw.context.restore();
		
		this.stars.angleRadian	+=	this.stars.angleDelta;
	};
	
};

//расширяющийся круг
class ExpandingCircle{
	constructor(){
		this.expandingCircle	=	{
			//xy			:	0,
			xy			:	draw.center,
			radius		:	5,
			maxRadius	:	50,
			visibleFlag	:	false,
			color		:	'white',
			opacity		:	1,
			deltaOpacity:	.01,
			thickness	:	2
		};
	};
	//задать цвет
	setColor(	colorIn	){
		this.expandingCircle.color	=	colorIn;
	};
	//задать параметры
	setParameters(		colorIn,	iRadiusIn,	iMaxRadiusDelta	){
		this.expandingCircle.radius			=	iRadiusIn;
		this.expandingCircle.maxRadius		=	this.expandingCircle.radius	+	iMaxRadiusDelta;
		this.expandingCircle.color			=	colorIn;
		this.expandingCircle.thickness		=	5;
		this.expandingCircle.opacity		=	.3;
		this.expandingCircle.deltaOpacity	=	this.expandingCircle.opacity	/	iMaxRadiusDelta;
	};
	//нарисовать расширяющийся круг в координатах {x,y}
	paintExpandingCircle(	xyIn,	radiusIn	){
		this.expandingCircle.xy				=	xyIn;
		this.expandingCircle.visibleFlag	=	true;
		//this.expandingCircle.radius			=	1;
		if(	radiusIn	!=	0	){
			this.expandingCircle.radius			=	radiusIn;
		};
	};
	//прорисовать на холст. Вызывать для анимации
	drawExpandingCircle(){
		//---расширяющийся круг---
		//если [флаг отображения]	и	радиус меньше максимума
		if(	this.expandingCircle.visibleFlag	&&	(this.expandingCircle.radius	<	this.expandingCircle.maxRadius	)){
			draw.context.beginPath();
			draw.context.globalAlpha	=	this.expandingCircle.opacity;
			draw.context.strokeStyle	=	this.expandingCircle.color;
			draw.context.lineWidth		=	this.expandingCircle.thickness;
			//дуга
			draw.context.arc(
				this.expandingCircle.xy.x,
				this.expandingCircle.xy.y,
				this.expandingCircle.radius,
				0,
				Math.PI*2
			);
			draw.context.stroke();
			//увеличиваем радиус (для анимации)
			this.expandingCircle.radius++;
			//уменьшаем непрозрачность
			if(	this.expandingCircle.maxRadius	<=	50	){
				//наиболее красиво для малых радиусов
				this.expandingCircle.opacity		=	5	/	this.expandingCircle.radius;
			}else{
				//для больших радиусов своя формула
				this.expandingCircle.opacity		-=	this.expandingCircle.deltaOpacity;
			};
		}else{
			//меняем флаг отображения
			this.expandingCircle.visibleFlag	=	false;
		};
	};
};

//радиальный градиент
class RadialGradient{
	constructor(
		HEXColorInside,					//цвет в центре
		HEXColorOutside,				//цвет с наружи
		//iDistancePercentOfFirstColor,	//дистанция внутреннего цвета в процентах по радиусу
		iMaxRadius,						//~	радиус градиента
		fOpacity,						//непрозрачность всего градиента
		iTime							//время внимации в кадрах. 0 - нет анимации
	){
		this.gradientData	=	{
			center				:	draw.center		,
			colorIn				:	HEXColorInside	,
			colorOut			:	HEXColorOutside	,
			radius				:	200	,
			minRadius			:	2	,
			maxRadius			:	iMaxRadius,
			deltaRadius			:	5	,
			firstColorDistance	:	.2	,
			//secondColorDistance	:	iDistancePercentOfSecondColor	/	100,
			secondColorDistance	:	1		,
			secondDistance		:	1		,
			deltaDistance		:	.05		,
			opacity				:	0		,
			maxOpacity			:	fOpacity,
			deltaOpacity		:	.01		,
			//
			iTime				:	iTime,
			_ch					:	1
			//biginWithPercent	:	50
		};
		this.gradient	=	0;
		this.animate	=	{
			animateFlag			:	true,//
			//repeatAnimateFlag	:	true,
			_prepateFlag		:	false,
			_animateDoneFlag	:	false
		};
	};
	_prepare(){
		let data	=	this.gradientData;
		//вычисляем шаги
		data.deltaRadius	=	(data.maxRadius				-	data.minRadius)				/	data.iTime;
		data.deltaDistance	=	(data.secondColorDistance	-	data.firstColorDistance)	/	data.iTime;
		data.deltaOpacity	=	data.maxOpacity												/	data.iTime	*	2;
		//подготовка завершена
		this.animate._prepateFlag	=	true;
	};
	//прорисовка на холст
	_drawRadialGradient(){
		let value	=	this.gradientData;
		//c('drawG');
		//draw.context.save()
		//задаем непрозрачность
		draw.context.globalAlpha	=	value.opacity;
		//координаты градиента
		this.gradient	=	draw.context.createRadialGradient(
			//координаты первой точки окружности
			value.center.x,
			value.center.y,
			0,
			//~	второй
			value.center.x,
			value.center.y,
			value.radius
		);
		//распредениление цветов
		this.gradient.addColorStop(	value.firstColorDistance	,		value.colorIn	);
		this.gradient.addColorStop(	value.secondDistance		,		value.colorOut	);
		//
		//draw.context.globalCompositeOperation	=	'multiply';
		//делаем градиент активным
		draw.context.fillStyle	=	this.gradient;
		//рисуем в прямоугольник
		draw.context.fillRect(	0,	0,	draw.canvasSize.width,	draw.canvasSize.height	);
		//включить анимацию?
		//если время анимации = 0, то отключаем анимацию.
		if(	!!this.animate.iTime	)	this.animate.animateFlag	=	false;//
		//если флаг анимации включен
		if(	this.animate.animateFlag	){//
			//если подготивки к анимации еще не было
			if(	!this.animate._prepateFlag	){
				//запускаем подготовку
				this._prepare();
			};
			//
			let data	=	this.gradientData;
			//меняем переменные по счетчику (за кадр)
			data.radius			=	data.minRadius			+	data.deltaRadius	*	data._ch;
			data.secondDistance	=	data.firstColorDistance	+	data.deltaDistance	*	data._ch;
			if(	data._ch	>	(data.iTime	/	2)	){
				data.opacity		=	data.maxOpacity			-	data.deltaOpacity	*	(data._ch	-	(data.iTime	/	2));
			}else{
				data.opacity	=	data.maxOpacity;
			};
			//c(data);
			//инкрементируем счетчик
			if(	data._ch	<	data.iTime	){
				data._ch++;
			}else{
				//если флаг анимации включен ( т.е. эффект НЕ статичен)
				//if(	this.animate.animateFlag	){
					//после завершения анимации меняем флаг состояния завершения анимации
					this.animate._animateDoneFlag	=	true;
				//}else{
					//если эффект статичен, не завершаем состояние анимации
					
				//};
			};
		};
		//draw.context.restore();
	};
	//прерываем вызов после выполнения
	drawRadialGradient(){
		if(	!this.animate._animateDoneFlag	){
			this._drawRadialGradient();
		};
	};
	//
	restartAnimationRadialGradient(){
		this.animate._animateDoneFlag	=	false;
		this.gradientData._ch			=	1;
	};
};

//класс линейного градиента
class LinearGradient{
	constructor(){
		this.colors	=	{
			first		:	[	0,	0,	0	],
			second		:	[	0,	0,	0	]
		};
		this.necessaryColors	=	{
			first		:	[	50,	50,	100	],
			second		:	[	0,	0,	0	]
		};
		this.animationData	=	{
			_ch					:	1,
			speed				:	100,
			firstDeltaColors	:	[	.5,	.5,	1	],
			secondDeltaColors	:	[	0,	0,	0	]
		};
	};
	//прорисовка на холст
	drawLinearGradient(){	//	применять для анимации
		if(	this.animationData._ch	<	this.animationData.speed	){
			//c('animateCh: '+this.animationData._ch);
			//
			this.colors.first[0]	+=	this.animationData.firstDeltaColors[0];
			this.colors.first[1]	+=	this.animationData.firstDeltaColors[1];
			this.colors.first[2]	+=	this.animationData.firstDeltaColors[2];
			
			this.colors.second[0]	+=	this.animationData.secondDeltaColors[0];
			this.colors.second[1]	+=	this.animationData.secondDeltaColors[1];
			this.colors.second[2]	+=	this.animationData.secondDeltaColors[2];
			//
			this.animationData._ch++;
		};
		//
		draw.context.globalAlpha	=	1;
		//
		let gradient		=	draw.context.createLinearGradient(	0,	0,	draw.canvasSize.width,	draw.canvasSize.height	);
		//
		let sColorFirst		=	getStrFromColors(	this.colors.first	);
		let sColorSecond	=	getStrFromColors(	this.colors.second	);
		
		//c(sColorFirst);
		//
		gradient.addColorStop(0, sColorFirst);
		gradient.addColorStop(1, sColorSecond);
		//
		draw.context.fillStyle	=	gradient;
		draw.context.fillRect(	0,	0, draw.canvasSize.width, draw.canvasSize.height	);
		
	};
	//задать параметры
	setParameters(	firstColorIn,	secondColorIn,	speedIn	){
		//
		this.animationData._ch			=	1;
		//
		this.animationData.speed		=	speedIn;
		//
		this.necessaryColors.first		=	getColorsFromStr(	firstColorIn	);
		this.necessaryColors.second		=	getColorsFromStr(	secondColorIn	);
		//
		let a	=	this.necessaryColors.first;
		let b	=	this.colors.first;
		let c	=	speedIn;
		this.animationData.firstDeltaColors[0]	=	(a[0]	-	b[0])	/	c;
		this.animationData.firstDeltaColors[1]	=	(a[1]	-	b[1])	/	c;
		this.animationData.firstDeltaColors[2]	=	(a[2]	-	b[2])	/	c;
		
		a		=	this.necessaryColors.second;
		b		=	this.colors.second;
		this.animationData.secondDeltaColors[0]	=	(a[0]	-	b[0])	/	c;
		this.animationData.secondDeltaColors[1]	=	(a[1]	-	b[1])	/	c;
		this.animationData.secondDeltaColors[2]	=	(a[2]	-	b[2])	/	c;
		
	};
};

//общий класс эффектов
class AllEffects	extends	ExpandingCircle{
	constructor(){
		super();
		this.sets	=	{
			minimumOrbitRadius		:	100
		};
		//массив классов звезд на орбите
		this.stars	=	[
			//new Stars(	200, 	.0001,	50	),
			new Stars(	100, 	.0002,	50	),
			//new Stars(	500, 	-.0005,	70	),
			new Stars(	100, 	-.0002,	100	),
			new Stars(	500,	.0001,	200	)
		];
		//массив классов радиальных градиентов
		//	конкретно те, что здесь, запускаются на старте прорисовки.
		//	Добавленные позже запускаются отдельно при нахождении пары вращения
		this.radialGradients	=	[
			new RadialGradient(	'rgb(	150,	150,	250	)',	'rgba(0,0,0,0)',	500,	.5,	100	),
			new RadialGradient(	'rgb(	150,	150,	250	)',	'rgba(0,0,0,0)',	500,	.5,	200	),
			new RadialGradient(	'rgb(	150,	150,	250	)',	'rgba(0,0,0,0)',	500,	.5,	260	)
			
			//new RadialGradient(	'rgb(250,	0,	0	)',	'rgba(0,0,0,0)',	400,	.3,	20	),
			//new RadialGradient(	'rgb(180,	180,0	)',	'rgba(0,0,0,0)',	400,	.3,	30	),
			//new RadialGradient(	'rgb(180,	250,0	)',	'rgba(0,0,0,0)',	400,	.3,	40	),
			//new RadialGradient(	'rgb(0,		250,0	)',	'rgba(0,0,0,0)',	400,	.3,	50	),
			//new RadialGradient(	'rgb(100,	100,250	)',	'rgba(0,0,0,0)',	400,	.5,	60	),
			//new RadialGradient(	'rgb(0,		0,	250	)',	'rgba(0,0,0,0)',	400,	.3,	270	),
			//new RadialGradient(	'rgb(250,	0,	250	)',	'rgba(0,0,0,0)',	400,	.3,	480	)
		];
		//массив классов расширяющихся окружностей
		this.expandingCircles	=	[
			new ExpandingCircle()
		];
		//
		this.expandingCirclesData	=	{
			xy		:	0,
			radius	:	10
		};
		//массив классов линейных градиентов
		this.linearGradients	=	[
			new LinearGradient()
		];
		this.secondColorOfRadianGradient	=	'rgba(150,150,150,0)';
	};
	//
	setParameters(	fMinimumOrbitRadiusIn	){
		this.sets.minimumOrbitRadius	=	fMinimumOrbitRadiusIn;
		//c(fMinimumOrbitRadiusIn);
		this.stars.forEach(	(value)	=>	{
				value.stars.minOrbitRadius	=	this.sets.minimumOrbitRadius	+	20
			}
		);
	};
	//вызов всех эффектов с последующей прорисовкой на холст. Для анимации.
	publish(){
		//рисуем линейные градиенты
		this.linearGradients.forEach(	(value)	=>	{
				//value.drawLinearGradient();				**************	BAG	*************
			}
		);
		//рисуем радиальные градиенты
		this.radialGradients.forEach(	(value)	=>	{
				value.drawRadialGradient();
			}
		);
		//рисуем расширяющийся круг (под указателем)
		this.drawExpandingCircle();
		//рисуем звезды на орбитах
		this.stars.forEach(	(value)	=>	{
				value.drawStars();
			}
		);
		//рисуем расширяющиеся круги из центра экрана
		this.expandingCircles.forEach(	(value)	=>	{
				//value.paintExpandingCircle(	draw.center,	0	);
				value.drawExpandingCircle();
			}
		);
		
	};
	//задать внутренний цвет для радиального градиента
	setParametersForRadialGradient(	colorIn,	iRadiusIn	){
		//c(colorIn+' '+Math.floor(	iRadiusIn	));
		this.radialGradients	=	[
			new RadialGradient(	colorIn,	this.secondColorOfRadianGradient,	Math.floor(iRadiusIn	*	2),	1,	40	),
			new RadialGradient(	colorIn,	this.secondColorOfRadianGradient,	Math.floor(iRadiusIn	*	3),	1,	80	),
			new RadialGradient(	colorIn,	this.secondColorOfRadianGradient,	Math.floor(iRadiusIn	*	4),	1,	120	),
			new RadialGradient(	colorIn,	this.secondColorOfRadianGradient,	Math.floor(iRadiusIn	*	4),	1,	250	),
			new RadialGradient(	colorIn,	this.secondColorOfRadianGradient,	Math.floor(iRadiusIn	*	4),	1,	350	)
			//new RadialGradient(	colorIn,	'rgba(0,0,0,0)',	Math.floor(iRadiusIn	*	3),	1,	0	)
		];
	};
	//перезапуск всех радиальных градиентов
	restartAllRadialGradients(){
		this.radialGradients.forEach(	(value)	=>	{
				value.restartAnimationRadialGradient()
			}
		);
	};
	//перезапуск эффекта расширяющегося круга с последними параметрами
	restartExpandingCircle(){
		this.expandingCircles.forEach(	(value)	=>	{
				value.paintExpandingCircle(	this.expandingCirclesData.xy,	this.expandingCirclesData.radius	)
			}
		);
	};
	//задать параметры для расширяющей окружности
	setParametrsForExpandingCircle(	colorIn,	iRadiusIn	){
		this.expandingCircles.forEach(	(value)	=>	{
			value.setParameters(		colorIn,		Math.floor(iRadiusIn),	100	);
			value.paintExpandingCircle(	draw.center,	Math.floor(iRadiusIn)		);
			this.expandingCirclesData.xy		=	draw.center;
			this.expandingCirclesData.radius	=	Math.floor(iRadiusIn);
		}
		);
		//c(this.expandingCircles[0].expandingCircle.radius);
	};
	//задать параметры для линейного градиента
	//[firstColorIn],	[secondColorIn],	[iTimeIn]
	setParametersForLinearGradient(	dataIn	){
		this.linearGradients.forEach(	(value)	=>	{
				value.setParameters(	dataIn[0],	dataIn[1],	dataIn[2]	);
			}
		);
	};
	
};

//----Initialise------
let effects	=	new AllEffects();


























