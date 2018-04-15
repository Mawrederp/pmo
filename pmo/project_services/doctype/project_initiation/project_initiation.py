# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document

class ProjectInitiation(Document):
	
	def on_submit(self):
		frappe.get_doc({
			"doctype": "Project",
			"project_name": self.project_name
		}).save(ignore_permissions = True)

		frappe.db.commit()

		frappe.get_doc({
			"doctype": "Project Planning",
			"project_name": self.project_name
		}).save(ignore_permissions = True)

		frappe.db.commit()

		pp = frappe.get_value("Project Planning", filters = {"project_name": self.project_name}, fieldname = "name")

		frappe.msgprint(_("""Project {project} and Project Planning have been created: <b><a href="#Form/Project Planning/{pp}">{pp}</a></b>""".format(project=self.project_name, pp = pp)))



@frappe.whitelist()
def get_project_detail(project, company=None):
	project_dict = frappe.db.sql("""select * from `tabProject Initiation` where name=%s""", (project), as_dict=1)
	if not project_dict:
		frappe.throw("Project {0} not found".format(project))

	project_financial_detail = frappe.db.sql(""" select * from `tabProject Financial Details` where parent=%s """, (project), as_dict=1)
	project_payment_schedule = frappe.db.sql(""" select * from `tabProject Payment Schedule` where parent=%s """, (project), as_dict=1)
	project_costing_schedule = frappe.db.sql(""" select * from `tabProject Costing Schedule` where parent=%s """, (project), as_dict=1)
	stakeholder = frappe.db.sql(""" select * from `tabStakeholder` where parent=%s """, (project), as_dict=1)
	project_major_deliverables = frappe.db.sql(""" select * from `tabProject Major Deliverables` where parent=%s """, (project), as_dict=1)
	project_high_level_risks = frappe.db.sql(""" select * from `tabProject Risk` where parent=%s """, (project), as_dict=1)
	vendor = frappe.db.sql(""" select * from `tabProject Vendor` where parent=%s """, (project), as_dict=1)


	details = project_dict[0]

	return details,project_financial_detail,project_payment_schedule,project_costing_schedule,stakeholder,project_major_deliverables,project_high_level_risks,vendor

