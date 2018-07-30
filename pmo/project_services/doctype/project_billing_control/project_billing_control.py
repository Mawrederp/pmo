# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ProjectBillingControl(Document):
	def make_invoice(self,project_name,scope_item,items_value,billing_percentage):
		frappe.get_doc({
			"doctype":"Sales Invoice",
			"customer": 'Ahmed',
			"project": project_name,
			"items": [
				  {
					"doctype": "Sales Invoice Item",
					"item_code": "02-01-160-2101",
					"rate": items_value,
					"qty": billing_percentage/100
				  }
				]
			
		}).insert(ignore_permissions=True)
