/*
  Componente LandMap encargado de mostrar las parcelas 
  y la navegación entre ellas

  Las parcelas se representan en un objeto así:
  ABC
  DEF
  GHI

  Cuando hay movimientos se calcula lat,lon para cada
  una de las posiciones del objeto.

*/


//immutable point structure
class Point {

	constructor(x=0, y=0) {
		this.x = x;
		this.y = y;
	}
	add({x,y}) {
		return new Point(this.x+x, this.y+y)
	}
}

const defaultOpts = {
	parcelLength: 200
}

//relations between parcels (useful to recalculate)
const REF_MAP ={
			A:{lat:-1, lon:-1},
			B:{lat: 0, lon:-1},
			C:{lat: 1, lon:-1},
			D:{lat:-1, lon: 0},
			E:{lat: 0 ,lon: 0},
			F:{lat: 1, lon: 0},
			G:{lat:-1, lon: 1},
			H:{lat: 0, lon: 1},
			I:{lat: 1, lon: 1}
		}

class LandMap {

	constructor(opts = defaultOpts) {

		this.parcelLength = opts.parcelLength;
		//Active parcels
		this.parcelMap = {
			A:{lat:-1, lon:-1},
			B:{lat: 0, lon:-1},
			C:{lat: 1, lon:-1},
			D:{lat:-1, lon: 0},
			E:{lat: 0 ,lon: 0},
			F:{lat: 1, lon: 0},
			G:{lat:-1, lon: 1},
			H:{lat: 0, lon: 1},
			I:{lat: 1, lon: 1},
		}
		this.offset = new Point(0,0)
	}

	getActiveParcels() {
		return this.parcelMap;
	}

	move({x,y}) {
		this.offset = this.offset.add({x,y})
		this.recalculatePosition(this.offset);
	}

	recalculatePosition(offset) {

		const nextLat = Math.floor(offset.x / (this.parcelLength - 1));
		const nextLon = Math.floor(offset.y / (this.parcelLength - 1));
		const newOffset = {x: offset.x % this.parcelLength,y: offset.y % this.parcelLength}
		//calculate the new map
		const newParcelMap = {}
		//Use the reference map to calculate the lat, lon
		//based on the value of E (the center parcel)
		const centerParcel = {
			lat:nextLat,
			lon:nextLon
		}
		Object.keys(this.parcelMap).forEach((id)=>{
			newParcelMap[id] =  {
				lat: centerParcel.lat + REF_MAP[id].lat,
				lon: centerParcel.lon + REF_MAP[id].lon,
			}
		})
		this.parcelMap = newParcelMap;
		this.offset = newOffset;

	}
}

export {REF_MAP};
export default LandMap;