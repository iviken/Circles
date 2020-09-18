//	CHANGES:
//	12-08-20
//	Добавлен режим смешивания изображений в класс Pix.
//	14-08
//	1.	Добавлена замена изображения в класс Pix.

//клас холста и контекста
class Draw{
	constructor(){
		this.canvas		=	document.getElementById(	'canvas'	);
		this.context	=	this.canvas.getContext(	'2d'	);
		this.canvasSize	=	{	
			width	:	this.canvas.width,
			height	:	this.canvas.height
		};
		this.center		=	{
			x	:	this.canvas.width	/	2,
			y	:	this.canvas.height	/	2
		};
	};
};
let draw	=	new Draw();

//------------------
//класс управления непрозрачностью
class Opacity{
	constructor(){
		//константа для обозначения непрозрачности
		this.state		=	'disfocus';
		//значения констант непрозрачности (далее н.) в интервале 0..1000
		this.opacity	=	{//все числа должны быть кратны друг-другу
			onfocus		:	700,
			disfocus	:	500,
			onclick		:	1000,
			hidden		:	0,
			fullVisible	:	1000,
			delta		:	10,		//	приращение на каждый тик (кадр)
			current		:	10,		//	текущее значение н. Каждую итерацию вызова countOpacity() значение стремится к necessary
			necessary	:	500,	//	желаемое значение н.
			
			locked		:	false,	//	блокировать приращение непрозрачности
			
			unevenMin	:	0		//	минимальное значение плавающей непрозрачности
		};
	};
	//присвоить режим непрозрачности по внутренней константе (для анимации)
	changeOpacityMode(	constModeIn	){
		if(	!this.opacity.locked	){
			this.state	=	constModeIn;
			if(	constModeIn	==	'disfocus'		)	this.opacity.necessary	=	this.opacity.disfocus;
			if(	constModeIn	==	'onfocus'		)	this.opacity.necessary	=	this.opacity.onfocus;
			if(	constModeIn	==	'onclick'		)	this.opacity.necessary	=	this.opacity.onclick;
			if(	constModeIn	==	'hidden'		)	this.opacity.necessary	=	this.opacity.hidden;
			if(	constModeIn	==	'fullVisible'	)	this.opacity.necessary	=	this.opacity.fullVisible;
		};
	};
	//присвоить непрозрачность по внутренней константе сразу
	setOpacityByConst(	constModeIn	){
		if(	!this.opacity.locked	){
			this.state	=	constModeIn;
			if(	constModeIn	==	'disfocus'		)	this.opacity.current	=	this.opacity.disfocus;
			if(	constModeIn	==	'onfocus'		)	this.opacity.current	=	this.opacity.onfocus;
			if(	constModeIn	==	'onclick'		)	this.opacity.current	=	this.opacity.onclick;
			if(	constModeIn	==	'hidden'		)	this.opacity.current	=	this.opacity.hidden;
			if(	constModeIn	==	'fullVisible'	)	this.opacity.current	=	this.opacity.fullVisible;
			this.changeOpacityMode(	constModeIn	);
		};
	};
	//задать режим плавающей непрозрачности
	setUnevenOpacityMode(	iMinimumPersentOfOpacity	){
		this.state				=	'uneven';
		this.opacity.unevenMin	=	iMinimumPersentOfOpacity	*	10;
		this.opacity.necessary	=	1000	-	iMinimumPersentOfOpacity	*	10;
		this.opacity.delta		=	1;
	};
	//задать произвольную непрозрачность
	setCustomOpacity(	iOpacityProcentIn	){
		this.state				=	'custom';
		this.opacity.necessary	=	iOpacityProcentIn	*	10;
	};
	//вызывается каждый кадр для выравнивания непрозрачности от current -> necessary
	countOpacity(){//для анимации
		//если задана плавающая непрозрачность
		if(	this.state	==	'uneven'	){
			//если меньше плавающего минимума
			if(	this.opacity.current	==	this.opacity.necessary	){
				this.opacity.necessary	=	iGetRandWithin(	this.opacity.unevenMin,	1000	);
			};
		};
		//выравниваем текущую (current) непрозрачность к нужной (necessary)
		if(	this.opacity.current	<	this.opacity.necessary	)	this.opacity.current	+=	this.opacity.delta;
		if(	this.opacity.current	>	this.opacity.necessary	)	this.opacity.current	-=	this.opacity.delta;
		//c('curr: '+this.opacity.current);
	};
	//возвращает значение непрозрачности типа float
	getOpacity(){
		return this.opacity.current	/	1000;//используются целые числа для точности
	};
	//возвращает константу непрозрачности
	getOpacityMode(){
		return this.state;
	};
	//запреить изменять непрозрачность
	lockChangeOpacity(){
		this.opacity.locked	=	true;
	};
	//разрешить изменять непрозрачность
	unlockChangeOpacity(){
		this.opacity.locked	=	false;
	};
	//задать меньше шаг для анимации непрозрачности
	setStepLess(){
		this.opacity.delta	==	5	?	2	:	5;
		this.opacity.delta	==	2	?	1	:	2;
	};
	//
	isHidden(){
		return this.opacity.delta	>=	this.opacity.current	?	true	:	false;
	};
	//
};

