# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe
from frappe.utils import cstr, cint, getdate
from frappe import msgprint, _
from calendar import monthrange

def execute(filters=None):
	if not filters: filters = {}

	conditions, filters = get_conditions(filters)
	columns = get_columns(filters) #get web display columns
	att_map = get_attendance_list(conditions, filters) #[employee, day(attendance_date)] = Status (Present,absent..)
	emp_map = get_employee_details() # [name(=employee), employee_name, designation, department, branch, company, holiday_list]
	sal_map = get_salary_details()

	holiday_list = [emp_map[d]["holiday_list"] for d in emp_map if emp_map[d]["holiday_list"]]
	default_holiday_list = frappe.db.get_value("Company", filters.get("company"), "default_holiday_list")
	holiday_list.append(default_holiday_list)
	holiday_list = list(set(holiday_list))
	holiday_map = get_holiday(holiday_list, filters["month"])

	data = []
	for emp in sorted(att_map): #[employee, day(attendance_date)] = status
		sal_det = sal_map.get(emp) # salary structur employee maps into attendance details
		emp_det = emp_map.get(emp) # [employee, employee_name, designation, department, branch, company, holiday_list, day(attendance_date)] = status
		if not emp_det:
			continue

		row = [emp, emp_det.employee_name, emp_det.designation, emp_det.company, sal_det.base] #display columns

				
		total_p = total_a = total_l = total_pd = total_hol = 0.0
		for day in range(filters["total_days_in_month"]):
			status = att_map.get(emp).get(day + 1, "None")
			status_map = {"Present": "P", "Absent": "A", "Half Day": "HD", "On Leave": "L", "None": "", "Holiday":"<b>H</b>"}
			if status == "None" and holiday_map:
				emp_holiday_list = emp_det.holiday_list if emp_det.holiday_list else default_holiday_list
				if emp_holiday_list in holiday_map and (day+1) in holiday_map[emp_holiday_list]:
					status = "Holiday"
					total_hol += 1
			row.append(status_map[status])

			total_pd += 1

			if status == "Present":
				total_p += 1
			elif status == "Absent":
				total_a += 1
			elif status == "On Leave":
				total_l += 1
			elif status == "Half Day":
				total_p += 0.5
				total_a += 0.5				
		total_pd = total_pd - total_hol
		row += [total_p, total_l, total_a, total_pd, round(((row[4])/total_pd)*total_p)]
		data.append(row)
		#data[5]
	return columns, data

def get_columns(filters):
	columns = [
		_("Employee") + ":Link/Employee:80", _("Employee Name") + "::200", _("Designation") + ":Link/Designation:100",
		 _("Company") + ":Link/Company:120", _("Salary") + "::70"
	]

	for day in range(filters["total_days_in_month"]):
		columns.append(cstr(day+1) +"::20")

	columns += [_("Total Present") + ":Float:80", _("Total Leaves") + ":Float:80",  _("Total Absent") + ":Float:80",  _("Total Pay Day") + ":Float:80", _("Payment") + ":Float:80"]
	return columns

def get_attendance_list(conditions, filters):
	attendance_list = frappe.db.sql("""select employee, day(attendance_date) as day_of_month,
		status from tabAttendance where docstatus = 1 %s order by employee, attendance_date""" %
		conditions, filters, as_dict=1)

	att_map = {}
	for d in attendance_list:
		att_map.setdefault(d.employee, frappe._dict()).setdefault(d.day_of_month, "")
		att_map[d.employee][d.day_of_month] = d.status

	return att_map

def get_conditions(filters):
	if not (filters.get("month") and filters.get("year")):
		msgprint(_("Please select month and year"), raise_exception=1)

	filters["month"] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov",
		"Dec"].index(filters.month) + 1

	filters["total_days_in_month"] = monthrange(cint(filters.year), filters.month)[1]

	conditions = " and month(attendance_date) = %(month)s and year(attendance_date) = %(year)s"

	if filters.get("company"): conditions += " and company = %(company)s"
	if filters.get("employee"): conditions += " and employee = %(employee)s"

	return conditions, filters

def get_employee_details():
	emp_map = frappe._dict()
	for d in frappe.db.sql("""select name, employee_name, designation, department, branch, company,
		holiday_list from tabEmployee""", as_dict=1):
		emp_map.setdefault(d.name, d)

	return emp_map

def get_holiday(holiday_list, month):
	holiday_map = frappe._dict()
	for d in holiday_list:
		if d:
			holiday_map.setdefault(d, frappe.db.sql_list('''select day(holiday_date) from `tabHoliday`
				where parent=%s and month(holiday_date)=%s''', (d, month)))

	return holiday_map

def get_salary_details():
    	sal_map = frappe._dict()
	for d in frappe.db.sql("""select employee, employee_name, base from `tabSalary Structure Employee` order by employee""", as_dict=1):
		sal_map.setdefault(d.employee, d)

	return sal_map

@frappe.whitelist()
def get_attendance_years():
	year_list = frappe.db.sql_list("""select distinct YEAR(attendance_date) from tabAttendance ORDER BY YEAR(attendance_date) DESC""")
	if not year_list:
		year_list = [getdate().year]

	return "\n".join(str(year) for year in year_list)
