// Copyright (c) 2017, Pradhuman and contributors
// For license information, please see license.txt

frappe.ui.form.on("Beam Detail Entry", "b_len", function(frm, cdt, cdn) {
		var x = flt(frm.doc.b_len);
		frm.set_value("bal_mtr", x);
		});


frappe.ui.form.on("Beam Detail Entry", "validate", function(frm) {
	
	if (frm.doc.bf_date < frm.doc.bi_date) {
		frappe.msgprint(__("Check Beam Installation Date"));
		validated = false;
		return;
	}
	
	if (frm.doc.bi_date < frm.doc.b_date) {
		frappe.msgprint(__("Check Beam Fall Dates"));
		validated = false;
		return;
	}

	if (frm.doc.b_date < get_today()) {
        frappe.msgprint(__("You can not select future date in Beam Mfg. Date"));
		frappe.validated = false;
		return;
    }
	
	
});

frappe.ui.form.on("Beam Detail Entry", "machine", function(frm) {
	
	frm.set_df_property("machine", "read_only", frm.doc.__islocal ? 0 : 1);
});
