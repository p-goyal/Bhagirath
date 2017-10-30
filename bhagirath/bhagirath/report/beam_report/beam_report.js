// Copyright (c) 2016, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Beam Report"] = {
	"filters": [
		{
			"fieldname": "name",
			"label": __("Beam No"),
			"fieldtype": "Link",
			"width": "80",
            "options": "Beam Detail Entry",
            "reqd": 1,
                
		},
	]

  

}


