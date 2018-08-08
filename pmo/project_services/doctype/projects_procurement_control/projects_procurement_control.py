# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ProjectsProcurementControl(Document):
	

	def make_material_request(self,scope_item,description_comments,last_date,material_request):
		arr=[]
		for row in self.project_costing_schedule_control:
			if row.pr==1:
				arr.append(row.name)

		if arr and len(arr)==1 and not material_request:
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

			mreq=frappe.get_doc({
				"doctype":"Material Request",
				"naming_series": 'MREQ-',
				# "workflow_state": 'Pending',
				"material_request_type": 'Purchase',
				# "due_date": due_date,
				# "debit_to": 'Debtors - O',
				"items": [
					  {
						"doctype": "Material Request Item",
						"item_code": item_name,
						"description": description_comments,
						"qty": 50,
						"schedule_date": last_date
					  }
					]
			})
			# mreq.flags.ignore_validate = True
			mreq.flags.ignore_mandatory = True
			mreq.insert(ignore_permissions=True)

			frappe.msgprint("Material Request is created")
			
		else:
			frappe.throw("You should check one PR to make Material Request, or this item may have already Material Request")


		return mreq.name





	def updat_material_costing_table(self,material_request,itm,idx):
		material_costing_name = ''
		material_costing_name = frappe.db.sql("""
	 	select costing.name from `tabProject Costing Schedule` costing join `tabProject Initiation` init on costing.parent=init.name
	 	where costing.parenttype='Project Initiation' and init.name='{0}' and costing.scope_item='{1}'
	 	and costing.idx='{2}'
	 	""".format(self.project_name,itm,idx)) 
	 	if material_costing_name:
	 		material_costing_name=material_costing_name[0][0]

	 	doc = frappe.get_doc("Project Costing Schedule",material_costing_name)
		doc.material_request = material_request
		doc.flags.ignore_mandatory = True
		doc.save(ignore_permissions=True)

 		return material_costing_name

		
