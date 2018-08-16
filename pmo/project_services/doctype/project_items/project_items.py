# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ProjectItems(Document):
	def validate(self):
		myitem = frappe.get_doc({
			"doctype":"Item",
			"item_name":self.project_item,
			"item_group" : "Project",
			"item_code" : self.project_item
		})
		myitem.insert()
		
