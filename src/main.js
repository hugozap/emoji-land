
/*
 A simple js file.
 Rendering is done with innerHTML.
*/
import * as emoji from './emoji';


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
		overflow: auto;
	}

	#grid {

	}

	#grid .row {
		display: flex;
		flex-direction:row;
	}

	#grid .row .px {
		font-size: 1rem;
		background-color:lightgrey;
		cursor: crosshair;
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
		font-size: 1.8rem;
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

function renderGrid(state) {
	const rows = Array(100)
	for (var i = 0; i < rows.length; i++) {
		rows[i] = state.grid.slice(i, i+100)
	}


	let renderItem = item => `<div class="px"> ${item || state.emojis[state.emptyIx]}  </div>`
	let renderRow = rowitems => `<div class="row">${rowitems.map(item=>renderItem(item)).join('')} </div>`

	const markup =  `<div id="grid">
		${rows.map(r=>renderRow(r)).join('')}
	 </div>`

	let gridElem = document.createElement('div');
	gridElem.innerHTML = markup;
	document.querySelector('#grid-container').appendChild(gridElem);

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
		}
	})
	renderGrid(state);
}




// The management state library (patent pending)
const state = {
	emptyIx: 50,
	grid: Array(100*100).fill('⬜️'),
	emojis:  getEmojiArray(emoji),
	brushIx: 1
}

init(state);