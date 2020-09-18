//настраиваем параметры
let FRAME_TIME		=	20;
//проверяем модель браузера
if(	window.navigator.userAgent.indexOf('rome')	>	-1	)	FRAME_TIME	=	60;	//	назначаем время обновления кадров
	else	FRAME_TIME	=	5;
//отпределяем соотношение сторон холста
let cw	=	document.getElementsByTagName('canvas')[0].width;
let ch	=	document.getElementsByTagName('canvas')[0].height;
let canvasAspectRatio	=	cw>ch	?	ch/cw	:	cw/ch;
let canvasDiagonal		=	Math.sqrt(	cw*cw	+	ch*ch	);
//-------CONTANTS---
//коэффициент скорости поворота активного круга пользователем.
const ROTATE_SPEED			=	.5;
//+- диапозон для алгоритма нахождения совпадений углов вращений пары кругов
const SPIN_ERROR_DEGREE		=	1;
//множитель выставляется по размеру самого большого ихображения.
const IMG_SIZES				=	1.0;
//множитель размера изображений
const IMG_ZOOM_MULT			=	IMG_SIZES	*	canvasAspectRatio	*	canvasDiagonal	/	1500;
//скорость (в радианах) фонового вращения кругов
const ANIMATE_ROTATE_SPEED	=	.006;

//------------------
//массив углов вращений (в градусах) каждого круга по отношению следующему
let spinData									=	[
	//111
	[	
		[0,	120,240],										//green
		[43,79,	163,199,273,319],							//blue
		[60,180,300]										//orange1
	],
	[//112
		[0,	120,240]										//night
	],
	[//113
		[0,	30,	60,	90,	120,150,180,240,300]				//violet
	],
	[//114
		[0,	30,	60,	90,	120,150,180,210,240,270,300,330],	//orange2
		[15,45,	75,	105,135,165,195,225,255,285,315,345]	//yellow
	],
	[//115
		[]													//empty
	],
	[//116
		[]													//empty
	]
];
//массив кодов пар кругов и цвета. Предназначен для поиска и в дальнейшем взятие по индексу значений закрашенных (filled) изображений
let fillPixIndexes								=	[	//	[НОМЕР круга внутреннего]	[НОМЕР круга внешнего]	[НОМЕР строки массива spinData]
	121,
	122,
	123,
	231,
	341,
	451,
	452
];
//цвета для радиальных градиентов
let colorsOfRadialGradientsEffectsForFillPix	=	[
	'rgb(0,		200,	150)'	,	//	green
	'rgb(50,	50,		250)'	,	//	blue
	'rgb(250,	180,	0)'		,	//	orange1
	'rgb(0,		0,		100)'	,	//	night
	'rgb(200,	0,		200)'	,	//	violet
	'rgb(250,	150,	0)'		,	//	orange2
	'rgb(250,	250,	100)'		//	yellow
];
//цвета для линейных градиентов
let dataLinearGradientsEffects					=	[
	['rgb(0,	80,		80)'	,	'rgb(0,		0,	0	)'	,	100	],	//	for green
	['rgb(5,	60,		100)'	,	'rgb(10,	10,	10	)'	,	100	],	//	for blue
	['rgb(200,	150,	200)'	,	'rgb(200,	100,0	)'	,	100	],	//	for orange1
	['rgb(5,	40,		75)'	,	'rgb(10,	10,	10	)'	,	100	],	//	for night
	['rgb(200,	0,		250)'	,	'rgb(0,		0,	0	)'	,	100	],	//	for violet
	['rgb(255,	255,	200)'	,	'rgb(150,	150,250	)'	,	100	],	//	for orange2
	['rgb(100,	100,	0)'		,	'rgb(0,		0,	0	)'	,	100	]	//	for yellow
];
//массив углов приращений вращения в радианах
let deltaAnglesAutoRotateCircles				=	[
			ANIMATE_ROTATE_SPEED	/	2,
	-1	*	ANIMATE_ROTATE_SPEED	/	4,
			ANIMATE_ROTATE_SPEED	/	6,
	-1	*	ANIMATE_ROTATE_SPEED	/	12,
			ANIMATE_ROTATE_SPEED	/	10,
	-1	*	ANIMATE_ROTATE_SPEED	/	6,		
];

//------------------
//массив с именами изображений
let pixNames					=	[
	'111.png',	
	'112.png',	
	'113.png',	
	'114.png',	
	'115.png',
	'116.png'
];
//массив непрозрачности для старгово постепенного появления кругов
let customStartOpacitiesCircles	=	[//	TODO
	90,	50,	30,	20,	10
];
//массив с именами закрашенных (filled) изображений
let fillPixNames				=	[
	'111-1-0.png',
	'111-2-0.png',	
	'111-3-0.png',
	'112-1-0.png',
	'113-1-0.png',
	'114-1-0.png',
	'114-2-15.png',
	'116pink.png'
];

//------------------
//число геометрий (geometry set) - пластических вариаций каждого кольца
const MAX_PIX_GEOMETRIES	=	1;
//число цветовых комбинаций (color sets) в одной геометрии
const MAX_PIX_COLORSETS		=	2;

//меняет данные кругов по коду пары вращений. Вызывать при смене закрашенных кругов на новые
function replaceFillPixNamesBySpinCode(	strSpinCodeIn,	strNameOfNewInsideCircle,	strNameOfNewOutsideCircle	){
	//
	let [	insideCirclesNumber,	outsideCircleNumber,	colorPair	]	=	String(	strSpinCodeIn	);
	//
	pixNames[	insideCirclesNumber	]	=	strNameOfNewInsideCircle;
	//
	pixNames[	outsideCircleNumber	]	=	strNameOfNewOutsideCircle;
	//
	
};




