//------------------
//класс изображения.
class Pix	extends	Opacity{
	constructor(	pixIn	){	//	принимает ссылку на обьект [image]
		super();
		this.img			=	pixIn;
		//множитель масштабирования изображения
		this.zoom			=	IMG_ZOOM_MULT;
		//радиус изображения. По скольку они в форме круга, то берется значение длинны или ширины изображения
		this.radius			=	this.img.width	*	this.zoom;
		//разрешить прорисовку?
		this._publishFlag	=	true;
		//множитель масштабирования для временного изменения размера изображения
		this.resize			=	1;
	};
	//прорисовка на холст
	drawing(){
		if(	this._publishFlag	){
			draw.context.globalAlpha	=	super.getOpacity();
			//	TODO
			//обнаружен баг
			//draw.context.globalCompositeOperation	=	'screen';
			draw.context.drawImage(
				this.img,
				-this.radius	*	this.resize,
				-this.radius	*	this.resize,
				this.radius	*	2	*	this.resize,
				this.radius	*	2	*	this.resize
			);
		};
	};
	//разрешить прорисовку
	enableDraw(){
		this._publishFlag	=	true;
	};
	//запретить прорисовку
	disableDraw(){
		this._publishFlag	=	false;
	};
	//изменить масштабирование изображения
	resizeImageByPercent(	iSizePercent	){
		this.resize	=	iSizePercent	/	100;
	};
	//сброс масштабирования изображения
	restoreSizeImage(){
		this.resize	=	1;
	};
	//вернуть радиус изображения
	getRadius(){
		return this.radius;
	};
	//заменить изображение
	replaceImg(	imgIn	){
		this.img	=	imgIn;
	};
	//загрузить и заменить изображение
	//	>				[полное иня файла изо.]	[ф-ция спешного выполнения]	[ф-ция сбоя]
	loadAndReplaceImg(	imgFullname,	successCallback,	errorCallback	){
		this.img.src		=	imgFullname;
		this.img.onload		=	()	=>	{
			successCallback();
		};
		this.img.onerror	=	()	=>	{
			errorCallback();
		};
	};
	//
};

