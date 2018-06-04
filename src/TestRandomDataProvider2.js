import EventEmitter from 'events'

class TestDataProvider extends EventEmitter {
	constructor() {
		super();
	}

	monitorArea(from, to) {
		let lat = 0
			let lon = 0
			this.emit('item', {
				id:Math.random()*100,
				text:'Some text' + Math.random()*2000,
				lat,
				lon,
			})

	}
}
export default TestDataProvider