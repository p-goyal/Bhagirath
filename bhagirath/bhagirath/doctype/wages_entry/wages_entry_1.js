// Copyright (c) 2017, Pradhuman and contributors
// For license information, please see license.txt

frappe.ui.form.on('Wages Entry', {
	refresh: function(frm) {
		cur_frm.refresh_field("entry");			
	}
});

frappe.ui.form.on('Wages Entry Detail', {
    entry_remove: function(frm) {
		var grand_total = 0;
		$.each(frm.doc.entry || [], function(i, d) {
			cur_frm.doc.entry[i].machine = cur_frm.doc.machine
			cur_frm.doc.entry[i].beam_no = cur_frm.doc.beam
			grand_total += flt(d.wages_meter);
			cur_frm.refresh_field("entry");		
		});
		frm.set_value("taka_mtr", grand_total);   
		//msgprint("Row Removed!");
	    }
});

frappe.ui.form.on("Wages Entry", {
	validate: function(frm) {
		console.log(frm);
		var x = frm.doc.beam_len;
		var t = frm.doc.taka_mtr;
		var a_len = 0;
		
		if (frm.doc.beam_bal == 0){
			frappe.msgprint(__("=0"));
			a_len = x;
			y = a_len - t;
			}
			frm.set_value("beam_bal", y);
		
		if (frm.doc.beam_bal != 0){
			frappe.msgprint(__("!=0"));
			a_len = frm.doc.beam_bal;
			y = a_len - t;
			}
			frm.set_value("beam_bal", y);
		
	}
}); 

frappe.ui.form.on("Wages Entry Detail", "wages_meter", function(frm, cdt, cdn) {

	var x = frm.doc.wages_rate;
	var j = locals[cdt][cdn];
	frappe.model.set_value(j.doctype, j.name, "amt", j.wages_meter*x);
	grand_total = 0;	
	
	$.each(frm.doc.entry || [], function(i, d) {
	cur_frm.doc.entry[i].machine = cur_frm.doc.machine
	cur_frm.doc.entry[i].beam_no = cur_frm.doc.beam
	grand_total += flt(d.wages_meter);
	cur_frm.refresh_field("entry");		
	});
	
	frm.set_value("taka_mtr", grand_total);

});


frappe.ui.form.on("Wages Entry", "onload", function(frm) {
	frm.fields_dict['beam'].get_query = function(doc) {
		return{	
			filters:[
				['machine', '=', frm.doc.machine],
				['status', '=', 'on Machine']
			]
		}
	}
	
	frm.fields_dict['item'].get_query = function(doc) {
		return{	
			filters:[
				['machine', '=', frm.doc.machine],
				['status', '=', 'on Machine']
			]
		}
	}

});

frappe.ui.form.on("Wages Entry", "validate", function(frm) {
	if (frm.doc.taka_mtr >= 200) {
	frappe.msgprint(__("Taka Length cannot be more than 199 mtrs."));
	frappe.validated = false;
	}
	
});



_____________________________


// Copyright (c) 2017, Pradhuman and contributors
// For license information, please see license.txt

frappe.ui.form.on('Wages Entry Detail', {
    entry_remove: function(frm) {
		var grand_total = 0;
		$.each(frm.doc.entry || [], function(i, d) {
			cur_frm.doc.entry[i].machine = cur_frm.doc.machine
			cur_frm.doc.entry[i].beam_no = cur_frm.doc.beam
			grand_total += flt(d.wages_meter);
			cur_frm.refresh_field("entry");		
		});
		frm.set_value("taka_mtr", grand_total);   
		//msgprint("Row Removed!");
	    }
});

frappe.ui.form.on("Wages Entry", {
	validate: function(frm) {
		console.log(frm);
		var bal = frm.doc.beam_bal;
		var t = frm.doc.taka_mtr;
		var s = frm.doc.short;
		
		y = bal - (s+t);
		frm.set_value("beam_bal", y);
	}	

}); 

frappe.ui.form.on("Wages Entry Detail", "wages_meter", function(frm, cdt, cdn) {

	var x = frm.doc.wages_rate;
	var j = locals[cdt][cdn];
	frappe.model.set_value(j.doctype, j.name, "amt", j.wages_meter*x);
	grand_total = 0;	
	
	$.each(frm.doc.entry || [], function(i, d) {
	cur_frm.doc.entry[i].machine = cur_frm.doc.machine
	cur_frm.doc.entry[i].beam_no = cur_frm.doc.beam
	grand_total += flt(d.wages_meter);
	cur_frm.refresh_field("entry");		
	});
	
	frm.set_value("taka_mtr", grand_total);

});


frappe.ui.form.on("Wages Entry", "onload", function(frm) {
	frm.fields_dict['beam'].get_query = function(doc) {
		return{	
			filters:[
				['machine', '=', frm.doc.machine],
				['status', '=', 'on Machine']
			]
		}
	}

});

frappe.ui.form.on("Wages Entry", "validate", function(frm) {
	if (frm.doc.taka_mtr >= 200) {
	frappe.msgprint(__("Taka Length cannot be more than 199 mtrs."));
	frappe.validated = false;
	}
	
});

frappe.ui.form.on("Wages Entry", {
	validate: function(frm) {
		frm.add_custom_button(__("Update"),
			function() {
				frappe.call({
					"method": "frappe.client.set_value",
					"args": {
						"doctype": "Beam Detail Entry",
						"name": frm.doc.beam,
						"fieldname": {
							"bal_mtr": frm.doc.beam_bal
						},
					}
				});
		});
	}
});

frappe.ui.form.on("Wages Entry", "refresh", function(frm) {
	frm.fields_dict['entry'].grid.get_field('employee').get_query = function(doc, cdt, cdn) {
	child = locals[cdt][cdn];
				return{	
			filters:[
				['employment_type', '=', 'Wages']
			]
		}
	}
	});
	