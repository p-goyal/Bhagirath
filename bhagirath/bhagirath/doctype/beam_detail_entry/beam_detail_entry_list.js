frappe.listview_settings['Beam Detail Entry'] = {
	add_fields: ['status', 'machine'],
	get_indicator: function(doc) {
		        if(doc.status==="Completed"){
	        	return [__(doc.status), "red", "status,=," + doc.status];
	        }
	        else if(doc.status==="in Stock"){
	        	return [__(doc.status), "yellow", "status,=," + doc.status];
	        }
	        else if(doc.status==="on Machine"){
	        	return [__(doc.status), "green", "status,=," + doc.status];
	        }
	        else{
	        	return [__(doc.status), "darkgrey", "status,=," + doc.statue];
	        }
	}
};