//------------------
//класс трансформации (только вращение) изображения
class RigitbodyRound2d	extends	Pix{
	constructor(	img	){
		super(	img	);
		this.angleRadian	=	Math.random();
		this.center			=	draw.center;
		this.rotateSpeed	=	ROTATE_SPEED;
		this._rotateFlag		=	true;
	};
	//смешение и вращение холста для прорисовки
	rotating(){
		draw.context.translate(	draw.center.x,	draw.center.y	);
		draw.context.rotate(	this.angleRadian	);
	};
	//проверка вхождения точки в радиус этой области
	checkEntryPoint(	xyIn	){
		return this.radius	<	getVectorScale2(	getVector2(this.center,	mouse)	);
	};
	//задание угла поворота относительно текущего в радианах для последующей отрисовки
	rotate(	radIn	){
		if(	this._rotateFlag	){
			this.angleRadian	=	(this.angleRadian	-	radIn	*	this.rotateSpeed)	%	(Math.PI	*	2);
		};
	};
	//вернуть радианы
	getRadian(){
		return this.angleRadian;
	};
	//присвоить угол поворота в радианах напрямую
	setRadian(	fRadianIn	){
		this.angleRadian	=	fRadianIn	%	(Math.PI	*	2);
	};
	//разрешить вращение
	allowRotate(){
		this._rotateFlag	=	true;
	};
	//запретить вращение
	forbidRotate(){
		this._rotateFlag	=	false;
	};
};

//------------------
//класс для нахождения совпадений углов вращений двух соседних кругов
class SpinDifference	extends	RigitbodyRound2d{
	constructor(	img,	spinDataIn	){
		super(	img	);
		this.spinData	=	spinDataIn;		//	массив[][] углов вращений
		this.spinCh		=	-1;				//	счетчик строки массива spinData[][]
	};
	//берет разность углов родителя и аргумента и проверяет на наличие в массиве углов
	_checkSpinDifferenceWith(	radianIn	){
		//угол поворота в градусах <аргумент>
		let degreesIn		=	radianToDegree(	radianIn	);
		//угол поворота в градусах от класса родителя
		let degreesCurrent	=	radianToDegree(	super.getRadian()	);
		//разница углов поворота, кратная полному обороту (360)
		let degrees			=	Math.abs(degreesIn	-	degreesCurrent)	%	360.0;
		//c('degrees '+degrees);
		//внутренний счетчик
		let ch				=	0;
		//сбрасываем
		this.spinCh			=	-1;
		//прогоняем массив[][] на предмет нахождения угла в пределах погрешности
		for(	let value	of	this.spinData	){	//прогнать по массиву углов
			if(
				//найти угол в массиве value[] из spinData[][]
				checkBelongs(	degrees,	value,	SPIN_ERROR_DEGREE	)	//	[угол]	[массив]	[погрешность]
			){
				//счетчик строки массива spinData
				this.spinCh	=	ch;
				//c(degrees+' '+value+' '+ch);
				//угол найден в spinDataIn[][]	>>>>>
				return true;
			};
			//если угол не найден, инкрементируем. Возможно в следующей итерации угол найдется
			ch++;
		};
		//если угол не найден в spinDataIn[][]	>>>>>
		return false;
	};
	//берет разность углов родителя и аргумента и проверяет на наличие в массиве углов
	checkSpinDifferenceWith(	radianIn	){
		//c('checkSpin '+radianIn);
		if(	this.spinData	){
			let result;
			result	=	this._checkSpinDifferenceWith(	radianIn	);
			return result;
		}else{
			return false;
		};
	};
	//возвращает результат функции проверки выше (счетчик строки двухмерного массива)
	getSpinCh(){
		return this.spinCh;
	};
};

//------------------
//загружает изображения
function loadPix(	namesIn,	dataIn,	afterCallFunction, i	){	//	[массив полных имен],	[чистый массив для загрузки],	[callback функция после загрузки,	системный счетчик - всегда 0]
	if(	i	==	namesIn.length	){
		if(	afterCallFunction	){
			afterCallFunction();
		};
		return;
	};
	let img		=	new Image();
	img.src		=	namesIn[	i	];
	img.onload	=	()	=>	{
		dataIn.push(	img	);
		loadPix(	namesIn,	dataIn,	afterCallFunction,	++i	)
	};
	img.onerror	=	()	=>	{
		alert('ресурс '+namesIn[	i	]+' не загружен');
	};
};

