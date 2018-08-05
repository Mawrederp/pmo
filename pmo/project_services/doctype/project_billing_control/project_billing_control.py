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
	# def validate(self):
		# self.get_total_so_fat()


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



	def make_invoice(self,project_name,scope_item,items_value,billing_percentage,due_date,description_when,vat_value,billing_state,sales_invoice):
		arr=[]
		for row in self.project_payment_schedule_control:
			if row.invoice==1:
				arr.append(row.name)

		if billing_state==0:
			frappe.throw("You should make delivery note first")
		elif sales_invoice and billing_state==1:
			frappe.throw("You make Sales Invoice for this item before")
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

				if customer:
					sinv=frappe.get_doc({
						"doctype":"Sales Invoice",
						"customer": customer[0][0],
						"project": project_name,
						"naming_series": 'SINV-',
						# "due_date": due_date,
						# "debit_to": 'Debtors - O',
						"items": [
							  {
								"doctype": "Sales Invoice Item",
								"item_code": item_name,
								"description": description_when,
								"qty": flt(flt(billing_percentage)/100),
								"rate": items_value
							  }
							],
						"taxes": [
							  {
								"doctype": "Sales Taxes and Charges",
								"charge_type": 'Actual',
								"description": description_when,
								"tax_amount": vat_value
							  }
							]
					})
					# sinv.flags.ignore_validate = True
					sinv.flags.ignore_mandatory = True
					sinv.insert(ignore_permissions=True)


					frappe.msgprint("Sales invoice is created")
				else:
					frappe.throw('You sould select customer for this project before issue invoice')
			else:
				frappe.throw("You should check one invoice")

		return sinv.name
		





	def make_delivery_note(self,project_name,scope_item,items_value,billing_percentage,description_when,vat_value,billing_state):
		arr=[]
		for row in self.project_payment_schedule_control:
			if row.invoice==1:
				arr.append(row.name)

		if arr and len(arr)==1 and billing_state!=1:
			if not frappe.db.exists("Item", {"item_name": scope_item }):
				doc = frappe.new_doc("Item")
				doc.item_group = 'Project'
				doc.item_code = scope_item
				doc.item_name = scope_item
				doc.is_stock_item = 0
				doc.flags.ignore_validate = True
				doc.flags.ignore_mandatory = True
				doc.insert(ignore_permissions=True)


			item_name = frappe.get_value("Item", filters = {"item_name": scope_item}, fieldname = "name")    

			customer = frappe.db.sql("select customer from `tabProject Initiation` where name='{0}' ".format(self.project_name))

			if customer:
				sinv=frappe.get_doc({
					"doctype":"Delivery Note",
					"customer": customer[0][0],
					# "project": project_name,
					"naming_series": 'DN-',
					"workflow_state": 'Pending',
					"project": project_name,
					# "due_date": due_date,
					# "debit_to": 'Debtors - O',
					"items": [
						  {
							"doctype": "Delivery Note Item",
							"item_code": item_name,
							"description": description_when,
							"qty": flt(flt(billing_percentage)/100),
							"rate": items_value
						  }
						],
					"taxes": [
						  {
							"doctype": "Sales Taxes and Charges",
							"charge_type": 'Actual',
							"description": description_when,
							"tax_amount": vat_value
						  }
						]
				})
				# sinv.flags.ignore_validate = True
				sinv.flags.ignore_mandatory = True
				sinv.insert(ignore_permissions=True)

				frappe.msgprint("Delivery Note is created")
			else:
				frappe.throw('You sould select customer for this project before issue Delivery Note')
		else:
			frappe.throw("You should check one invoice to make Delivery Note, or this item may have delivery note")

		# init_payment_name = frappe.db.sql("""
		# 	select payment.name from `tabProject Payment Schedule` payment join `tabProject Initiation` init on payment.parent=init.name
		# 	where payment.parenttype='Project Initiation' and init.project_name='{0}' and payment.scope_item='data23'
		# 	and payment.idx='2'
		# 	""".format(self.project_name,)) 

		return sinv.name
		



	def updat_init_payment_table(self,delivery_note,itm,idx):
		init_payment_name = ''
		init_payment_name = frappe.db.sql("""
	 	select payment.name from `tabProject Payment Schedule` payment join `tabProject Initiation` init on payment.parent=init.name
	 	where payment.parenttype='Project Initiation' and init.name='{0}' and payment.scope_item='{1}'
	 	and payment.idx='{2}'
	 	""".format(self.project_name,itm,idx)) 
	 	if init_payment_name:
	 		init_payment_name=init_payment_name[0][0]

	 	doc = frappe.get_doc("Project Payment Schedule",init_payment_name)
		doc.billing_status = 1
		doc.delivery_note = delivery_note
		doc.flags.ignore_mandatory = True
		doc.save(ignore_permissions=True)

 		return init_payment_name




	def updat_init_payment_table_invoice(self,sales_invoice,itm,idx):
		init_payment_name = ''
		init_payment_name = frappe.db.sql("""
	 	select payment.name from `tabProject Payment Schedule` payment join `tabProject Initiation` init on payment.parent=init.name
	 	where payment.parenttype='Project Initiation' and init.name='{0}' and payment.scope_item='{1}'
	 	and payment.idx='{2}'
	 	""".format(self.project_name,itm,idx)) 
	 	if init_payment_name:
	 		init_payment_name=init_payment_name[0][0]

	 	doc = frappe.get_doc("Project Payment Schedule",init_payment_name)
		doc.sales_invoice = sales_invoice
		doc.flags.ignore_mandatory = True
		doc.save(ignore_permissions=True)

 		return init_payment_name




	# def get_init_payment_name(self,delivery_note,itm,idx):
	# 	init_payment_name = ''
	# 	init_payment_name = frappe.db.sql("""
	#  	select payment.name from `tabProject Payment Schedule` payment join `tabProject Initiation` init on payment.parent=init.name
	#  	where payment.parenttype='Project Initiation' and init.name='{0}' and payment.scope_item='{1}'
	#  	and payment.idx='{2}'
	#  	""".format(self.project_name,itm,idx)) 
	#  	if init_payment_name:
	#  		init_payment_name=init_payment_name[0][0]

	#  	update_payment =frappe.db.sql("""
	#  	update `tabProject Payment Schedule` payment join `tabProject Initiation` init on payment.parent=init.name
	#  	set payment.billing_status=1,payment.delivery_note='{0}' where payment.parenttype='Project Initiation' and init.name='{1}' and payment.scope_item='{2}'
	#  	and payment.idx='{3}'
	#  	""".format(delivery_note,self.project_name,itm,idx))

 # 		return init_payment_name





	



