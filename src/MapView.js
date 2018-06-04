import LandMap,{REF_MAP} from './LandMap'
import * as domUtils from './domUtils'

/**
 La clase mapview se encarga de manipular el DOM para
 mostrar las parcelas
**/

const defaultOpts = {
	containerElement: 'body',
	itemRenderer: null,
	parcelLength: 200,
	dataProvider: null
}

//TODO: add base css here

const css = `

	.content-container {
		position: absolute;
		top: 0;
		left: 0;
		transition: transform 0.3s;
	}

	.parcel-container {
		position: absolute;
		top:0;
		left: 0;
		background: darkgrey;
		box-sizing: border-box;
		border: solid 1px white;
	}
`

domUtils.injectCSS(css);

export default class MapView {

	constructor(opts) {
		opts = Object.assign({}, defaultOpts,  opts);
		this.opts = opts; 
		this.dataProvider = opts.dataProvider;
		this.container = typeof opts.containerElement === 'string' ? 
			document.querySelector(opts.containerElement) :
			opts.containerElement

		this.map = new LandMap({
			parcelLength: opts.parcelLength
		})
		this.initDOM()
		this.attachEvents()
		this.updateMap
	}

	initDOM() {
		//Create contentContainer
		this.contentContainer = this.createContentContainer();
		this.createParcelContainers(this.contentContainer);

	}

	createContentContainer() {
		var contentContainer = document.createElement('div');
		contentContainer.classList.add('content-container');
		this.container.appendChild(contentContainer);
		return contentContainer
	}

	createParcelContainers(parent) {
		let parcelLength = this.opts.parcelLength;
		//Create element containers for all 9 parcels
		Object.keys(REF_MAP).forEach((parcelId)=>{
			//get ref location 
			let refLocation = REF_MAP[parcelId]
			let parcelContainer = document.createElement('div')
			//get the translate values for the parcel
			let parcelOffset = {
				x: parcelLength * refLocation.lat,
				y: parcelLength * refLocation.lon
			}
			parcelContainer.style.transform = `translate(${parcelOffset.x}px,${parcelOffset.y}px)`
			parcelContainer.style.width = parcelLength + 'px'
			parcelContainer.style.height = parcelLength + 'px'
			parcelContainer.classList.add('parcel-container')
			parent.appendChild(parcelContainer);
		})	
	}



	attachEvents() {
		this.connectToDataProvider();
		this.addKeyboardEvents();
		this.addMouseEvents()
	}

	connectToDataProvider() {
		this.dataProvider.on('item', (item)=>{
			console.log('item received,', item)
			let itemElem = this.createItemElement(item);
			//todo: add to a itemcontainr layer
			this.contentContainer.appendChild(itemElem);
			//set position
			let pos = this.getItemPosition(itemElem);
			itemElem.style.transform = `translate(${pos.x}px,${pos.y}px)`

		})
	}

	getItemPosition(item) {
		//calculate item the pixel position

		return {
			x: (item.lat - this.map['A'].lat ) * this.opts.parcelLength,
			y: (item.lon - this.map['A'].lon ) * this.opts.parcelLength
		}
	}

	createItemElement(item) {
		//todo delegate this to item renderer
		var elem = document.createElement('div')
		elem.innerText = item.text;
		elem.classList.add('item')
		return elem;
	}

	addKeyboardEvents() {

	}

	addMouseEvents() {

	}

}

