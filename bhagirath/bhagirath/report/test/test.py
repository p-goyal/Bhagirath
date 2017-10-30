# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe
from erpnext.controllers.trends	import get_columns,get_data
from frappe.utils import flt, cint, getdate
from frappe import _


def execute(filters=None):
	if not filters: filters = {}
	
	
	from_date = getdate(filters.get("from_date"))
	to_date = getdate(filters.get("to_date"))
		
	columns = get_columns()
	data = []
	datas = frappe.db.sql("""select v_date, employee, emp_name, sum(wages_meter) as wages_meter, sum(amt) as amt from `tabWages Entry Detail` 
	where v_date >= %(from_date)s and v_date <= %(to_date)s group by employee""", {'from_date': from_date, 'to_date': to_date}, as_dict=1)
	 
	for i in datas:
		row = [i.employee, i.emp_name, i.wages_meter, i.amt]
				
		data.append(row)
		
	return columns, data

def get_columns():
    	columns = [
			_("Employee") + ":Link/Employee:150", 
			_("Employee Name") + ":Link/Employee:150", 
			_("Wages Meter") + ":Float:100", 
			_("Amount") + ":Currency:100"
		]
	return columns

