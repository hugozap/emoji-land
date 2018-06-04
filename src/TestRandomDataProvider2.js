import EventEmitter from 'events'

class TestDataProvider extends EventEmitter {
	monitorArea(from, to) {
		setInterval(()=>{
			this.emit('item', {
				id:Math.random()*100,
				text:'Some text',
				lat: Math.random() * (to.lat - from.lat) + from.lat,
				lon: Math.random() * (to.lon - from.lon) + from.lon,
			})
		})
	}
}
export default TestDataProvider