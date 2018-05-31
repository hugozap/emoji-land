
/*
 A simple js file.
 Rendering is done with innerHTML.
*/
import * as emoji from './emoji';

const PARCEL_ROWS = 5
const PARCEL_COLS = 5
const PARCEL_CELLS = PARCEL_ROWS * PARCEL_COLS
const CELL_SIZE = 80
const PARCEL_WIDTH = PARCEL_ROWS * CELL_SIZE
const PARCEL_HEIGHT = PARCEL_ROWS * CELL_SIZE

/*
  __ __  __
 / _/ _|/ _|
( (_\_ \\_ \
 \__|__/|__/

*/

const css = `
	* {
		box-sizing: border-box;
	}

	#grid-container{
		position:fixed;
		width:calc(100% - 200px);
		top:0;
		left:0;
		height:100vh;
		overflow: hidden;
	}

	.grid-scrollable-content {
		position: absolute;
		top: 0;
		left: 0;
	}

	.grid {
		position: absolute;
		top: 0;
		left: 0;
	}

	.grid .row {
		display: flex;
		flex-direction:row;
	}

	.grid .row .px {
		font-size: ${CELL_SIZE-2}px;
		background-color:white;
		cursor: crosshair;
		width: ${CELL_SIZE}px;
		height: ${CELL_SIZE}px;

	}

	#palette-container{
		width:200px;
		position:fixed;
		top:0;
		bottom:0;
		right:0;
		overflow:auto;
		font-size:1.5rem;
		border-left: solid 1px darkgrey;
		background: #feffe8; /* Old browsers */
		background: -moz-linear-gradient(left, #feffe8 0%, #d6dbbf 100%); /* FF3.6-15 */
		background: -webkit-linear-gradient(left, #feffe8 0%,#d6dbbf 100%); /* Chrome10-25,Safari5.1-6 */
		background: linear-gradient(to right, #feffe8 0%,#d6dbbf 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
	}

	#palette {
		padding:1rem;
		text-align:center;
	}

	#palette .title {
		color:black;
		font-size:1.2rem;
		margin:0;
		padding:0;
		font-family:verdana;
		margin-bottom:1rem;
	}

	#palette div{
		display:inline-block;
		font-size: 32px;
		cursor: pointer;
		padding: 2px;

	}

	#palette div:hover{
		background-color:darkgrey;
	}

	
`

function injectCss(css) {
	const styleElem = document.createElement('style')
	styleElem.setAttribute('type', 'text/css')
	styleElem.textContent = css
    document.querySelector('head').appendChild(styleElem)
}


/*

GLOBALS and STATE
 	
 */



function getEmojiArray(emoji) {
	let array = []
	Object.keys(emoji).forEach((category)=>{
		array = array.concat(emoji[category].split(' '))
	})
	return array;
}


function initGrid(rows, cols) {

}

function renderPalette(emoji, container) {
	const markup= `
		<div id="palette">
			<h2 class="title">Palette</h2>
			${emoji.map((em, ix)=>{
				return `<div class='ej'data-ix=${ix} id='elem-${ix}'>${em}</div>`
			}).join('\n')}
		</div>
	`
	container.innerHTML = markup;

}

function renderGrid(grid, container) {
	const rows = Array(PARCEL_ROWS)
	for (var i = 0; i < rows.length; i++) {
		rows[i] = grid.slice(i, i+PARCEL_COLS)
	}


	let renderItem = item => `<div class="px"> ${item || '☺️'}  </div>`
	let renderRow = rowitems => `<div class="row">${rowitems.map(item=>renderItem(item)).join('')} </div>`

	const markup =  `
		${rows.map(r=>renderRow(r)).join('')}
	 `

	let gridElem = document.createElement('div');
	gridElem.classList.add('grid')
	gridElem.innerHTML = markup;
	container.appendChild(gridElem);

}

function setupEvents(events) {
	const palette = document.querySelector('#palette')
	palette.addEventListener('click', (ev)=>{
		if(ev.target.classList.contains('ej')){
			events.onBrushSelected(ev.target.getAttribute('data-ix'))
		}
	})

	const grid = document.querySelector('#grid-container')
	grid.addEventListener('click', (ev) =>{
		if(ev.target.classList.contains('px') ) {
			events.onPixelSelected(ev.target);
		}
	})

	document.addEventListener('keyup', (ev)=>{
		const allowed = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
		if(allowed.indexOf(ev.key) >= 0 ) {
			events.onArrowPressed(ev.key)
		}
	})
}


function init(state) {
	injectCss(css);
	renderPalette(state.emojis, document.querySelector('#palette-container'));
	setupEvents({
		onBrushSelected: (brush) => {
			state.brushIx = brush;
		},
		onPixelSelected: (pixelElem) => {
			pixelElem.innerHTML = state.emojis[state.brushIx]
		},
		onArrowPressed: (key) => {
			switch(key) {
				case "ArrowDown":
					move({y:100});
					break;
				case "ArrowLeft":
					move({x:-100});
					
					break;
				case "ArrowRight":
					move({x:100});
					break;
				case "ArrowUp":
					move({y:-100});
					break;
			}
		}
	})
	renderParcels(state.parcels);
}


function move({x=0, y=0}) {
	state.offset = {x:state.offset.x - x, y:state.offset.y - y}
	const grid = document.querySelector('.grid-scrollable-content')
	grid.style.transform = `translate(${state.offset.x}px, ${state.offset.y}px)`
}


function renderParcels(parcels) {
	parcels.forEach((parcel)=>{
		renderParcel(parcel);
	})
}

function renderParcel(parcel) {
	//get parcel location based on lat,lon
	let x = parcel.lat * PARCEL_WIDTH
	let y = parcel.lon * PARCEL_HEIGHT
	const parcelContainer = document.createElement('div');
	parcelContainer.id = 'parcel-'+parcel.lat+'-'+parcel.lon
	parcelContainer.style.transform = `translate(${x}px, ${y}px)`
	const gridContainer = document.querySelector('.grid-scrollable-content')
	gridContainer.appendChild(parcelContainer)
	renderGrid(parcel.grid, parcelContainer )

}



// The management state library (patent pending)
const state = {
	emptyIx: 50,
	parcels: [
		{
			grid: Array(PARCEL_CELLS).fill(''),
			lat: 0,
			lon: 0
		},
		{
			grid: Array(PARCEL_CELLS).fill(''),
			lat: 1,
			lon: 1
		}
	],
	emojis:  getEmojiArray(emoji),
	brushIx: 1,
	offset: {x:0, y:0}
}

init(state);