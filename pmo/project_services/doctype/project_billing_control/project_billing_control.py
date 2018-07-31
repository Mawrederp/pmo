# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ProjectBillingControl(Document):
	# def validate(self):
	# 	self.get_total_so_fat()


	# def get_total_so_fat(self):
	# 	total_scope_item = frappe.db.sql("""select project_name from `tabProject Billing Control` """)
	# 	for row in self.project_payment_schedule_control:
	# 		if row.billing_status and row.invoice:
	# 			row.invoice=0
	# 			frappe.throw("There is already invoice for this item")
	# 		elif row.invoice:
	# 			if total_scope_item :
	# 				self.total_scope_item_billing_so_far = frappe.db.sql("""select sum(payment.items_value) from `tabProject Payment Schedule` payment
	# 	 			join `tabProject Billing Control` billing on payment.parent=billing.name where payment.parenttype='Project Billing Control' 
	# 	 			and billing.project_name='{0}' and payment.invoice=1 and payment.scope_item='{1}' """.format(self.project_name,row.scope_item))[0][0]

	# 				self.total_project_billing_so_far = frappe.db.sql("""select sum(payment.items_value) from `tabProject Payment Schedule` payment
	# 	 			join `tabProject Billing Control` billing on payment.parent=billing.name where payment.parenttype='Project Billing Control' 
	# 	 			and billing.project_name='{0}' and payment.invoice=1 """.format(self.project_name))[0][0]

	# 				row.billing_status=1		 			



	def make_invoice(self,project_name,scope_item,items_value,billing_percentage):
		if not frappe.db.exists("Item", {"item_name": scope_item }):
			frappe.get_doc({
					"doctype":"Item",
					"item_group": 'Project',
					"item_code": scope_item,
					"item_name": scope_item,
					"is_stock_item": 0
				}).insert(ignore_permissions=True)

		customer = frappe.db.sql("select customer from `tabProject Initiation` where name='{0}' ".format(project_name))

		if customer:
			frappe.get_doc({
				"doctype":"Sales Invoice",
				"customer": customer[0][0],
				"project": project_name,
				"items": [
					  {
						"doctype": "Sales Invoice Item",
						"item_code": scope_item,
						"rate": items_value,
						"qty": billing_percentage/100
					  }
					]
				
			}).insert(ignore_permissions=True)
		else:
			frappe.throw('You sould select customer for this project before issue invoice')