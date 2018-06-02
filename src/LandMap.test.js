import LandMap from './LandMap.js'

/**
 parcels are represented by this structure
ABC
DEF
GHI
**/

describe('LandMap tests', ()=>{
	it('Default instance state', ()=>{
		var lm = new LandMap();
		const active = lm.getActiveParcels()
		expect(active).toEqual({
			A:{lat:-1, lon:-1},
			B:{lat: 0, lon:-1},
			C:{lat: 1, lon:-1},
			D:{lat:-1, lon: 0},
			E:{lat: 0 ,lon: 0},
			F:{lat: 1, lon: 0},
			G:{lat:-1, lon: 1},
			H:{lat: 0, lon: 1},
			I:{lat: 1, lon: 1}
		})
	})

	it('Move n pixels to the right advances to the next parcel', ()=> {
		var lm = new LandMap({parcelLength:200})
		lm.move({x:200, y:0})
		const active = lm.getActiveParcels()
		//latitude increases by 1
		expect(active).toEqual({
			A:{lat:-1+1, lon:-1},
			B:{lat: 0+1, lon:-1},
			C:{lat: 1+1, lon:-1},
			D:{lat:-1+1, lon: 0},
			E:{lat: 0+1 ,lon: 0},
			F:{lat: 1+1, lon: 0},
			G:{lat:-1+1, lon: 1},
			H:{lat: 0+1, lon: 1},
			I:{lat: 1+1, lon: 1}
		})
	})
})