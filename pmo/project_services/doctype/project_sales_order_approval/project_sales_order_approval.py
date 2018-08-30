# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import cint, cstr, date_diff, flt, formatdate, getdate, get_link_to_form, \
	comma_or, get_fullname

class ProjectSalesOrderApproval(Document):
	def make_sales_order(self,description_when):
		if self.sales_order:
			frappe.throw("You make Sales Order for this item before")
		else:
			if not frappe.db.exists("Item", {"item_name": self.scope_item }):
				doc = frappe.new_doc("Item")
				doc.item_group = 'Project'
				doc.item_code = self.scope_item
				doc.item_name = self.scope_item
				doc.is_stock_item = 0
				doc.flags.ignore_mandatory = True
				doc.insert(ignore_permissions=True)

			item_name = frappe.get_value("Item", filters = {"item_name": self.scope_item}, fieldname = "name")    

			if self.customer:
				sinv=frappe.get_doc({
					"doctype":"Sales Order",
					"customer": self.customer,
					"project": self.project_name,
					"naming_series": 'SO-',
					"delivery_date": self.delivery_date,
					"items": [
						  {
							"doctype": "Sales Order Item",
							"item_code": item_name,
							"description": description_when,
							"qty": flt(flt(self.billing_percentage)/100),
							"rate": self.items_value
						  }
						],
					"taxes": [
						  {
							"doctype": "Sales Taxes and Charges",
							"charge_type": 'Actual',
							"description": description_when,
							"tax_amount": self.vat_value
						  }
						],
					"taxes_and_charges": "VAT"
				})

				
				# sinv.flags.ignore_validate = True
				sinv.flags.ignore_mandatory = True
				sinv.insert(ignore_permissions=True)


				frappe.msgprint("Sales Order is created")
			else:
				frappe.throw('You sould select customer for this project before issue invoice')
			

		return sinv.name
		


	def updat_init_payment_table_invoice(self,sales_order):
		init_payment_name = ''
		init_payment_name = frappe.db.sql("""
	 	select payment.name from `tabProject Payment Schedule` payment join `tabProject Initiation` init on payment.parent=init.name
	 	where payment.parenttype='Project Initiation' and init.name='{0}' and payment.scope_item='{1}'
	 	and payment.billing_percentage='{2}' and payment.total_billing_value='{3}' and payment.remaining_billing_value='{4}'
	 	""".format(self.project_name,self.scope_item,self.billing_percentage,self.total_billing_value,self.remaining_billing_value)) 
	 	if init_payment_name:
	 		init_payment_name=init_payment_name[0][0]

	 	doc = frappe.get_doc("Project Payment Schedule",init_payment_name)
		doc.sales_order = sales_order
		doc.billing_status = 1
		doc.flags.ignore_mandatory = True
		doc.save(ignore_permissions=True)

 		return init_payment_name


