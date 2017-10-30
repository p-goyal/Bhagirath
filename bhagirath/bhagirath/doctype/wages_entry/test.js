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
frappe.ui.form.on("Wages Entry Detail", "refresh", function(frm, cdt, cdn) {
	grand_total = 0;
	var x = frm.doc.wages_rate;
        var j = locals[cdt][cdn];
        frappe.model.set_value(j.doctype, j.name, "amt", j.wages_meter*x);
	
	$.each(frm.doc.entry || [], function(i, d) {
	grand_total += flt(d.wages_meter);
	frm.set_value("taka_mtr", grand_total);
	cur_frm.refresh_field("entry");
	});
		});

frappe.ui.form.on("Wages Entry", "validate", function(frm) {
    if (frm.doc.taka_mtr >= 200) {
        frappe.msgprint(__("Taka Length cannot be more than 199 mtrs."));
        frappe.validated = false;
    }
});
