//-------------------------------------------------------------
// List                 - simple list control. Loads all data once: loadDataArray(array)
// SortedList           - plus sort by indexes (compare in parameters)
// UpdateableSortedList  - allows update some rows applyChanges(channges). 
//                        Data objects must have id field

//-------------------------------------------------------------
// BASE LIST
// Arguments
//  body : jQuery - list container 
export class List{
    constructor(arg){
        this.body     = arg.body
        this.data     = null
        this.isLoaded = false
    }
	
	empty(){
		// empty body
		this.body.empty();
        // clear flag
        this.data = null
        this.isLoaded = false
	}
	
    createRow(obj, id){
        return $(`<div objid="${id}"></div>`)
    }
    appendRows(rows){
        this.body.append(rows)
    }

    //  - array : data array
    loadDataArray(array){
        // Verify & save data
        if(!array) return
        this.data = array // TODO: copy data array?
        // Empty if need
        if(this.isLoaded) 
            this.empty()
        // Fill rows
        let rows = [] 
        array.forEach((obj,index)=>{ 
            rows.push(this.createRow(obj, index))// intex as id
        })
        // Reaload controls
        this.appendRows(rows)
        // Set loaded state
        this.isLoaded = true

    }
}

//-------------------------------------------------------------------------
// SORTED LIST
// Arguments
//  compare - set of compare functions
//  header  - sort order change control. Must implement header.order prop
export class SortedList extends List{
    constructor(arg){
        super(arg)
        this.compare = arg.compare
        this.header  = arg.header
        this.indexes = {}		// Sorted row arrays ( indexes[order] must be valid )
        // INIT
        // Attach sort order menu
        this.header.table = this
        // Create indexes 
        for(let key in this.compare){
            this.indexes[key] = null
        } 
        // Bind handlers
        this.compareRows = this.compareRows.bind(this)     

    }
    compareRows(rowA, rowB){
        //console.log('compare',this,rowA.attr('objid'), rowB.attr('objid'))
        const idA = rowA.attr('objid')
        const idB = rowB.attr('objid')
        //console.log('compare', this.data, idA, idB)
        const objA = this.data[rowA.attr('objid')]
        const objB = this.data[rowB.attr('objid')]
        //console.log('compare', objA, objB)
        const compareFunc = this.compare[this.header.order]
        return compareFunc?compareFunc(objA,objB):0
    }

    appendRows(rows){ // override
        // Get active index
        var index = this.indexes[this.header.order];//active sort order
        if(!index){// calculate if need
            index = rows
            //index.sort(this.compare[order]);
            index.sort(this.compareRows);
        }
        // Load table according to the index
        this.body.append(index)

    }

    sortExistedRows(){
        // Detach rows from the table
        let children = this.body.children()
        children.detach()
        // Resort and append
        this.appendRows(children.toArray())
    }

}
//-------------------------------------------------------------------------

// TODO

export class UpdateableSortedList{
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

}
