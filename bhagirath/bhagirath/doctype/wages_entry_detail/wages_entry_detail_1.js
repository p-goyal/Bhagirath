// Copyright (c) 2017, Pradhuman and contributors
// For license information, please see license.txt

frappe.ui.form.on('Wages Entry Detail', {
	refresh: function(frm) {
		frm.add_fetch('Employee', 'employee_name', 'emp_name');
	
	}
});

