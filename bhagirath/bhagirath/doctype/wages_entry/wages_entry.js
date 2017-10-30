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
		msgprint("Row Removed!, Taka Meter Updated!");
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

	frm.fields_dict['entry'].grid.get_field('employee').get_query = function(doc, cdt, cdn) {
		child = locals[cdt][cdn];
					return{	
				filters:[
					['employment_type', '=', 'Wages']
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

/* frappe.ui.form.on("Wages Entry", {
	button: function(frm) {
		console.log(frm);
		frappe.call({
			"method": "frappe.client.set_value",
				"args": {
					"doctype": "Beam Detail Entry",
					"name": frm.doc.beam,
					"fieldname": "bal_mtr",
					"value": frm.doc.beam_bal
						
				}
				
		});
	}
}); */

/* frappe.ui.form.on("Wages Entry", {
	validate: function(frm) {
		console.log(frm);
		var y = 0;
		var bal = frm.doc.beam_bal;
		var t = frm.doc.taka_mtr;
		var s = frm.doc.short;
		
		y = bal - (s+t);
		
		frm.set_value("beam_bal", y);

	}	

});  */
