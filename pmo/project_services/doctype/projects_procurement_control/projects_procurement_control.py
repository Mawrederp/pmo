# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ProjectsProcurementControl(Document):
	def before_save(self):
		for row in self.project_costing_schedule_control:
			if not row.last_date:
				frappe.throw("Mandatory field: Last Date in table row {0}".format(row.idx))

			if not row.scope_item:
				frappe.throw("Mandatory field: Scope Item in table row {0}".format(row.idx))
	

	def make_material_request(self,scope_item,description_comments,last_date,material_request,cost_status):
		arr=[]
		for row in self.project_costing_schedule_control:
			if row.pr==1:
				arr.append(row.name)

		if cost_status==1:
			frappe.throw("You made Material Request for this item before!")
		else:
			if arr and len(arr)==1:
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

				resources_details_name = frappe.db.sql("select name from `tabResources Details` where parenttype='Project Initiation' and parent='{0}' and section_name='{1}' ".format(self.project_name,scope_item))

				mreq=frappe.get_doc({
					"doctype":"Material Request",
					"naming_series": 'MREQ-',
					# "workflow_state": 'Pending',
					"material_request_type": 'Purchase',
					"schedule_date": last_date
					# "due_date": due_date,
					# "debit_to": 'Debtors - O',
					
					# "items": [
					# 	  {
					# 		"doctype": "Material Request Item",
					# 		"item_code": item_name,
					# 		"description": description_comments,
					# 		# "qty": 50,
					# 		"schedule_date": last_date
					# 	  }
					# 	]
				})

				for resource in resources_details_name:
					doc = frappe.get_doc("Resources Details",resource[0])

					mreq.append("items", {
						"item_code": doc.resources,
						"description": description_comments,
						"schedule_date": last_date
					})


				# mreq.flags.ignore_validate = True
				mreq.flags.ignore_mandatory = True
				mreq.insert(ignore_permissions=True)
				frappe.msgprint("Material Request is created")
				
			else:
				frappe.throw("You should check one PR to make Material Request, or this item may have already Material Request")


		return mreq.name





	def updat_material_costing_table(self,material_request,itm,idx,scope_item_cost_value,po_contract_extimated_cost):
		material_costing_name = ''
		material_costing_name = frappe.db.sql("""
	 	select costing.name from `tabProject Costing Schedule` costing join `tabProject Initiation` init on costing.parent=init.name
	 	where costing.parenttype='Project Initiation' and init.name='{0}' and costing.scope_item='{1}'
	 	and costing.scope_item_cost_value='{2}' and costing.po_contract_extimated_cost='{3}'
	 	""".format(self.project_name,itm,scope_item_cost_value,po_contract_extimated_cost)) 
	 	if material_costing_name:
	 		material_costing_name=material_costing_name[0][0]
		
	 	doc = frappe.get_doc("Project Costing Schedule",material_costing_name)
		if doc.scope_item == itm and doc.scope_item_cost_value == scope_item_cost_value and doc.po_contract_extimated_cost == po_contract_extimated_cost:
			doc.material_request = material_request
			doc.cost_status = 1
			doc.flags.ignore_mandatory = True
			doc.save(ignore_permissions=True)

 		return material_costing_name

		
