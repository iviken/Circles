//возвращает вектор
function getVector2(	point1,	point2	){//две точки {x,y}
	let X	=	point2.x	-	point1.x;
	let Y	=	point2.y	-	point1.y;
	return 		{x:X,	y:Y};
};
//возвращает длинну вектора
function getVectorScale2(	vectorIn	){//вектор {x:X,	y:Y}
	let X	=	vectorIn.x;
	let Y	=	vectorIn.y;
	return		Math.sqrt(X*X+Y*Y);
};
//возвращает угол в радианах между двумя векторами
function calculateAngleViaVectors2(	vector1,	vector2	){//два вектора {x:X,	y:Y}
	let kA		=	vector1.x/	vector1.y;
	let kB		=	vector2.x/	vector2.y;
		
	if(	(Math.abs(kA)	==	Infinity)	||	(Math.abs(kB)	==	Infinity)	) return 0;
		
	let radian	=	(kB-kA)	/	(1+kB*kA);
		
	//c('radian: '+radian+' kA: '+kA+' kB: '+kB);
	return radian;
};
//возвращает угол в радианах между тремя точками через вторую точку
function calculateAngleViaThreePoints2(	p1,	p2,	p3	){//три точки {x.y}
	let vector_1	=	getVector2(	p2,	p1	);
	let vector_2	=	getVector2(	p2,	p3	);
	let radian		=	calculateAngleViaVectors2(	vector_1,	vector_2	);
	
	return radian;
};
//возвращает радиан из градусов
function degreeToRadian(	degreeIn	){//
	
};
//возвращает градусы из радиан
function radianToDegree(	fRadianIn	){//число float
	return fRadianIn	*	180.0	/	Math.PI;
};
//проверяет массив на совпадение с числом в пределах погрешности (+-errorIn)
function checkBelongs(		numIn,	setIn,	errorIn	){//число,	одноуровневый массив,	погрешность
	for(	let value	of	setIn	){
		if(	((value-errorIn)	<	numIn)	&&	(numIn	<	(value+errorIn))	){
			return true;
		};
	};
	return false;
};
//вернуть случайное натуральное число в пределах
function iGetRandWithin(	iMin,	iMax	){
	return Math.round(	iMin	+	Math.random()	*	(iMax	-	iMin)	);
};
//вернуть 1 либо -1
function iGetPlusMinusOne(){
	return Math.random()	>	.5	?	1	:	-1;
};
//возвращает {y(х)} круга
function getYCircle(	fX,	fRadius	){
	return Math.round(	Math.sqrt(	fRadius	*	fRadius	-	fX	*	fX	)	);
};
//вернуть массив трех цветов из строкового выражения
function getColorsFromStr(	strIn	){
	let colorSplit	=	strIn;
	let tmp			=	colorSplit.split(',');
	colorSplit		=	[
		Number(	tmp[0].split('(')[1]	),
		Number(	tmp[1]					),
		Number(	tmp[2].split(')')[0]	)
	];
		
	//c(colorSplit);
	
	return colorSplit;
};
//вернуть строку цветов формата [rgb(x,x,x)] из массива
function getStrFromColors(	RGBmassIn	){
	return 'rgb('+	RGBmassIn[0]	+	','	+	RGBmassIn[1]	+	','	+	RGBmassIn[2]	+	')';
};
//-------------
//вернуть число из значения в пикселях
function getNumberFromPixels(	strIn	){
	return Number(	strIn.slice(	0, strIn.indexOf('px')	)	);
};
//



























