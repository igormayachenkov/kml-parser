//-------------------------------------------------------------
export class SortedList{
    constructor(arg){
        this.arg = arg
        this.body = arg.body
        this.indexes = {}		// Sorted id arrays ( indexes[order] must be valid )
        this.rows = null;		// Table rows collection
        this.isLoaded = false

        // INIT
        // Attach sort order menu
        this.header = arg.header
        if(this.header) this.header.table = this

        // Create indexes
        for(let key in this.arg.compare)
            this.indexes[key] = null;        
    }

	update(){
        console.log('SortedList.update', this)

		// Clear table
		this.body.children().detach();
		// Get active index
		var index = this.indexes[this.order];
		if(!index){// calculate if need
			index = [];
			for(let k in this.rows)
				index.push(k);
			index.sort(this.arg.compare[this.header?.order]);
		}
		// Load table according to the index
		index.forEach((key=>{
			this.body.append(this.rows[key]);
		}).bind(this));
	}
	
	//-----------------------------------------
	// INTERFACE
	// Append rows
	load(_rows){
        console.log('SortedList.load', this)

		// Update data
		if(_rows){
			if(!this.rows)
				this.rows = _rows; // copy
			else
				for(let id in _rows)this.rows[id]=_rows[id]; // update/append  rows
		}
		// Clear indexes
		for(let k in this.indexes) this.indexes[k]=null;
		// Update
		this.update();
	}
		
	empty(){
		// empty data
		this.rows = null;
		// Clear indexes
		for(let k in this.indexes) this.indexes[k]=null;
		// empty body
		this.body.empty();
        // clear flag
        this.isLoaded = false
	}
	getRow(id){
		if(this.rows)return this.rows[id];
		else 	return null;
	}
	
	// addRow/removeRow require index recalculation then
	removeRow(id){
		// Update rows
		this.body.remove(`[objid="${id}"]`);
		delete this.rows[id];
	}
	addRow(id, row){
		if(!this.rows) this.rows={}
		this.rows[id]=row;
	}

    createRow(id, obj){
        return $(`<div objid="${id}"></div>`)
    }
    updateRow(row, id, obj){
        console.error('Page.updateRow must be overriden')
    }

    //  - changes : Object or Map
    applyChanges(changes){
        console.log('applyChangesMap', changes)
        // Remove old changed state
        this.body.children().removeClass('changed')
        // Apply changes
        if(changes){
            let rows = {} // to update rows collection
            for(let id in changes){
                let obj = changes[id]
                let rowOld = this.getRow(id)
                let row = null
                if(rowOld){
                    // Update
                    row = rowOld
                    this.updateRow(row, id, obj)
                }else{
                    // Insert
                    row = this.createRow(id, obj);
                }
                // Put in to update rows collection
                if(row){
                    if(this.isLoaded) row.addClass('changed');

                    rows[id] = row
                }
            }
            this.load(rows)
        }
        // Set loaded state
        this.isLoaded = true
    }

    loadDataArray(array){
        if(!array) return
        // Fill rows
        let rows = {} // to update rows collection
        array.forEach((obj,id)=>{ // intex is id
            console.log(id, obj)
            rows[id] = this.createRow(id, obj)
        })
        // Reaload controls
        this.load(rows)
        // Set loaded state
        this.isLoaded = true

    }

}
