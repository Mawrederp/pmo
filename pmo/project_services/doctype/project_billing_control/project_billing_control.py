# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import cint, cstr, date_diff, flt, formatdate, getdate, get_link_to_form, \
	comma_or, get_fullname

class ProjectBillingControl(Document):
	def before_save(self):
		for row in self.project_payment_schedule_control:
			if row.date_period=='Date' and not row.when:
				frappe.throw("Mandatory field: When in table row {0}".format(row.idx))
			elif row.date_period=='Period' and not row.from_date:
				frappe.throw("Mandatory field: From Date in table row {0}".format(row.idx))
			elif row.date_period=='Period' and not row.to_date:
				frappe.throw("Mandatory field: To Date in table row {0}".format(row.idx))


	def make_sales_order(self,project_name,scope_item,items_value,billing_percentage,due_date,description_when,vat_value,billing_state,sales_order):
		arr=[]
		for row in self.project_payment_schedule_control:
			if row.invoice==1:
				arr.append(row.name)

		if sales_order and billing_state==1:
			frappe.throw("You make Sales Order for this item before")
		else:
			if arr and len(arr)==1:
				if not frappe.db.exists("Item", {"item_name": scope_item }):
					doc = frappe.new_doc("Item")
					doc.item_group = 'Project'
					doc.item_code = scope_item
					doc.item_name = scope_item
					doc.is_stock_item = 0
					doc.flags.ignore_mandatory = True
					doc.insert(ignore_permissions=True)


				item_name = frappe.get_value("Item", filters = {"item_name": scope_item}, fieldname = "name")    

				customer = frappe.db.sql("select customer from `tabProject Initiation` where name='{0}' ".format(self.project_name))

				resources_details_name = frappe.db.sql("select name from `tabResources Details` where parenttype='Project Initiation' and parent='{0}' and section_name='{1}' ".format(self.project_name,scope_item))
	
				if customer:
					sinv=frappe.get_doc({
						"doctype":"Sales Order",
						"customer": customer[0][0],
						"project": project_name,
						"naming_series": 'SO-',
						"delivery_date": due_date
						# "items": [
						# 	  {
						# 		"doctype": "Sales Order Item",
						# 		"item_code": item_name,
						# 		"description": description_when,
						# 		"qty": flt(flt(billing_percentage)/100),
						# 		"rate": items_value
						# 	  }
						# 	],
						# "taxes": [
						# 	  {
						# 		"doctype": "Sales Taxes and Charges",
						# 		"charge_type": 'Actual',
						# 		"description": description_when,
						# 		"tax_amount": vat_value
						# 	  }
						# 	]
					})

					for resource in resources_details_name:
						doc = frappe.get_doc("Resources Details",resource[0])

						sinv.append("items", {
							"item_code": doc.resources,
							"description": description_when,
							"qty": flt(flt(billing_percentage)/100),
							"rate": items_value
						})

						sinv.append("taxes", {
							"charge_type": 'Actual',
							"description": description_when,
							"tax_amount": vat_value
						})

					# sinv.flags.ignore_validate = True
					sinv.flags.ignore_mandatory = True
					sinv.insert(ignore_permissions=True)


					frappe.msgprint("Sales Order is created")
				else:
					frappe.throw('You sould select customer for this project before issue invoice')
			else:
				frappe.throw("You should check one invoice")

		return sinv.name
		




	def updat_init_payment_table_invoice(self,sales_order,itm,idx):
		init_payment_name = ''
		init_payment_name = frappe.db.sql("""
	 	select payment.name from `tabProject Payment Schedule` payment join `tabProject Initiation` init on payment.parent=init.name
	 	where payment.parenttype='Project Initiation' and init.name='{0}' and payment.scope_item='{1}'
	 	and payment.idx='{2}'
	 	""".format(self.project_name,itm,idx)) 
	 	if init_payment_name:
	 		init_payment_name=init_payment_name[0][0]

	 	doc = frappe.get_doc("Project Payment Schedule",init_payment_name)
		doc.sales_order = sales_order
		doc.flags.ignore_mandatory = True
		doc.save(ignore_permissions=True)

 		return init_payment_name



 	def get_total_billing_so_far(self):
 		total_project = 0
 		total_item = 0
		for row in self.project_payment_schedule_control:
			total_project = frappe.db.sql("""select sum(payment.items_value) from `tabProject Payment Schedule` payment
		 	 			join `tabProject Billing Control` billing on payment.parent=billing.name where payment.parenttype='Project Billing Control' 
		 	 			and billing.project_name='{0}' and payment.invoice=1 and payment.billing_status=1 """.format(self.project_name))
			
			total_project_count = frappe.db.sql("""select count(payment.items_value) from `tabProject Payment Schedule` payment
		 	 			join `tabProject Billing Control` billing on payment.parent=billing.name where payment.parenttype='Project Billing Control' 
		 	 			and billing.project_name='{0}' and payment.invoice=1 """.format(self.project_name))
			

			total_item = frappe.db.sql("""select sum(payment.items_value) from `tabProject Payment Schedule` payment
		 	 			join `tabProject Billing Control` billing on payment.parent=billing.name where payment.parenttype='Project Billing Control' 
		 	 			and billing.project_name='{0}' and payment.invoice=1 and payment.scope_item='{1}' """.format(self.project_name,row.scope_item))
			
		if total_project:
			total_project = total_project[0][0]
		else:
			total_project = 0

		if total_item:
			total_item = total_item[0][0]
		else:
			total_item = 0

		return total_project,total_item,total_project_count


